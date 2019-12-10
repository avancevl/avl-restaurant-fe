import { AjaxUtil, IAjaxManagerResult } from '@cui/core';
import { Api } from 'ts/data/entity/entity';
import { ApiDialogComponent } from 'app/main/dialog/manage-dialog/api-dialog/api-dialog.component';
import { ApiPath } from 'ts/constant/api';
import { Apis } from 'ts/data/entity/auth-user';
import { ApiService } from 'ts/service/core/api-service';
import { BasicComponent } from 'app/basic-component';
import { BootService } from 'ts/service/core/boot-service';
import { CUI, Grid, Cache } from '@cui/core';
import { DomUtil } from 'ts/util/dom-util';
import { GridRenderUtil } from 'ts/util/grid-render-util';
import { RoleUtil } from 'ts/util/role-util';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';


interface SearchForm {
  path: string;
}


function defaultForm(): SearchForm {
  return {
    path: ''
  };
}

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiComponent extends BasicComponent {
  private filterApi = new RegExp('^' +
    [
      '/error'
      , '/actuator(/.+|$)+'
      , '/pinger(/.+|$)+'
      , '/public/.'
      , '/proxy(/.+|$)'
      // , '/cache(/.+|$)'
      , '/swagger(.+|$)'
      , '/api(/.+|$)'
    ].join('|')
    + '$');
  private allApi: Apis;
  public noInsertApis: Apis = {
    get: [],
    post: [],
    put: [],
    delete: []
  };

  public grid: Grid.Grid<Api>;
  @ViewChild(ApiDialogComponent)
  public dialog: ApiDialogComponent;

  @Cache.session('Api', defaultForm())
  public searchForm: SearchForm;

  constructor(private cdf: ChangeDetectorRef) {
    super();
    this.grid = this.buildGrid();
    this.queryAllApi();
  }


  /**
   * 查詢
   */
  public search() {
    this.grid.load();
  }

  /**
   * 查詢後端所有Api
   */
  public queryAllApi() {
    BootService.mappings(window.location.origin, (result: IAjaxManagerResult) => {
      if (result.success) {
        delete result.success;
        // this.parseApiPath(result);
        this.parseApiPath2(result);
      } else {
        alert(result.message);
      }
      this.search();
    });
  }

  /**
   * 解析API Path
   */
  private parseApiPath2(data) {
    this.allApi = {
      get: [],
      post: [],
      put: [],
      delete: []
    };
    data = data.contexts[''].mappings.dispatcherServlets.dispatcherServlet;
    let key, patterns, path, methods, method;
    for (let j in data) {
      patterns = data[j].details;
      if (!patterns) {
        continue;
      }
      methods = patterns.requestMappingConditions.methods;
      patterns = patterns.requestMappingConditions.patterns;
      if (patterns.length == 0) {
        continue;
      }
      key = patterns[0];
      path = key.replace(/\/{.+}/g, '').replace(/[{}\[\]]/g, '').trim().replace(/\/$/g, '');
      if (path && !this.filterApi.test(path)) {
        for (let m in methods) {
          this.allApi[methods[m].toLowerCase()].push(path);
        }
      }
    }
    this.allApi.get.sort(function (a, b) {
      return a > b ? 1 : a == b ? 0 : -1;
    });
    this.allApi.post.sort(function (a, b) {
      return a > b ? 1 : a == b ? 0 : -1;
    });
    this.allApi.put.sort(function (a, b) {
      return a > b ? 1 : a == b ? 0 : -1;
    });
    this.allApi.delete.sort(function (a, b) {
      return a > b ? 1 : a == b ? 0 : -1;
    });
  }

  /**
   * 新增
   */
  public addById(method: string, path: string) {
    this.dialog.open(this.BasicState.Insert, {
      id: 0,
      path: path,
      method: method,
      remark: '',
      enabled: true,
      required: false
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
  public modify = (record: Api, index, e: Event) => {
    e.stopPropagation();
    this.dialog.open(this.BasicState.Update, CUI.deepClone(record), index);
  }

  /**
   * 複製
   */
  public copy(record: Api, index, e: Event) {
    e.stopPropagation();
    this.dialog.open(this.BasicState.Insert, CUI.deepClone(record), index);
  }

  /**
   * 刪除
   */
  public remove(record: Api, index, e: Event) {
    e.stopPropagation();
    if (window.confirm('確定要刪除?')) {
      ApiService.remove(record, (result) => {
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
  public enabled(record: Api, index, e: Event) {
    e.stopPropagation();
    record.enabled = !record.enabled;
    ApiService.modify(record, (result) => {
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
    return Grid.GridBuilder.build<Api>({
      size: 200,
      index: true,
      rowColumns: [
        {
          value: '', name: '操作', align: 'left', width: '1%', element: true, tdTranslate: true
          , onRender: (value, record, index) => {
            return [
              DomUtil.buildButton({
                text: '修改',
                className: 'small ' + this.ApiClassName.PutApi,
                onclick: this.modify.bind(this, record, index)
              })
              , DomUtil.buildButton({
                text: '複製',
                className: 'bg-dark small ' + this.ApiClassName.PostApi,
                onclick: this.copy.bind(this, record, index)
              })
              , DomUtil.buildButton({
                text: '刪除',
                className: 'bg-accent small ' + this.ApiClassName.DeleteApi,
                onclick: this.remove.bind(this, record, index)
              })
            ];
          }
        }
        , {
          value: '', name: '狀態', align: 'left', width: '1%', element: true, tdTranslate: true
          , onRender: (value, record, index) => {
            let elements = [];
            if (RoleUtil.isPermission('put', ApiPath.PutApi)) {
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
        , { value: 'id', name: 'ID', align: 'left', width: '1%', canSort: true }
        , { value: 'path', name: '路徑', align: 'left', width: '1%', canSort: true, sort: Grid.Sort.Asc }
        , { value: 'method', name: '方法', align: 'center', width: '1%', canSort: true }
        , { value: 'remark', name: '描述', align: 'left', width: '1%' }
        , { value: 'updateTime', name: '修改時間', align: 'center', width: '100%', onRender: GridRenderUtil.date }
      ]
      , contentColumns: [
        , { value: 'updateUser', name: '修改人', align: 'center', width: '1%', onRender: GridRenderUtil.user }
        , { value: 'updateTime', name: '修改時間', align: 'center', width: '1%', onRender: GridRenderUtil.date }
        , { value: 'createUser', name: '建立人', align: 'center', width: '1%', onRender: GridRenderUtil.user }
        , { value: 'createTime', name: '建立時間', align: 'center', width: '1%', onRender: GridRenderUtil.date }
      ],
      onLoad: (pageable: Grid.IPageable, callback: Grid.ILoad) => {
        let data = CUI.deepClone({}, pageable);
        CUI.deepClone(data, this.searchForm);
        ApiService.query(data, (result) => {
          if (result.success) {
            this.cdf.markForCheck();

            // 過濾還沒新增的API
            let apiIds = {
              get: [],
              post: [],
              put: [],
              delete: []
            };
            let records = result.data;
            for (let i in records) {
              apiIds[records[i].method].push(records[i].path);
            }
            let apis;
            this.noInsertApis = {
              get: [],
              post: [],
              put: [],
              delete: []
            };
            for (let method in this.allApi) {
              apis = this.allApi[method];
              for (let i in apis) {
                if (apiIds[method].indexOf(apis[i]) == -1) {
                  this.noInsertApis[method].push(apis[i]);
                }
              }
            }

            callback(result.data);
          } else {
            alert(AjaxUtil.getMessage(result));
          }
        });
      }
    });
  }
}
