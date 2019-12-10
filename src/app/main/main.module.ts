import {
  AjaxMethod,
  Cache,
  GlobleTooltip,
  IAjaxConfig,
  IAjaxManagerResult
} from '@cui/core';
import { AppCommonModule } from '../app-common/app-common.module';
import { AuthUserNode, SubscriptionsNode } from 'ts/data/node/common';
import { BasicService } from 'ts/service/core/basic-service';
import { CommonDialogModule } from './dialog/common-dialog/common-dialog.module';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { Global } from 'ts/globle';
import { HeaderComponent } from './header/header.component';
import { IndexComponent } from './view/index/index.component';
import { LoginComponent } from './view/login/login.component';
import { MainComponent } from './main.component';
import { MainRouteName } from 'ts/ng/router/main';
import { MainRoutingRule, MainRoutingRule2 } from 'ts/ng/router/rule/main-rule';
import { MenuComponent } from './menu/menu.component';
import { NgModule } from '@angular/core';
import { PingerService } from 'ts/service/core/pinger-service';
import { RoleUtil } from 'ts/util/role-util';
import { RouterModule, Routes } from '@angular/router';
import { UserService } from 'ts/service/core/user-service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AppCommonModule,
    CommonDialogModule,
  ],
  declarations: [
    MainComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    IndexComponent,
    MenuComponent,
  ],
  providers: [
    MainRoutingRule,
    MainRoutingRule2,
  ]
})
export class MainModule {

  public static routes: Routes = [
    {
      path: '', component: MainComponent, children: [
        { path: '', redirectTo: MainRouteName.Index, pathMatch: 'full' }
        /**
         * 無限制
         */
        , { path: MainRouteName.Login, component: LoginComponent, canActivate: [MainRoutingRule2] }
        /**
         * 登錄後才能瀏覽
         */
        , { path: MainRouteName.Index, component: IndexComponent, canActivate: [MainRoutingRule] }
        , { path: MainRouteName.Tool, loadChildren: 'app/main/view/tool/tool.module#ToolModule', canActivate: [MainRoutingRule] }
        , { path: MainRouteName.Boot, loadChildren: 'app/main/view/boot/boot.module#BootModule', canActivate: [MainRoutingRule] }
        , { path: MainRouteName.Manage, loadChildren: 'app/main/view/manage/manage.module#ManageModule', canActivate: [MainRoutingRule] }
        , { path: MainRouteName.Restaurant, loadChildren: 'app/main/view/restaurant/restaurant.module#RestaurantModule', canActivate: [MainRoutingRule] }
      ]
    }
  ];

  private initCheck = false;

  private openWindow = false;
  private originConfirm;
  private originAlert;

  constructor() {
    this.originConfirm = window.confirm;
    this.originAlert = window.alert;
    window.confirm = this.proxyConfirm;
    window.alert = this.proxyAlert;

    // 增加ajax攔截器
    Global.ajaxManager.addBeforeCallback(this.ajaxBeforeCallback);
    Global.ajaxManager.addBeforeRequest(this.ajaxBeforeRequest);
    // 初始化檢查使用者登錄狀況
    this.initCheck = true;
    BasicService.init();

    window.addEventListener('focus', (e: Event) => {
      if (this.openWindow) {
        this.openWindow = false;
      } else {
        this.initCheck = true;
        BasicService.init();
      }
    });
    AuthUserNode.listen(() => {
      if (AuthUserNode.get()) {
        UserService.combobox((result) => {
          Global.userCombobox = result;
        });
      } else {
        Global.userCombobox = { array: [], map: {} };
      }
    }, true);
  }

  private proxyConfirm = (message?: string): boolean => {
    this.openWindow = true;
    return this.originConfirm.call(window, message);
  }

  private proxyAlert = (message?: string): boolean => {
    this.openWindow = true;
    return this.originAlert.call(window, message);
  }

  /**
   * 提交請求前
   * @param config
   */
  private ajaxBeforeRequest = (config: IAjaxConfig) => {
    if (!config.background) {
      Global.loader.open();
    }
  }

  /**
   * 回傳結果前
   * @param config
   */
  private ajaxBeforeCallback = (result: IAjaxManagerResult, statusCode, config: IAjaxConfig) => {
    if (!config.background) {
      Global.loader.close();
      switch (config.method) {
        case AjaxMethod.GET:
          GlobleTooltip.text('查詢成功');
          break;
        case AjaxMethod.POST:
        case AjaxMethod.PUT:
        case AjaxMethod.DELETE:
          GlobleTooltip.text('操作成功');
          break;
      }
    }
    // 清除使用者资讯
    if (statusCode == 401) {
      if (!this.initCheck) {
        this.initCheck = true;
        BasicService.init(() => {
          this.initCheck = false;
          AuthUserNode.clean();
          Cache.cleanSession();
        });
        alert(result.message);
      }
      AuthUserNode.clean();
      Cache.cleanSession();
      return false;
    }
    // 刷新资料
    if (result.refresh) {
      let value;
      for (let key in result.refresh) {
        value = result.refresh[key];
        switch (key) {
          case 'User':
            AuthUserNode.set(value);
            RoleUtil.updatePermissionStyle();
            break;
          case 'Timeout':
            if (value <= 0) {
              PingerService.stop();
            } else {
              PingerService.start(value);
            }
            break;
          case 'Subscriptions':
            SubscriptionsNode.set(value);
            break;
        }
      }
    }
    return true;
  }
}
