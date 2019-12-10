import { AjaxUtil, Cache } from '@cui/core';
import { ApiPath } from 'ts/constant/api';
import { BasicComponent } from 'app/basic-component';
import { CUI, Grid } from '@cui/core';
import { DomUtil } from 'ts/util/dom-util';
import { GridRenderUtil } from 'ts/util/grid-render-util';
import { ModifyPasswordDialogComponent } from 'app/main/dialog/manage-dialog/modify-password-dialog/modify-password-dialog.component';
import { Role, RestaurantOpen } from 'ts/data/entity/entity';
import { RoleComboboxData, RoleService } from 'ts/service/core/role-service';
import { RoleUtil } from 'ts/util/role-util';
import { Restaurant } from 'ts/data/entity/entity';
// import { RestaurantDialogComponent } from 'app/main/dialog/manage-dialog/restaurant-dialog/restaurant-dialog.component';
import { RestaurantService } from 'ts/service/core/restaurant-service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { from } from 'rxjs';

interface SearchForm {
  name: string;
}

interface Opens {
  [key: string]: RestaurantOpen[];
}

function defaultForm(): SearchForm {
  return {
    name: '',
  };
}

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant-manage.component.html',
  styleUrls: ['./restaurant-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestaurantManageComponent extends BasicComponent {
  public grid: Grid.PageGrid<Restaurant>;
  public roleComboboxData: RoleComboboxData = { array: [], map: {}, levelMap: {} };
  // @ViewChild(RestaurantDialogComponent)
  // public dialog: RestaurantDialogComponent;
  @ViewChild(ModifyPasswordDialogComponent)
  public modifyPasswordDialog: ModifyPasswordDialogComponent;

  @Cache.session('Restaurant', defaultForm())
  public searchForm: SearchForm;

  private opens: Opens = {};

  private days = ['日', '一', '二', '三', '四', '五', '六'];

  constructor(private cdf: ChangeDetectorRef) {
    super();
    this.grid = this.buildGrid();
    RoleService.combobox((data: RoleComboboxData) => {
      this.cdf.markForCheck();
      this.roleComboboxData = data;
      this.search();
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
   * 查詢條件改變
   */
  public searchChange() {
    this.grid.load();
  }

  /**
    * 新增
    */
  public add() {
    // this.dialog.open(this.BasicState.Insert);
  }

  /**
   * 修改
   */
  public modify = (record: Role, index, e: Event) => {
    e.stopPropagation();
    // this.dialog.open(this.BasicState.Update, CUI.deepClone(record), index);
  }


  /**
   * 完成
   */
  public onComplete = () => {
    this.grid.reload();
  }

  /**
   * 啟用/停用
   */
  public enabled(record: Restaurant, index, e: Event) {
    e.stopPropagation();
    (record.enabled ? RestaurantService.disable : RestaurantService.enable)(record.id, this.callback);
  }

  public callback = (result) => {
    if (result.success) {
      this.grid.reload();
    } else {
      alert(AjaxUtil.getMessage(result));
    }
  }

  /**
   * 產生grid
   */
  private buildGrid() {
    return Grid.PageGridBuilder.build({
      size: 50,
      rowColumns: [
        {
          value: '', name: '操作', align: 'left', width: '1%', element: true, tdTranslate: true
          , onRender: (value, record: Restaurant, index) => {
            let restaurant = record.id;
            return [
              DomUtil.buildButton({
                text: '修改',
                className: 'bg-primary small ' + this.ApiClassName.PutUser,
                onclick: this.modify.bind(this, record, index)
              })
            ];
          }
        }
        , {
          value: '', name: '狀態', align: 'center', width: '1%', element: true, tdTranslate: true
          , onRender: (value, record: Restaurant, index) => {
            if (RoleUtil.isPermission('put', ApiPath.PutUser)) {
              let text = record.enabled ? '停用' : '啟用';
              let color = record.enabled ? 'bg-accent' : '';
              return [
                DomUtil.buildButton({
                  text: text,
                  className: color + ' small',
                  onclick: this.enabled.bind(this, record, index)
                })
              ];
            } else {
              let text = record.enabled ? '啟用' : '停用';
              let color = record.enabled ? 'primary' : 'accent';
              return [
                DomUtil.buildSpan({
                  text: text,
                  className: color
                })
              ];
            }
          }
        }
        , { value: 'id', name: 'ID', align: 'center', canSort: true, width: '1%', }
        , { value: 'name', name: '名稱', align: 'center', canSort: true, width: '1%' }
        , {
          value: 'id', name: '營業時間', align: 'center', canSort: true, width: '1%', onRender: (value, record, index) => {
            let v = '';
            this.opens[value].forEach(r => {
              v += this.days[r.day] + '(' + r.start + '~' + r.end + ')\n';
            });
            return v;
          }
        }
        , { value: 'updateUser', name: '修改人', align: 'center', width: '1%', onRender: GridRenderUtil.user }
        , { value: 'updateTime', name: '修改時間', align: 'center', width: '1%', onRender: GridRenderUtil.date }
        , { value: 'createUser', name: '建立人', align: 'center', width: '1%', onRender: GridRenderUtil.user }
        , { value: 'createTime', name: '建立時間', align: 'center', width: '100%', onRender: GridRenderUtil.date }
      ]
      , onLoad: (pageable: Grid.IPageable, callback: Grid.ILoad<Restaurant>) => {
        let data = CUI.deepClone({}, pageable);
        CUI.deepClone(data, this.searchForm);
        RestaurantService.page(data, (result) => {
          if (result.success) {
            let records: RestaurantOpen[] = result.joins.opens;
            this.opens = {};
            records.forEach(r => {
              let array = this.opens[r.id];
              if (!array) {
                array = this.opens[r.id] = [];
              }
              array.push(r);
            });

            callback(result.data);
          } else {
            alert(AjaxUtil.getMessage(result));
          }
        });
      }
    });
  }
}
