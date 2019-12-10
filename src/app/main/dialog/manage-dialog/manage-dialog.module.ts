import { ApiDialogComponent } from './api-dialog/api-dialog.component';
import { AppCommonModule } from '../../../app-common/app-common.module';
import { CommonModule } from '@angular/common';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';
import { RolePermissionComponent } from './role-permission/role-permission.component';
import { RolePermissionListComponent } from './role-permission/role-permission-list/role-permission-list.component';
import { FormsModule } from '@angular/forms';
import { ModifyPasswordDialogComponent } from './modify-password-dialog/modify-password-dialog.component';
import { NgModule } from '@angular/core';
import { RouteDialogComponent } from './route-dialog/route-dialog.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppCommonModule,
  ],
  declarations: [
    ApiDialogComponent,
    RolePermissionComponent,
    RolePermissionListComponent,
    RoleDialogComponent,
    UserDialogComponent,
    ModifyPasswordDialogComponent,
    RouteDialogComponent,
  ],
  exports: [
    RolePermissionComponent,
    RoleDialogComponent,
    ApiDialogComponent,
    UserDialogComponent,
    ModifyPasswordDialogComponent,
    RouteDialogComponent,
  ]
})
export class ManageDialogModule { }
