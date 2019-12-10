import { AjaxUtil } from '@cui/core';
import { Role } from 'ts/data/entity/entity';
import { RoleService } from 'ts/service/core/role-service';
import { BasicState } from 'ts/constant/basic-state';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild
} from '@angular/core';
import { CUI, Grid } from '@cui/core';
import { DomUtil } from 'ts/util/dom-util';
import { GridRenderUtil } from 'ts/util/grid-render-util';
import { BasicComponent } from 'app/basic-component';
import { RoleDialogComponent } from 'app/main/dialog/manage-dialog/role-dialog/role-dialog.component';
import { RolePermissionComponent } from 'app/main/dialog/manage-dialog/role-permission/role-permission.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleComponent extends BasicComponent {
  public grid: Grid.PageGrid<Role>;
  @ViewChild(RoleDialogComponent)
  public dialog: RoleDialogComponent;
  @ViewChild(RolePermissionComponent)
  public permissionDialog: RolePermissionComponent;

  constructor(private cdf: ChangeDetectorRef) {
    super();
    this.grid = this.buildGrid();
    this.search();
  }

  /**
   * 查詢
   */
  public search() {
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
   * 完成
   */
  public onComplete = () => {
    this.grid.reload();
  }

  public modifyPermission = (record: Role, index, e: Event) => {
    this.permissionDialog.open(BasicState.Update, record, index);
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
          , onRender: (value, record: Role, index) => {
            return DomUtil.buildButton({
              text: '修改',
              className: 'bg-primary small ' + this.ApiClassName.PutRole,
              onclick: this.modify.bind(this, record, index)
            }, record.level);
          }
        }
        , { value: 'id', name: 'ID', align: 'center', canSort: true, width: '1%', }
        , { value: 'name', name: '名稱', align: 'center', canSort: true, width: '1%' }
        , {
          value: 'level', name: '等級', align: 'center', canSort: true, width: '1%'
        }
        , {
          value: '', name: '權限設定', align: 'center', width: '1%', element: true, tdTranslate: true
          , onRender: (value, record: Role, index) => {
            return DomUtil.buildButton({
              text: '設定',
              className: 'bg-dark small ' + this.ApiClassName.PutRolePermission,
              onclick: this.modifyPermission.bind(this, record, index)
            }, record.level);
          }
        }
        , { value: 'updateUser', name: '修改人', align: 'center', width: '1%', onRender: GridRenderUtil.user }
        , { value: 'updateTime', name: '修改時間', align: 'center', width: '1%', onRender: GridRenderUtil.date }
        , { value: 'createUser', name: '建立人', align: 'center', width: '1%', onRender: GridRenderUtil.user }
        , { value: 'createTime', name: '建立時間', align: 'center', width: '1%', onRender: GridRenderUtil.date }
      ],
      onLoad: (pageable: Grid.IPageable, callback: Grid.ILoad<Role>) => {
        RoleService.page(pageable, (result) => {
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
