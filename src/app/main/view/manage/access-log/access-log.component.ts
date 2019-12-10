import { AccessLog } from 'ts/data/entity/entity';
import { AccessLogService } from 'ts/service/core/access-log-service';
import { AjaxUtil } from '@cui/core';
import { AppConfig } from 'ts/app-config';
import { BasicComponent } from 'app/basic-component';
import { Cache, CUI, Grid } from '@cui/core';
import { DateUtil } from 'ts/util/date-util';
import { DomUtil } from 'ts/util/dom-util';
import { GridRenderUtil } from 'ts/util/grid-render-util';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { ApiService } from 'ts/service/core/api-service';


interface SearchForm {
  startTime: string;
  endTime: string;
  service: string;
  url: string;
  ip: string;
  location: string;
  user: string;
  status: string;
  method: string;
}

function defaultForm(): SearchForm {
  return {
    startTime: DateUtil.now(AppConfig.TodayStartYYYYMMDDHHmmss) as string,
    endTime: DateUtil.now(AppConfig.TodayEndYYYYMMDDHHmmss) as string,
    service: '',
    url: '',
    ip: '',
    location: '',
    user: '',
    status: '',
    method: ''
  };
}

@Component({
  selector: 'app-access-log',
  templateUrl: './access-log.component.html',
  styleUrls: ['./access-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessLogComponent extends BasicComponent {
  public grid: Grid.Grid<AccessLog>;

  @Cache.session('AccessLog', defaultForm())
  public searchForm: SearchForm;

  public apiName = {};

  constructor() {
    super();
    this.grid = this.buildGrid();
    ApiService.query({}, (result) => {
      if (result.success) {
        result.data.forEach(a => {
          this.apiName[a.path] = a.remark;
        });
        this.search();
      } else {
        alert(result.message);
      }
    });
  }

  /**
   * 查詢
   */
  public search() {
    this.grid.load();
  }

  /**
   * 清除查詢條件
   */
  public clean() {
    this.searchForm = defaultForm();
  }


  /**
   * 將商戶資料複製到剪貼簿
   */
  public copy(record: AccessLog, index, e: Event) {
    e.stopPropagation();
    DomUtil.copyText(JSON.stringify({
      url: record.url
      , method: record.method.toLocaleLowerCase()
      , headers: record.requestHeader
      , params: record.requestParameter
      , body: record.requestBody
    }));
  }

  /**
   * 刪除
   */
  public remove() {
    if (!window.confirm('您確定要刪除紀錄?')) {
      return;
    }
    let param = CUI.deepClone(this.searchForm);
    param.startTime = DateUtil.time(param.startTime);
    param.endTime = DateUtil.time(param.endTime) + 999;
    AccessLogService.remove(param, (result) => {
      if (result.success) {
        this.grid.load();
      } else {
        alert(AjaxUtil.getMessage(result));
      }
    });
  }

  /**
   * 產生grid
   */
  private buildGrid() {
    return Grid.PageGridBuilder.build({
      index: true,
      size: 100,
      singleSort: false,
      rowColumns: [
        {
          value: '', name: '操作', align: 'left', width: '1%', element: true, tdTranslate: true
          , onRender: (value, record, index) => {
            return DomUtil.buildButton({
              text: '複製',
              className: 'bg-primary small ',
              onclick: this.copy.bind(this, record, index)
            });
          }
        }
        , {
          value: 'time', name: '時間', align: 'left', width: '1%', canSort: true, sort: Grid.Sort.Desc
          , onRender: GridRenderUtil.date
        }
        , { value: 'ms', name: '處理時間', align: 'left', width: '1%', canSort: true }
        , { value: 'service', name: '服務名稱', align: 'left', width: '1%', canSort: true }
        , { value: 'status', name: '狀態', align: 'center', width: '1%', canSort: true }
        , { value: 'url', name: '網址', align: 'left', width: '1%', maxWidth: '400px', canSort: true }
        , {
          value: 'url', name: '描述', align: 'left', width: '1%'
          , onRender: (value, record, index) => {
            if (value) {
              return this.apiName[value.replace(/[^/]+\/\/[^/]+\//, '/')] || '';
            } else {
              return '';
            }
          }
        }
        , { value: 'method', name: 'Method', align: 'left', width: '1%', canSort: true }
        , { value: 'ip', name: 'IP', align: 'left', width: '1%', canSort: true }
        , { value: 'user', name: '使用者', align: 'left', width: '1%', canSort: true, onRender: GridRenderUtil.user }
        , { value: 'sessionId', name: 'SESSIONID', align: 'left', width: '1%', canSort: true }
        , { value: 'location', name: '位置', align: 'left', width: '100%', canSort: true }
      ]
      , contentColumns: [
        {
          value: 'url', name: '網址'
        }
        , {
          value: 'requestHeader', name: '請求表頭'
        }
        , {
          value: 'requestParameter', name: '請求參數'
        }
        , {
          value: 'requestBody', name: 'Body', element: true
          , onRender: GridRenderUtil.viewerJson
        }
        , {
          value: 'responseHeader', name: '回覆表頭'
        }, {
          value: 'responseContent', name: '回覆內容', element: true
          , onRender: GridRenderUtil.viewerJson
        }
        , { value: 'remark', name: '備註' }
      ]
      , onLoad: (pageable: Grid.IPageable, callback: Grid.ILoad<AccessLog>) => {
        let param = CUI.deepClone({}, pageable);
        CUI.deepClone(param, this.searchForm);
        param.startTime = DateUtil.time(param.startTime);
        param.endTime = DateUtil.time(param.endTime) + 999;
        AccessLogService.page(param, (result) => {
          if (result.success) {
            callback(result.data);
          } else {
            alert(AjaxUtil.getMessage(result));
          }
        });
      }
    });
  }
}
