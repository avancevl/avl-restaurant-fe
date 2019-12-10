import { AjaxUtil } from '@cui/core';
import { BootService } from 'ts/service/core/boot-service';
import { Cache, Grid } from '@cui/core';
import { DomUtil } from 'ts/util/dom-util';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

interface Level {
  configuredLevel: string;
  effectiveLevel: string;
}

interface Logger {
  package: string;
  configuredLevel: string;
  effectiveLevel: string;
}

interface Loggers {
  [key: string]: Level;
}

interface LoggerResult {
  levels: string[];
  loggers: Loggers;
}

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoggerComponent {
  private levels: string[] = [];
  @Cache.session('Logger', window.location.origin)
  public url;
  @Cache.session('Logger', '')
  public package;
  @Cache.session('Logger', ['ROOT'])
  public cachePackages: string[];

  public grid: Grid.PageGrid<Logger>;

  private result: any;

  constructor(private cdf: ChangeDetectorRef) {
    this.grid = this.buildGrid();
    this.search();
  }


  /**
   * 查詢
   * @param newPackage
   * @param e
   */
  public search() {
    BootService.loggers(this.url, (result) => {
      if (result.success) {
        this.result = result;
        this.grid.load();
      } else {
        alert(AjaxUtil.getMessage(result));
      }
    });
  }

  /**
   * 改變過濾條件
   * @param newPackage
   * @param e
   */
  public changePackage(newPackage: string, e: Event) {
    e.stopPropagation();
    if (newPackage == this.cachePackages[0]) {
      this.package = '';
    } else {
      this.package = newPackage;
      if (this.cachePackages.indexOf(newPackage) == -1) {
        this.cachePackages.push(newPackage);
      }
    }
    this.cdf.markForCheck();
    this.search();
  }

  /**
   * 修改日誌輸出等級
   */
  public modify = (record: Logger, index: number, level: string, e: Event) => {
    e.stopPropagation();
    if (!this.url) { return; }
    if (record.effectiveLevel == level) {
      return;
    }
    if (!window.confirm('確定要將' + record.package + '日誌級別變更為' + level + '?')) {
      return;
    }
    BootService.modifyLoggers(this.url, record.package, { configuredLevel: level }, (result) => {
      if (result.success) {
        this.search();
      } else {
        alert(AjaxUtil.getMessage(result));
      }
    });
  }

  /**
   * 建立表格
   */
  private buildGrid() {
    return Grid.PageGridBuilder.build({
      size: 50,
      rowColumns: [{
        value: 'package', name: 'Package', align: '', width: '100%', element: true
        , onRender: (value, record: Logger, index) => {
          return DomUtil.buildLinkButton({
            text: value,
            onclick: this.changePackage.bind(this, value)
          });
        }
      }, {
        value: 'configuredLevel', name: '配置', align: '', width: '1%'
      }, {
        value: 'effectiveLevel', name: '有效', align: '', width: '1%'
      },
      {
        value: 'effectiveLevel', name: '操作', align: 'left', width: '1%', element: true, tdTranslate: true
        , onRender: (value, record: Logger, index) => {
          let buttons = [];
          let level: string;
          for (let i in this.levels) {
            level = this.levels[i];
            buttons.push(DomUtil.buildButton({
              text: level,
              className: 'small ' + (level == value ? '' : 'bg-dark'),
              onclick: this.modify.bind(this, record, index, level)
            }));
          }
          return buttons;
        }
      }
      ], onLoad: (pageable: Grid.IPageable, callback: Grid.ILoad<Logger>) => {

        callback(this.parseLoggers(pageable, this.result));
      }
    });

  }

  /**
   * 解析返回資料
   */
  private parseLoggers = (pageable: Grid.IPageable, result: LoggerResult): Grid.IPage<Logger> => {
    this.levels = result.levels;
    let loggers = result.loggers;
    let array: Logger[] = [];
    let count = 0;
    let start = pageable.page * pageable.size;
    let end = start + pageable.size;
    for (let i in loggers) {
      if (this.package) {
        if (i.indexOf(this.package) == -1) {
          continue;
        }
      } else {
        if (!/^((ROOT)|(com\.[^.]+\.[^.]+)|(org\.[^.]+))$/.test(i)) {
          continue;
        }
      }

      if (count >= start && count < end) {
        array.push({
          package: i,
          configuredLevel: loggers[i].configuredLevel,
          effectiveLevel: loggers[i].effectiveLevel
        });
      }
      count++;
    }

    return {
      content: array
      , number: pageable.page
      , size: pageable.size
      , totalElements: count
    };;
  }
}
