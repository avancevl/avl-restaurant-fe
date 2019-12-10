import { AjaxUtil } from '@cui/core';
import { ApiPath } from 'ts/constant/api';
import { RoleUtil } from 'ts/util/role-util';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild
} from '@angular/core';
import { CUI, Grid } from '@cui/core';
import { DomUtil } from 'ts/util/dom-util';
import { GridRenderUtil } from 'ts/util/grid-render-util';
import { Route } from 'ts/data/entity/entity';
import { RouteService } from 'ts/service/core/route-service';
import { BasicComponent } from 'app/basic-component';
import { RouteDialogComponent } from 'app/main/dialog/manage-dialog/route-dialog/route-dialog.component';


@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteComponent extends BasicComponent {
  private parentName = {};
  private allRoutes = [];
  public noAddRoutes = [];

  public grid: Grid.Grid<Route>;
  @ViewChild(RouteDialogComponent)
  public dialog: RouteDialogComponent;

  constructor(private cdf: ChangeDetectorRef) {
    super();
    this.grid = this.buildGrid();
    this.findRoute(this.AppRoute.Main);
    this.search();
  }

  /**
   * 查詢
   */
  public search() {
    this.grid.load();
  }

  /**
    * 找路Route路徑
    */
  private findRoute(data) {
    let value;
    for (let i in data) {
      value = data[i];
      if (CUI.isArray(value)) {
        this.allRoutes.push(value.join('/'));
      } else if (value) {
        this.findRoute(value);
      }
    }
  }


  /**
   * 新增
   */
  public addByPath(path: string) {
    this.dialog.open(this.BasicState.Insert, {
      parentId: 0,
      name: '',
      type: 1,
      path: path,
      remark: '',
      className: '',
      sort: 0,
      enabled: true,
      required: false,
    });
  }

  /**
   * 新增
   */
  public add() {
    this.dialog.open(this.BasicState.Insert);
  }

  /**
   * 修改
   */
  public modify = (record: Route, index, e: Event) => {
    e.stopPropagation();
    this.dialog.open(this.BasicState.Update, CUI.deepClone(record), index);
  }

  /**
   * 複製
   */
  public copy(record: Route, index, e: Event) {
    e.stopPropagation();
    this.dialog.open(this.BasicState.Insert, CUI.deepClone(record), index);
  }

  /**
   * 刪除
   */
  public remove(record: Route, index, e: Event) {
    e.stopPropagation();
    if (window.confirm('確定要刪除?')) {
      RouteService.remove(record, (result) => {
        if (result.success) {
          this.grid.reload();
        } else {
          alert(AjaxUtil.getMessage(result));
        }
      });
    }
  }

  /**
   * 啟用/停用
   */
  public enabled(record: Route, index, e: Event) {
    e.stopPropagation();
    record.enabled = !record.enabled;
    RouteService.modify(record, (result) => {
      if (result.success) {
        this.grid.reload();
      } else {
        alert(AjaxUtil.getMessage(result));
      }
    });
  }

  /**
   * 完成
   */
  public onComplete = () => {
    this.grid.reload();
  }

  /**
   * 產生grid
   */
  private buildGrid() {
    return Grid.GridBuilder.build({
      size: 100,
      rowColumns: [
        {
          value: '', name: '操作', align: 'left', width: '1%', element: true, tdTranslate: true
          , onRender: (value, record: Route, index) => {
            return [
              DomUtil.buildButton({
                text: '修改',
                className: 'small ' + this.ApiClassName.PutRoute,
                onclick: this.modify.bind(this, record, index)
              })
              , DomUtil.buildButton({
                text: '複製',
                className: 'bg-dark small ' + this.ApiClassName.PostRoute,
                onclick: this.copy.bind(this, record, index)
              })
              , DomUtil.buildButton({
                text: '刪除',
                className: 'bg-accent small ' + this.ApiClassName.DeleteRoute,
                onclick: this.remove.bind(this, record, index)
              })
            ];
          }
        }
        , {
          value: '', name: '狀態', align: 'left', width: '1%', element: true, tdTranslate: true
          , onRender: (value, record: Route, index) => {
            let elements = [];
            if (RoleUtil.isPermission('put', ApiPath.PutRoute)) {
              let text = record.enabled ? '停用' : '啟用';
              let color = record.enabled ? 'bg-accent' : '';
              elements.push(DomUtil.buildButton({
                text: text,
                className: color + ' small',
                onclick: this.enabled.bind(this, record, index)
              }));
            } else {
              let text = record.enabled ? '啟用' : '停用';
              let color = record.enabled ? 'primary' : 'accent';
              elements.push(DomUtil.buildSpan({
                text: text,
                className: color
              }));
            }
            if (record.required) {
              elements.push(DomUtil.buildSpan({
                text: ' 預設',
                className: ''
              }));
            }
            return elements;
          }
        }
        , {
          value: 'name', name: '名稱', align: 'left', width: '1%', element: true
          , onRender: function (value, record: Route, index) {
            let element = DomUtil.buildDiv({
              text: value,
              className: record.className
            });
            if (record.type == 1) {
              element.style.textIndent = '1em';
            }
            return element;
          }
        }
        , {
          value: 'type', name: '類型', align: 'center', width: '1%', tdTranslate: true
          , onRender: function (value, record: Route, index) {
            return value == 0 ? '目錄' : '網頁';
          }
        }

        , { value: 'sort', name: '排序', align: 'center', width: '1%' }
        , { value: 'path', name: '路徑', align: 'left', width: '100%' }
      ]
      , contentColumns: [
        { value: 'id', name: 'ID', align: 'left', width: '1%', }
        , { value: 'className', name: 'Icon', align: 'center', width: '1%' }
        , {
          value: 'parentId', name: '目錄', align: 'left', width: '1%'
          , onRender: (value, record: Route, index) => {
            return this.parentName[value] || value;
          }
        }
        , { value: 'updateUser', name: '修改人', align: 'center', width: '1%', onRender: GridRenderUtil.user }
        , { value: 'updateTime', name: '修改時間', align: 'center', width: '1%', onRender: GridRenderUtil.date }
        , { value: 'createUser', name: '建立人', align: 'center', width: '1%', onRender: GridRenderUtil.user }
        , { value: 'createTime', name: '建立時間', align: 'center', width: '1%', onRender: GridRenderUtil.date }
      ],
      onLoad: (pageable: Grid.IPageable, callback: Grid.ILoad<Route>) => {
        RouteService.query(pageable, (result) => {
          if (result.success) {
            this.cdf.markForCheck();

            let array: Route[] = result.data;
            array.sort((a: Route, b: Route) => {
              return a.sort - b.sort;
            });
            let newRecord = [];
            // 分類
            let route: Route;
            let routePaths = [];
            for (let i in array) {
              route = array[i];
              routePaths.push(route.path);
              if (!route.parentId) {
                newRecord.push(route);
                if (route.type == 0) {
                  this.parentName[route.id] = route.name;
                  this.findChild(route.id, newRecord, array);
                }
              }
            }

            // 過濾還沒新增的Route
            if (routePaths.length > 0) {
              let path;
              this.noAddRoutes = [];
              for (let i in this.allRoutes) {
                path = this.allRoutes[i];
                if (routePaths.indexOf(path) == -1) {
                  this.noAddRoutes.push(path);
                }
              }
            } else {
              this.noAddRoutes = this.allRoutes;
            }
            callback(newRecord);
          } else {
            alert(AjaxUtil.getMessage(result));
          }
        });
      }
    });
  }

  /**
   *
   * @param parentId 搜尋子類
   * @param dest
   * @param orig
   */
  private findChild(parentId: number, dest: Route[], orig: Route[]) {
    let route: Route;
    for (let i in orig) {
      route = orig[i];
      if (route.parentId == parentId) {
        dest.push(route);
        if (route.type == 0) {
          this.parentName[route.id] = route.name;
          this.findChild(route.id, dest, orig);
        }
      }
    }
  }
}
