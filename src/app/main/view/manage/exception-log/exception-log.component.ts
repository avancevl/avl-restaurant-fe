import { ExceptionLog } from 'ts/data/entity/entity';
import { ExceptionLogService } from 'ts/service/core/exception-log-service';
import { AjaxUtil } from '@cui/core';
import { AppConfig } from 'ts/app-config';
import { Cache, CUI, Grid } from '@cui/core';
import { DateUtil } from 'ts/util/date-util';
import { GridRenderUtil } from 'ts/util/grid-render-util';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { BasicComponent } from 'app/basic-component';


interface SearchForm {
  startTime: string;
  endTime: string;
  service: string;
  message: string;
  content: string;
}

function defaultForm(): SearchForm {
  return {
    startTime: DateUtil.now(AppConfig.TodayStartYYYYMMDDHHmmss) as string,
    endTime: DateUtil.now(AppConfig.TodayEndYYYYMMDDHHmmss) as string,
    service: '',
    message: '',
    content: '',
  };
}

@Component({
  selector: 'app-exception-log',
  templateUrl: './exception-log.component.html',
  styleUrls: ['./exception-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExceptionLogComponent extends BasicComponent {
  public grid: Grid.Grid<ExceptionLog>;

  @Cache.session('ExceptionLog', defaultForm())
  public searchForm: SearchForm;

  constructor() {
    super();
    this.grid = this.buildGrid();
    this.search();
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
   * 刪除
   */
  public remove() {
    if (!window.confirm('您確定要刪除紀錄?')) {
      return;
    }
    let param = CUI.deepClone(this.searchForm);
    param.startTime = DateUtil.time(param.startTime);
    param.endTime = DateUtil.time(param.endTime) + 999;
    ExceptionLogService.remove(param, (result) => {
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
        { value: 'id', name: 'ID', align: 'left', width: '1%' }
        , {
          value: 'time', name: '時間', align: 'left', width: '1%', canSort: true, sort: Grid.Sort.Desc
          , onRender: GridRenderUtil.date
        }
        , { value: 'service', name: '服務', align: 'left', width: '1%' }
        , { value: 'message', name: '錯誤訊息', align: 'left', width: '100%' }
      ]
      , contentColumns: [
        { value: 'content', name: 'Stack Trace' }
      ]
      , onLoad: (pageable: Grid.IPageable, callback: Grid.ILoad<ExceptionLog>) => {
        let param = CUI.deepClone({}, pageable);
        CUI.deepClone(param, this.searchForm);
        param.startTime = DateUtil.time(param.startTime);
        param.endTime = DateUtil.time(param.endTime) + 999;
        ExceptionLogService.page(param, (result) => {
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
