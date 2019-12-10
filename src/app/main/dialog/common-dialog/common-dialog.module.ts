import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { AppCommonModule } from '../../../app-common/app-common.module';
import { SelfDialogComponent } from './self-dialog/self-dialog.component';
import { SelfModifyPasswordDialogComponent } from './self-modify-password-dialog/self-modify-password-dialog.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppCommonModule,
  ],
  declarations: [
    AlertDialogComponent,
    SelfDialogComponent,
    SelfModifyPasswordDialogComponent
  ],
  exports: [
    AlertDialogComponent,
    SelfDialogComponent,
    SelfModifyPasswordDialogComponent
  ]
})
export class CommonDialogModule { }
