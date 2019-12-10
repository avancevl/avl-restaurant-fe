import { Component, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { SelfService } from 'ts/service/core/self-service';
import { CUI, IAjaxManagerResult, AjaxUtil } from '@cui/core';
import { DialogComponent } from 'app/app-common/component/dialog/dialog.component';
import { BasicComponent } from 'app/basic-component';

interface Form {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-self-modify-password-dialog',
  templateUrl: './self-modify-password-dialog.component.html',
  styleUrls: ['./self-modify-password-dialog.component.scss']
})
export class SelfModifyPasswordDialogComponent extends BasicComponent {

  public title = '修改密碼';
  public form: Form;
  public index: number;
  public errorMessage: string;
  @ViewChild(DialogComponent)
  public dialog: DialogComponent;
  @Input()
  public onComplete: Function;
  @Input()
  public onCancel: Function;

  constructor(private cdf: ChangeDetectorRef) {
    super();
    this.initForm();
  }

  private initForm() {
    this.errorMessage = '';
    this.form = {
      password: '',
      newPassword: '',
      confirmPassword: '',
    };
  }

  /**
   * 開啟
   * @param state
   * @param form
   * @param index
   */
  public open() {
    this.dialog.open();
    this.form = {
      password: '',
      newPassword: '',
      confirmPassword: '',
    };
  }

  /**
   * 取消
   */
  public close() {
    this.dialog.close();
    this.cancel();
  }

  /**
   * 提交
   */
  public save = () => {
    SelfService.modifyPassword(this.form, this.callback);
  }

  /**
   * 取消
   */
  public cancel = () => {
    CUI.callFunction(this.onCancel);
    this.initForm();
  }

  /**
  * 新增返回
  */
  public callback = (result: IAjaxManagerResult) => {
    this.cdf.markForCheck();
    if (!result.success) {
      this.errorMessage = AjaxUtil.getMessage(result);
      alert(this.errorMessage);
      return;
    }
    alert('修改密碼成功');
    this.dialog.close();
    CUI.callFunction(this.onComplete);
  }
}
