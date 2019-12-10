import { AppCommonModule } from './app-common/app-common.module';
import { AppComponent } from './app.component';
import { AppRouteName } from 'ts/ng/router/app';
import { BrowserModule } from '@angular/platform-browser';
import { Global } from 'ts/globle';
import { LangNode } from 'ts/data/node/common';
import { MainModule } from './main/main.module';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './error/not-found/not-found.component';
import { TranslateSourceAll } from 'ts/translate/TranslateSourceAll';
import { TranslateSourceMenu } from 'ts/translate/TranslateSourceMenu';
import {
  RouterModule,
  Routes,
  RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  Router,
} from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppModule.routes, { useHash: true }),
    AppCommonModule,
    MainModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  public static routes: Routes = [
    { path: '', redirectTo: AppRouteName.Main, pathMatch: 'full' },
    { path: AppRouteName.Main, children: MainModule.routes },
    /**
     * NotFound
     */
    { path: '**', component: NotFoundComponent },
  ];
  public translateSourceAll = TranslateSourceAll;
  public translateSourceMenu = TranslateSourceMenu;

  constructor(private router: Router) {
    // 解析URL Paramters
    Global.parseQueryString();
    Global.translateGO.reload();
    Global.translateGO.start();
    // 監聽語言切換
    LangNode.listen(() => {
      Global.translateGO.translate(LangNode.get());
    }, true);
    // 加載入動畫物件
    document.body.appendChild(Global.loader.getElement());
    // 路由切換關閉loader
    router.events.subscribe((e: RouterEvent) => {
      if (e instanceof NavigationStart) {
        Global.loader.closeAll();
        Global.loader.open();
      } else if (e instanceof NavigationEnd) {
        Global.currentRoute = e.urlAfterRedirects;
        let index = Global.currentRoute.indexOf('?');
        if (index != -1) {
          Global.currentRoute = Global.currentRoute.substring(0, Global.currentRoute.indexOf('?'));
        }
        Global.currentRouteName = Global.routeName[Global.currentRoute] || Global.currentRoute;
        Global.loader.close();
      } else if (e instanceof NavigationCancel) {
        Global.loader.close();
      }
    });
  }
}
