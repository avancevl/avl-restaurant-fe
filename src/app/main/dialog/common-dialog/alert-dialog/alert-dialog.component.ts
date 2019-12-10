import { Component, ViewChild } from '@angular/core';
import { CUI } from '@cui/core';
import { DialogComponent } from '../../../../app-common/component/dialog/dialog.component';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent {
  public title;
  public message;

  @ViewChild(DialogComponent)
  public dialog: DialogComponent;

  constructor() {
  }

  public open(title: string, message: any, json?: boolean) {
    this.title = title;
    if (json) {
      this.message = CUI.printJson(message);
    } else {
      this.message = message;
    }
    this.dialog.open();
  }
}
