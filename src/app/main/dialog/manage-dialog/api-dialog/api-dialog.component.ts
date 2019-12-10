import { AjaxUtil } from '@cui/core';
import { Api } from 'ts/data/entity/entity';
import { ApiService } from 'ts/service/core/api-service';
import { BasicComponent } from 'app/basic-component';
import { BasicState } from 'ts/constant/basic-state';
import { Component, Input, ViewChild } from '@angular/core';
import { CUI, IAjaxManagerResult } from '@cui/core';
import { DialogComponent } from 'app/app-common/component/dialog/dialog.component';

@Component({
  selector: 'app-api-dialog',
  templateUrl: './api-dialog.component.html',
  styleUrls: ['./api-dialog.component.scss']
})
export class ApiDialogComponent extends BasicComponent {
  public state = BasicState.None;
  public title: string;
  public form: Api;
  public index: number;
  @ViewChild(DialogComponent)
  public dialog: DialogComponent;
  @Input()
  public onComplete: Function;
  @Input()
  public onCancel: Function;

  constructor() {
    super();
    this.initForm();
  }

  private initForm() {
    this.form = {
      id: 0,
      path: '',
      method: 'GET',
      remark: '',
      enabled: true,
      required: false,
    };
  }

  /**
   * 開啟
   * @param state
   * @param form
   * @param index
   */
  public open(state: BasicState, form?: Api, index?: number) {
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
      ApiService.add(this.form, this.callback);
    } else if (this.state == BasicState.Update) {
      ApiService.modify(this.form, this.callback);
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
