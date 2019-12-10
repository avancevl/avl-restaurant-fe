import { AccessLog } from 'ts/data/entity/entity';
import { AccessLogService } from 'ts/service/core/access-log-service';
import { AjaxUtil } from '@cui/core';
import { AppConfig } from 'ts/app-config';
import { CUI, Grid, Cache } from '@cui/core';
import { DateUtil } from 'ts/util/date-util';
import { GridRenderUtil } from 'ts/util/grid-render-util';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { BasicComponent } from '../../../../basic-component';


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
    method: '',
  };
}

@Component({
  selector: 'app-access-log-group',
  templateUrl: './access-log-group.component.html',
  styleUrls: ['./access-log-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessLogGroupComponent extends BasicComponent {
  public grid: Grid.PageGrid<AccessLog>;

  @Cache.session('AccessLogGroup', defaultForm())
  public searchForm: SearchForm;
  public currentSearchForm: SearchForm;

  constructor(private cdf: ChangeDetectorRef) {
    super();
    this.grid = this.buildGrid();
    this.search();
  }

  /**
   * 查詢
   */
  public search() {
    this.currentSearchForm = CUI.deepClone(this.searchForm);
    this.grid.load();
  }

  /**
   * 清除查詢條件
   */
  public clean() {
    this.searchForm = defaultForm();
  }

  /**
   * 刪除
   */
  public delete() {
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
      size: 100,
      rowColumns: [
        { value: 'service', name: '服務名稱', align: 'left', width: '1%', canSort: true }
        , { value: 'user', name: '使用者', align: 'left', width: '1%', canSort: true }
        , { value: 'count', name: '次數', align: 'left', width: '1%', canSort: true }
        , { value: 'ip', name: 'IP', align: 'left', width: '1%', canSort: true }
        , { value: 'location', name: '位置', align: 'left', width: '100%', canSort: true }
      ]
      , contentColumns: [
        {
          value: '', name: '', className: '', element: true
          , onRender: (value, record: AccessLog, index: number) => {
            let form = CUI.deepClone(this.currentSearchForm, record);
            return this.buildDetilGrid(form);
          }
        }
      ]
      , onLoad: (pageable: Grid.IPageable, callback: Grid.ILoad<AccessLog>) => {
        let param = CUI.deepClone({}, pageable);
        CUI.deepClone(param, this.searchForm);
        param.startTime = DateUtil.time(param.startTime);
        param.endTime = DateUtil.time(param.endTime) + 999;
        AccessLogService.groupPage(param, (result) => {
          if (result.success) {
            callback(result.data);
          } else {
            alert(AjaxUtil.getMessage(result));
          }
        });
      }
    });
  }

  private buildDetilGrid(detilSearchForm) {
    let grid = Grid.PageGridBuilder.build({
      size: 10,
      rowColumns: [
        {
          value: 'time', name: '時間', align: 'left', width: '1%', canSort: true, sort: Grid.Sort.Desc
          , onRender: GridRenderUtil.date
        }
        , { value: 'ms', name: '處理時間', align: 'left', width: '1%', canSort: true }
        , { value: 'service', name: '服務名稱', align: 'left', width: '1%', canSort: true }
        , { value: 'status', name: '狀態', align: 'center', width: '1%', canSort: true }
        , { value: 'url', name: '網址', align: 'left', width: '1%', maxWidth: '400px', canSort: true }
        , { value: 'method', name: 'Method', align: 'left', width: '1%', canSort: true }
        , { value: 'ip', name: 'IP', align: 'left', width: '1%', canSort: true }
        , { value: 'user', name: '使用者', align: 'left', width: '1%', canSort: true }
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
        CUI.deepClone(param, detilSearchForm);
        param.startTime = DateUtil.time(param.startTime);
        param.endTime = DateUtil.time(param.endTime) + 999;
        for (let key in param) {
          if (param[key] == null) {
            param[key] = '';
          }
        }
        AccessLogService.detilPage(param, (result) => {
          if (result.success) {
            callback(result.data);
          } else {
            alert(AjaxUtil.getMessage(result));
          }
        });
      }
    });
    grid.load();
    return grid.getElement();
  }
}
