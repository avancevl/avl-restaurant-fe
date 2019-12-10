import { AjaxUtil, CUI } from '@cui/core';
import { Api, Route, Role } from 'ts/data/entity/entity';
import { BasicState } from 'ts/constant/basic-state';
import {
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild
} from '@angular/core';
import { RouteUseApi } from 'ts/constant/route-use-api';
import { BasicComponent } from 'app/basic-component';
import { DialogComponent } from 'app/app-common/component/dialog/dialog.component';
import { RolePermissionService } from 'ts/service/core/role-permission-service';
import { Apis } from 'ts/data/entity/auth-user';

export interface PermissionAPI extends Api {
  checked: boolean;

}

export interface PermissionRoute extends Route {
  checked?: boolean;
  apiAllChecked?: boolean;
  apis?: PermissionAPI[];
}

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss']
})
export class RolePermissionComponent extends BasicComponent {
  public state = BasicState.None;
  public title = '權限設定';
  public form: Role;
  public index: number;
  public allRoutes: PermissionRoute[];
  public routes: PermissionRoute[];
  public childs;
  public apis: PermissionAPI[];
  @ViewChild(DialogComponent)
  public dialog: DialogComponent;
  @Input()
  public onComplete: Function;
  @Input()
  public onCancel: Function;

  constructor(private cdf: ChangeDetectorRef) {
    super();
  }

  /**
   * 開啟
   * @param state
   * @param form
   * @param index
   */
  public open(state: BasicState, form?: Role, index?: number) {
    this.state = state;
    this.index = index || 0;
    this.form = form;
    this.dialog.open();
    RolePermissionService.query({ id: form.id }
      , (result) => {
        if (!result.success) {
          alert(AjaxUtil.getMessage(result));
          this.dialog.close();
          return;
        }
        this.cdf.markForCheck();
        this.allRoutes = result.routes;
        this.routes = [];
        this.childs = {};
        this.apis = result.apis;
        let api: PermissionAPI;
        let apiIds: number[] = result.apiIds;
        let routeIds: number[] = result.routeIds;

        let route, parentId, useApiIds: Apis;
        for (let i in this.apis) {
          api = this.apis[i];
          api.checked = apiIds.indexOf(api.id) != -1;
        }
        this.allRoutes.sort((a, b) => {
          return a.sort > b.sort ? 1 : a.sort == b.sort ? 0 : -1;
        });
        for (let i in this.allRoutes) {
          route = this.allRoutes[i];
          route.apiAllChecked = true;
          route.checked = routeIds.indexOf(route.id) != -1;
          route.apis = [];
          parentId = route.parentId;
          useApiIds = RouteUseApi[route.path];
          if (parentId != 0) {
            if (!this.childs[parentId]) {
              this.childs[parentId] = [];
            }
            // 紀錄每個上層的子節點
            this.childs[parentId].push(route);
          } else {
            // 找出第一層路由
            this.routes.push(route);
          }
          // 找出每一個路由使用了那些API
          if (useApiIds) {
            for (let j in this.apis) {
              api = this.apis[j];
              if (useApiIds[api.method].indexOf(api.path) != -1) {
                route.apis.push(api);
                route.apiAllChecked = route.apiAllChecked && api.checked;
              }
            }
          }
        }
      });
  }

  /**
   * 存檔
   */
  public save() {
    let routeIds = [];
    let apiIds = [];
    let route: PermissionRoute, api: PermissionAPI;
    for (let i in this.allRoutes) {
      route = this.allRoutes[i];
      if (route.checked) {
        routeIds.push(route.id);
      }
    }
    for (let i in this.apis) {
      api = this.apis[i];
      if (api.checked) {
        apiIds.push(api.id);
      }
    }
    RolePermissionService.modify(
      {
        id: this.form.id,
        routeIds: routeIds,
        apiIds: apiIds,
      }
      , (result) => {
        if (!result.success) {
          alert(AjaxUtil.getMessage(result));
          return;
        }
        this.dialog.close();
        CUI.callFunction(this.onComplete);

      });
  }


  /**
   * 取消
   */
  public close() {
    this.dialog.close();
    this.cancel();
  }

  /**
   * 取消
   */
  public cancel = () => {
    this.state = BasicState.None;
    CUI.callFunction(this.onCancel);
  }
}
