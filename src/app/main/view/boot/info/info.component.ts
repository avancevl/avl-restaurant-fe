import { AjaxDataType, Cache, CUI } from '@cui/core';
import { Global } from 'ts/globle';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoComponent {
  @Cache.session('Info', window.location.origin)
  public url;
  @Cache.session('Info', '')
  public result;

  private method = {
    refresh: 'POST',
    restart: 'POST',
    pause: 'POST',
    resume: 'POST',
    shutdown: 'POST',
  };

  constructor(private cdf: ChangeDetectorRef) {

  }

  public action(name: string) {
    if (!this.url) { return; }
    let method = this.method[name] || 'GET';
    if (name == 'restart' || name == 'shutdown') {
      if (!window.confirm('確定要執行' + name + '!??')) {
        return;
      }
    }
    let url = this.url + '/actuator/' + name;
    Global.ajaxManager.request({
      url: url,
      method: method,
      dataType: AjaxDataType.JSON,
      callback: this.callback
    });
  }

  public callback = (result) => {
    if (result.success) {
      delete result.success;
      this.result = CUI.printJson(result);
    } else {
      this.result = CUI.printJson(result.message);
    }
    this.cdf.markForCheck();
  }
}
