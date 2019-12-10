import { AjaxUtil } from '@cui/core';
import { BasicComponent } from '../../../../basic-component';
import {
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild
} from '@angular/core';
import { CUI, IAjaxManagerResult } from '@cui/core';
import { DialogComponent } from '../../../../app-common/component/dialog/dialog.component';
import { User } from 'ts/data/entity/entity';
import { UserService } from 'ts/service/core/user-service';

interface Form {
  id: number;
  password: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-modify-password-dialog',
  templateUrl: './modify-password-dialog.component.html',
  styleUrls: ['./modify-password-dialog.component.scss']
})
export class ModifyPasswordDialogComponent extends BasicComponent {

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
      id: 0,
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
  public open(user: User, index: number) {
    this.dialog.open();
    this.form = {
      id: user.id,
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
    UserService.modifyPassword(this.form, this.callback);
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
