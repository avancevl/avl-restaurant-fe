import { Async } from '@cui/core';

import {
  Component,
  Input,
} from '@angular/core';
import { PermissionRoute, PermissionAPI } from '../role-permission.component';


interface RouteActive extends PermissionRoute {
  active?: boolean;
}

@Component({
  selector: 'app-role-permission-list',
  templateUrl: './role-permission-list.component.html',
  styleUrls: ['./role-permission-list.component.scss']
})
export class RolePermissionListComponent {
  private timers = {};
  public routes: RouteActive[];
  public nextArray = {};
  public allChecked = true;

  @Input()
  public childs = {};

  constructor() { }

  @Input()
  set array(array: RouteActive[]) {
    this.routes = array;
  }

  /**
   * 選取所有路由
   */
  public checkedAllRoute() {
    for (let i in this.routes) {
      this.routes[i].checked = this.allChecked;
    }
  }

  /**
   *選取所有API
   * @param route
   * @param apis
   */
  public checkedAllApi(route: PermissionRoute) {
    for (let i in route.apis) {
      route.apis[i].checked = route.apiAllChecked;
    }
  }

  /**
   *
   * @param data
   */
  public open(route: RouteActive, child: HTMLElement) {
    clearTimeout(this.timers[route.id]);
    if (route.active) {
      this.timers[route.id] = this.heightZero(child);
    } else {
      this.timers[route.id] = this.heightAuto(child);
    }
    route.active = !route.active;
    child.style.height = (<HTMLElement>child.querySelector('div')).offsetHeight + 'px';
  }

  @Async(300)
  private heightAuto(child: HTMLElement) {
    child.style.height = 'auto';
  }

  @Async(0)
  private heightZero(child: HTMLElement) {
    child.style.height = '0px';
  }
}

