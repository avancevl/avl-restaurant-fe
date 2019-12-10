import { AjaxUtil, CUI, IAjaxManagerResult } from '@cui/core';
import { BasicComponent } from 'app/basic-component';
import { BasicState } from 'ts/constant/basic-state';
import {
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild
} from '@angular/core';
import { DialogComponent } from 'app/app-common/component/dialog/dialog.component';
import { Role } from 'ts/data/entity/entity';
import { RoleService } from 'ts/service/core/role-service';

@Component({
  selector: 'app-role-dialog',
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.scss']
})
export class RoleDialogComponent extends BasicComponent {
  public state = BasicState.None;
  public title: string;
  public form: Role;
  public index: number;
  @ViewChild(DialogComponent)
  dialog: DialogComponent;
  @Input()
  onComplete: Function;
  @Input()
  onCancel: Function;

  constructor(private cdf: ChangeDetectorRef) {
    super();
    this.initForm();
  }

  private initForm() {
    this.form = {
      id: 0,
      name: '',
      level: 0,
      enabled: true,
    };
  }

  /**
   * 開啟
   * @param state
   * @param form
   * @param index
   */
  public open(state: BasicState, form?: Role, index?: number) {
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
      RoleService.add(this.form, this.callback);
    } else if (this.state == BasicState.Update) {
      RoleService.modify(this.form, this.callback);
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
