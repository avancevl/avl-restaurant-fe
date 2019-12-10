import { AjaxUtil } from '@cui/core';
import { RoleCombobox, RoleService } from 'ts/service/core/role-service';
import { BasicComponent } from '../../../../basic-component';
import { BasicState } from 'ts/constant/basic-state';
import {
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { DialogComponent } from '../../../../app-common/component/dialog/dialog.component';
import { User } from 'ts/data/entity/entity';
import { UserService } from 'ts/service/core/user-service';
import {
  ComboboxData,
  CUI,
  IAjaxManagerResult,
} from '@cui/core';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class UserDialogComponent extends BasicComponent {
  public state = BasicState.None;
  public title: string;
  public form: User;
  public index: number;
  public roleComboboxData: ComboboxData<RoleCombobox> = { array: [], map: {} };
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
    this.form = {
      account: '',
      password: '',
      name: '',
      email: '',
      platformId: '',
      roleId: '',
      loginFailCount: 0,
      locked: false,
      enabled: true,
    };
  }

  /**
   * 開啟
   * @param state
   * @param form
   * @param index
   */
  public open(state: BasicState, form?: User, index?: number) {
    this.state = state;
    this.index = index || 0;
    this.form = form;
    if (this.state == BasicState.Insert) {
      this.title = '新增';
      if (!form) {
        this.initForm();
      }
    } else if (this.state == BasicState.Update) {
      this.title = '修改';
    }
    this.dialog.open();

    // 考量到比較少異動
    if (this.roleComboboxData.array.length == 0) {
      RoleService.combobox((data: ComboboxData<RoleCombobox>) => {
        this.cdf.markForCheck();
        this.roleComboboxData = data;
      });
    }
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
    if (this.state == BasicState.Insert) {
      UserService.add(this.form, this.callback);
    } else if (this.state == BasicState.Update) {
      UserService.modify(this.form, this.callback);
    }
  }

  /**
   * 取消
   */
  public cancel = () => {
    this.state = BasicState.None;
    CUI.callFunction(this.onCancel);
  }

  /**
  * 新增返回
  */
  public callback = (result: IAjaxManagerResult) => {
    if (!result.success) {
      alert(AjaxUtil.getMessage(result));
      return;
    }
    this.dialog.close();
    CUI.callFunction(this.onComplete);
  }
}
