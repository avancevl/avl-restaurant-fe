import { AjaxUtil, CUI, IAjaxManagerResult } from '@cui/core';
import { AuthUser } from 'ts/data/entity/auth-user';
import { AuthUserNode } from 'ts/data/node/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild
} from '@angular/core';
import { SelfService } from 'ts/service/core/self-service';
import { BasicComponent } from 'app/basic-component';
import { DialogComponent } from 'app/app-common/component/dialog/dialog.component';

@Component({
  selector: 'app-self-dialog',
  templateUrl: './self-dialog.component.html',
  styleUrls: ['./self-dialog.component.scss']
})
export class SelfDialogComponent extends BasicComponent {
  public form: AuthUser = AuthUserNode.get();

  @ViewChild(DialogComponent)
  public dialog: DialogComponent;
  @Input()
  public onComplete: Function;
  @Input()
  public onCancel: Function;

  constructor(private cdf: ChangeDetectorRef) {
    super();

  }

  /**
   * 開啟
   * @param state
   * @param form
   * @param index
   */
  public open() {
    this.form = AuthUserNode.get();
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
    let data = {
      id: this.form.id,
      name: this.form.name,
      platformId: this.form.platformId,
    };

    SelfService.modify(data, this.callback);
  }

  /**
   * 取消
   */
  public cancel = () => {
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
    this.cdf.markForCheck();
    this.dialog.close();
    CUI.callFunction(this.onComplete);
  }
}
