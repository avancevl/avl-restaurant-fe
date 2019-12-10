import { AjaxUtil, Combobox } from '@cui/core';
import { BasicComponent } from '../../../../basic-component';
import { BasicState } from 'ts/constant/basic-state';
import { CUI, IAjaxManagerResult } from '@cui/core';
import { DialogComponent } from '../../../../app-common/component/dialog/dialog.component';
import { Route } from 'ts/data/entity/entity';
import { RouteService } from 'ts/service/core/route-service';
import {
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-route-dialog',
  templateUrl: './route-dialog.component.html',
  styleUrls: ['./route-dialog.component.scss']
})
export class RouteDialogComponent extends BasicComponent {
  public state = BasicState.None;
  public title: string;
  public form: Route;
  public index: number;
  public folders: Combobox[] = [];
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
      parentId: 0,
      name: '',
      type: 1,
      path: '',
      remark: '',
      className: '',
      sort: 0,
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
  public open(state: BasicState, form?: Route, index?: number, ) {
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
    this.folders = [];
    RouteService.queryFolder((result: IAjaxManagerResult) => {
      this.cdf.markForCheck();
      if (!result.success) {
        alert(AjaxUtil.getMessage(result));
        this.dialog.close();
      }
      this.folders = result.data;
    });
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
      RouteService.add(this.form, this.callback);
    } else if (this.state == BasicState.Update) {
      RouteService.modify(this.form, this.callback);
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
