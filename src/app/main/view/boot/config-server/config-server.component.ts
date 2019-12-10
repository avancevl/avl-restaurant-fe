import { Cache, CUI } from '@cui/core';
import { ProxyRequest, ProxyService } from 'ts/service/core/proxy-service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

function defaultForm(): ProxyRequest {
  return {
    url: 'http://192.168.1.100:8763/config/encrypt'
    , method: 'POST'
    , headers: ''
    , params: ''
    , body: ''
  };
}

@Component({
  selector: 'app-config-server',
  templateUrl: './config-server.component.html',
  styleUrls: ['./config-server.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigServerComponent {
  @Cache.session('ConfigServer', defaultForm())
  public form: ProxyRequest;
  @Cache.session('ConfigServer', '')
  public result;

  constructor(private cdf: ChangeDetectorRef) {

  }

  public submit() {
    if (this.form.method == 'GET') {
      ProxyService.get(this.form, this.callback);
    } else {
      ProxyService.post(this.form, this.callback);
    }
  }

  public clean() {
    this.form = defaultForm();
    this.result = '';
  }


  private callback = (result) => {
    try {
      this.result = CUI.printJson(this.parseContent(result));
    } catch (e) {
      this.result = result;
    }
    this.cdf.markForCheck();
  }

  private parseContent(result): string {
    try {
      let content = result.data && result.data.response.content;
      if (content) {
        result.data.response.content = this.parseContent(JSON.parse(content));
      }
      return result;
    } catch (e) {
      return result;
    }
  }

}
