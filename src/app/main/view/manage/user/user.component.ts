import { AjaxUtil, Cache } from '@cui/core';
import { ApiPath } from 'ts/constant/api';
import { BasicComponent } from 'app/basic-component';
import { CUI, Grid } from '@cui/core';
import { DomUtil } from 'ts/util/dom-util';
import { GridRenderUtil } from 'ts/util/grid-render-util';
import { ModifyPasswordDialogComponent } from 'app/main/dialog/manage-dialog/modify-password-dialog/modify-password-dialog.component';
import { Role } from 'ts/data/entity/entity';
import { RoleComboboxData, RoleService } from 'ts/service/core/role-service';
import { RoleUtil } from 'ts/util/role-util';
import { User } from 'ts/data/entity/entity';
import { UserDialogComponent } from 'app/main/dialog/manage-dialog/user-dialog/user-dialog.component';
import { UserService } from 'ts/service/core/user-service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';

interface SearchForm {
  id: string;
  name: string;
  roleId: string;
}

function defaultForm(): SearchForm {
  return {
    id: '',
    name: '',
    roleId: '',
  };
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent extends BasicComponent {
  public grid: Grid.PageGrid<User>;
  public roleComboboxData: RoleComboboxData = { array: [], map: {}, levelMap: {} };
  @ViewChild(UserDialogComponent)
  public dialog: UserDialogComponent;
  @ViewChild(ModifyPasswordDialogComponent)
  public modifyPasswordDialog: ModifyPasswordDialogComponent;

  @Cache.session('User', defaultForm())
  public searchForm: SearchForm;

  constructor(private cdf: ChangeDetectorRef) {
    super();
    this.grid = this.buildGrid();
    RoleService.combobox((data: RoleComboboxData) => {
      this.cdf.markForCheck();
      this.roleComboboxData = data;
      this.search();
    });
  }

  /**
   * 查詢
   */
  public search() {
    this.grid.load();
  }

  /**
   * 清除查詢條件
   */
  public clean() {
    this.searchForm = defaultForm();
  }

  /**
   * 查詢條件改變
   */
  public searchChange() {
    this.grid.load();
  }

  /**
    * 新增
    */
  public add() {
    this.dialog.open(this.BasicState.Insert);
  }

  /**
   * 修改
   */
  public modify = (record: Role, index, e: Event) => {
    e.stopPropagation();
    this.dialog.open(this.BasicState.Update, CUI.deepClone(record), index);
  }

  /**
   * 修改密碼
   */
  public modifyPassword = (record: User, index, e: Event) => {
    e.stopPropagation();
    this.modifyPasswordDialog.open(record, index);
  }

  /**
   * 重設密碼
   */
  public resetPassword = (record: User, index, e: Event) => {
    e.stopPropagation();
    if (window.confirm('確定要重設密碼?')) {
      UserService.resetPassword({ id: record.id }, (result) => {
        if (result.success) {
          alert('新密碼:' + result.data);
        } else {
          alert(result.message);
        }
      });
    }
  }

  /**
   * 完成
   */
  public onComplete = () => {
    this.grid.reload();
  }

  /**
   * 啟用/停用
   */
  public enabled(record: User, index, e: Event) {
    e.stopPropagation();
    (record.enabled ? UserService.disable : UserService.enable)(record.id, this.callback);
  }


  /**
   * 解除/凍結
   */
  public locked(record: User, index, e: Event) {
    e.stopPropagation();
    (record.locked ? UserService.unlock : UserService.lock)(record.id, this.callback);
  }

  public callback = (result) => {
    if (result.success) {
      this.grid.reload();
    } else {
      alert(AjaxUtil.getMessage(result));
    }
  }

  /**
   * 產生grid
   */
  private buildGrid() {
    return Grid.PageGridBuilder.build({
      size: 50,
      rowColumns: [
        {
          value: '', name: '操作', align: 'left', width: '1%', element: true, tdTranslate: true
          , onRender: (value, record: User, index) => {
            let level = this.roleComboboxData.levelMap[record.roleId];
            let user = record.id;
            return [
              DomUtil.buildButton({
                text: '修改',
                className: 'bg-primary small ' + this.ApiClassName.PutUser,
                onclick: this.modify.bind(this, record, index)
              }, level, user)
              , DomUtil.buildButton({
                text: '修改密碼',
                className: 'bg-accent small ' + this.ApiClassName.PutUserPassword,
                onclick: this.modifyPassword.bind(this, record, index)
              }, level, user)
              , DomUtil.buildButton({
                text: '重設密碼',
                className: 'bg-accent small ' + this.ApiClassName.PutUserPasswordReset,
                onclick: this.resetPassword.bind(this, record, index)
              }, level, user)
            ];
          }
        }
        , {
          value: '', name: '狀態', align: 'center', width: '1%', element: true, tdTranslate: true
          , onRender: (value, record: User, index) => {
            let level = this.roleComboboxData.levelMap[record.roleId];
            let user = record.id;
            if (RoleUtil.isPermission('put', ApiPath.PutUser)) {
              let text = record.enabled ? '停用' : '啟用';
              let text2 = record.locked ? '解除' : '凍結';
              let color = record.enabled ? 'bg-accent' : '';
              let color2 = record.locked ? '' : 'bg-accent';
              return [
                DomUtil.buildButton({
                  text: text,
                  className: color + ' small',
                  onclick: this.enabled.bind(this, record, index)
                }, level, user),
                , DomUtil.buildButton({
                  text: text2,
                  className: color2 + ' small',
                  onclick: this.locked.bind(this, record, index)
                }, level, user),
              ];
            } else {
              let text = record.enabled ? '啟用' : '停用';
              let text2 = record.locked ? '凍結' : '解除';
              let color = record.enabled ? 'primary' : 'accent';
              let color2 = record.locked ? 'accent' : 'primary';
              return [
                DomUtil.buildSpan({
                  text: text,
                  className: color
                })
                , DomUtil.buildSpan({
                  text: text2,
                  className: color2
                })
              ];
            }
          }
        }
        , { value: 'id', name: 'ID', align: 'center', canSort: true, width: '1%', }
        , { value: 'name', name: '名稱', align: 'center', canSort: true, width: '1%' }
        , {
          value: 'roleId', name: '角色', align: 'center', width: '1%'
          , onRender: (value, record: User, index) => {
            return this.roleComboboxData.map[value] || value;
          }
        }
        , { value: 'loginFailCount', name: '登錄錯誤次數', align: 'center', canSort: true, width: '1%' }
        , { value: 'updateTime', name: '修改時間', align: 'center', width: '100%', onRender: GridRenderUtil.date }
      ]
      , contentColumns: [
        { value: 'updateUser', name: '修改人', align: 'center', width: '1%', onRender: GridRenderUtil.user }
        , { value: 'updateTime', name: '修改時間', align: 'center', width: '1%', onRender: GridRenderUtil.date }
        , { value: 'createUser', name: '建立人', align: 'center', width: '1%', onRender: GridRenderUtil.user }
        , { value: 'createTime', name: '建立時間', align: 'center', width: '1%', onRender: GridRenderUtil.date }
      ]
      , onLoad: (pageable: Grid.IPageable, callback: Grid.ILoad<User>) => {
        let data = CUI.deepClone({}, pageable);
        CUI.deepClone(data, this.searchForm);
        UserService.page(data, (result) => {
          if (result.success) {
            callback(result.data);
          } else {
            alert(AjaxUtil.getMessage(result));
          }
        });
      }
    });
  }
}
