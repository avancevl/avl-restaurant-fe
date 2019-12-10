import { BasicComponent } from '../../../basic-component';
import { SelfDialogComponent } from '../../dialog/common-dialog/self-dialog/self-dialog.component';
import { SelfModifyPasswordDialogComponent } from '../../dialog/common-dialog/self-modify-password-dialog/self-modify-password-dialog.component';
import { SelfService } from 'ts/service/core/self-service';

import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent extends BasicComponent {
  @ViewChild(SelfDialogComponent)
  public selfDialog: SelfDialogComponent;
  @ViewChild(SelfModifyPasswordDialogComponent)
  public selfModifyPasswordDialog: SelfModifyPasswordDialogComponent;

  constructor() {
    super();
  }

  /**
   * 修改個人資料
   */
  public modifySelf() {
    this.selfDialog.open();
  }

  /**
   * 修改密碼
   */
  public modifySelfPassword() {
    this.selfModifyPasswordDialog.open();
  }

  /**
   * 重設密碼
   */
  public resetPassword() {
    if (window.confirm('確定要重設密碼?')) {
      SelfService.resetPassword((result) => {
        if (result.success) {
          alert('新密碼:' + result.data);
        } else {
          alert(result.message);
        }
      });
    }
  }
}
