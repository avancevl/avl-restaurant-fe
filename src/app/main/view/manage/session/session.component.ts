import { AjaxUtil, CUI } from '@cui/core';
import { BasicComponent } from '../../../../basic-component';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';
import { Grid } from '@cui/core';
import { DomUtil } from 'ts/util/dom-util';
import { GridRenderUtil } from 'ts/util/grid-render-util';
import { RequestSession } from 'ts/data/entity/auth-user';
import { SessionService } from 'ts/service/core/session-service';


@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionComponent extends BasicComponent {

  public grid: Grid.PageGrid<RequestSession>;

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
   * 刪除
   */
  public remove(record: RequestSession, index, grid: Grid.PageGrid<RequestSession>, e: Event) {
    e.stopPropagation();
    if (window.confirm('確定要刪除?')) {
      SessionService.remove({ id: record.id }, (result) => {
        if (result.success) {
          grid.reload();
        } else {
          alert(AjaxUtil.getMessage(result));
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
     * 產生grid
     */
  private buildGrid() {
    return Grid.PageGridBuilder.build<RequestSession>({
      size: 100,
      index: true,
      rowColumns: [
        { value: 'username', name: '使用者', align: 'left', width: '1%', canSort: true, onRender: GridRenderUtil.user }
        , { value: 'count', name: '數量', align: 'left', width: '100%' }
      ]
      , contentColumns: [
        {
          value: 'username', name: '', className: '', element: true
          , onRender: (value, record: RequestSession, index: number) => {
            return this.buildDetilGrid(value);
          }
        }
      ]
      , onLoad: (pageable: Grid.IPageable, callback: Grid.ILoad) => {
        SessionService.group(pageable, (result) => {
          if (result.success) {
            this.cdf.markForCheck();
            callback(result.data);
          } else {
            alert(AjaxUtil.getMessage(result));
          }
        });
      }
    });
  }

  /**
   * 產生grid
   */
  private buildDetilGrid(username) {
    let grid = Grid.PageGridBuilder.build<RequestSession>({
      size: 100,
      index: true,
      rowColumns: [
        {
          value: '', name: '操作', align: 'left', width: '1%', element: true, tdTranslate: true
          , onRender: (value, record, index) => {
            return DomUtil.buildButton({
              text: '註銷',
              className: 'bg-accent small ' + this.ApiClassName.DeleteSession,
              onclick: this.remove.bind(this, record, index, grid)
            });
          }
        }
        , { value: 'id', name: 'Session ID', align: 'left', width: '1%', canSort: true }
        , { value: 'createTime', name: '建立時間', align: 'left', width: '1%', canSort: true, onRender: GridRenderUtil.date }
        , { value: 'lastAccessTime', name: '最後訪問時間', align: 'left', width: '1%', canSort: true, onRender: GridRenderUtil.date }
        , { value: 'maxInactiveInterval', name: '最大存活時間', align: 'center', width: '1%' }
        , {
          value: 'lastAccessTime', name: '有效時間', align: 'center', width: '1%', onRender: (value, record, index) => {
            return GridRenderUtil.date(value + record.maxInactiveInterval, record, index);
          }
        }
        , { value: 'attributes.ip', name: 'IP', align: 'left', width: '1%' }
        , { value: 'attributes.userAgent', name: '裝置', align: 'left', width: '100%' }
      ]
      , contentColumns: [
        { value: 'attributes', name: '', align: 'left', width: '1%', element: true, onRender: GridRenderUtil.json }
      ]
      , onLoad: (pageable: Grid.IPageable, callback: Grid.ILoad<RequestSession>) => {
        SessionService.query(CUI.deepClone({ username: username }, pageable), (result) => {
          if (result.success) {
            this.cdf.markForCheck();
            result.data.content.forEach(session => {
              try {
                session.attributes = JSON.parse(session.attributes);
              } catch (e) {

              }
            });
            callback(result.data);
          } else {
            alert(AjaxUtil.getMessage(result));
          }
        });
      }
    });
    grid.load();
    return grid.getElement();
  }
}
