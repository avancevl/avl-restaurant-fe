import { ApiBuildComponent } from './api-build/api-build.component';
import { AppCommonModule } from '../../../app-common/app-common.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolComponent } from './tool.component';
import { ToolRouteName } from 'ts/ng/router/tool';
import { DateComponent } from './date/date.component';
import { ProxyComponent } from './proxy/proxy.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(ToolModule.routes),
    // RouterModule,
    AppCommonModule
  ],
  declarations: [
    ToolComponent,
    ApiBuildComponent,
    DateComponent,
    ProxyComponent,
  ]
})
export class ToolModule {
  public static routes: Routes = [
    {
      path: '', component: ToolComponent, children: [
        { path: '', redirectTo: ToolRouteName.Api, pathMatch: 'full' },
        { path: ToolRouteName.Api, component: ApiBuildComponent },
        { path: ToolRouteName.Date, component: DateComponent },
        { path: ToolRouteName.Proxy, component: ProxyComponent },
      ]
    }
  ];
}
