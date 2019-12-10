import { AccessLogComponent } from './access-log/access-log.component';
import { AccessLogGroupComponent } from './access-log-group/access-log-group.component';
import { RoleComponent } from './role/role.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageComponent } from './manage.component';
import { ManageRouteName } from 'ts/ng/router/manage';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AppCommonModule } from '../../../app-common/app-common.module';
import { ApiComponent } from './api/api.component';
import { RouteComponent } from './route/route.component';
import { ManageDialogModule } from '../../dialog/manage-dialog/manage-dialog.module';
import { CommonDialogModule } from '../../dialog/common-dialog/common-dialog.module';
import { ExceptionLogComponent } from './exception-log/exception-log.component';
import { SessionComponent } from './session/session.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(ManageModule.routes),
    // RouterModule,
    AppCommonModule,
    CommonDialogModule,
    ManageDialogModule,
  ],
  declarations: [
    ManageComponent,
    UserComponent,
    RoleComponent,
    AccessLogComponent,
    AccessLogGroupComponent,
    ApiComponent,
    RouteComponent,
    ExceptionLogComponent,
    SessionComponent
  ]
})
export class ManageModule {
  public static routes: Routes = [
    {
      path: '', component: ManageComponent, children: [
        { path: '', redirectTo: ManageRouteName.User, pathMatch: 'full' },
        { path: ManageRouteName.Role, component: RoleComponent },
        { path: ManageRouteName.User, component: UserComponent },
        { path: ManageRouteName.Api, component: ApiComponent },
        { path: ManageRouteName.Route, component: RouteComponent },
        { path: ManageRouteName.AccessLog, component: AccessLogComponent },
        { path: ManageRouteName.AccessLogGroup, component: AccessLogGroupComponent },
        { path: ManageRouteName.ExceptionLog, component: ExceptionLogComponent },
        { path: ManageRouteName.Session, component: SessionComponent },
      ]
    }
  ];
}
