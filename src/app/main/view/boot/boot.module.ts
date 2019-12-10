import { AppCommonModule } from '../../../app-common/app-common.module';
import { BootComponent } from './boot.component';
import { BootRouteName } from 'ts/ng/router/boot';
import { CommonModule } from '@angular/common';
import { ConfigServerComponent } from './config-server/config-server.component';
import { FormsModule } from '@angular/forms';
import { InfoComponent } from './info/info.component';
import { LoggerComponent } from './logger/logger.component';
import { MetricsWatchComponent } from './metrics-watch/metrics-watch.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CacheManageComponent } from './cache-manage/cache-manage.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(BootModule.routes),
    // RouterModule,
    AppCommonModule
  ],
  declarations: [
    BootComponent,
    InfoComponent,
    LoggerComponent,
    ConfigServerComponent,
    MetricsWatchComponent,
    CacheManageComponent
  ]
})
export class BootModule {
  public static routes: Routes = [
    {
      path: '', component: BootComponent, children: [
        { path: '', redirectTo: BootRouteName.Info, pathMatch: 'full' },
        { path: BootRouteName.Info, component: InfoComponent },
        { path: BootRouteName.Logger, component: LoggerComponent },
        { path: BootRouteName.ConfigServer, component: ConfigServerComponent },
        { path: BootRouteName.MetricsWatch, component: MetricsWatchComponent },
        { path: BootRouteName.CacheManage, component: CacheManageComponent },
      ]
    }
  ];
}
