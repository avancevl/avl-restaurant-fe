import { Cache, CUI } from '@cui/core';
import { DomUtil } from 'ts/util/dom-util';
import { ProxyRequest, ProxyService } from 'ts/service/core/proxy-service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';


function defaultForm(): ProxyRequest {
  return {
    url: ''
    , method: 'get'
    , headers: ''
    , params: ''
    , body: ''
    , connectionTimeout: 10000
    , readTimeout: 30000
  };
}

@Component({
  selector: 'app-proxy',
  templateUrl: './proxy.component.html',
  styleUrls: ['./proxy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProxyComponent implements OnDestroy {
  @Cache.session('Proxy', defaultForm())
  public form: ProxyRequest;
  public result = '';

  private pasteHandler;

  constructor(private cdf: ChangeDetectorRef) {
    this.pasteHandler = DomUtil.addPasteListener(this.pasteCallback);

  }

  ngOnDestroy() {
    DomUtil.removePasteListener(this.pasteHandler);
  }


  /**
   * 將剪貼簿的內容解析
   */
  private pasteCallback = (text) => {
    try {
      this.form = JSON.parse(text);
      this.form.connectionTimeout = 10000;
      this.form.readTimeout = 30000;
      this.cdf.detectChanges();
    } catch (e) {
      console.log(e);
      alert('資料格式錯誤');
    }
  }

  public submit() {
    ProxyService.post(this.form, this.callback);
  }

  public formSubmit() {
    let array = this.form.params.split('\n');
    let strs;
    let params = {}, key, value;
    for (let i in array) {
      strs = array[i].split(':');
      key = strs[0];
      value = strs.slice(1).join(':');
      params[key] = value;
    }

    CUI.submit({
      url: this.form.url,
      params: params,
      method: this.form.method,
      target: 'proxy'
    });
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
