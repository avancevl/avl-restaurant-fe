import { BootService } from 'ts/service/core/boot-service';
import { Cache, IAjaxManagerResult } from '@cui/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { DownloadUtil } from 'ts/util/download-util';
import { Global } from 'ts/globle';
import { DomUtil } from 'ts/util/dom-util';

@Component({
  selector: 'app-api-build',
  templateUrl: './api-build.component.html',
  styleUrls: ['./api-build.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiBuildComponent {
  @Cache.session('ApiBuild', window.location.origin)
  public url;
  public result = '';

  private fileName = 'api.ts';
  private ignoreRegExp = new RegExp('^' + [
    '(/error)'
    , '(.+\.json)'
  ].join('|') + '$');

  constructor(private cdf: ChangeDetectorRef) {
  }

  /**
   * 清除
   */
  public clean = () => {
    this.url = window.location.origin;
    this.result = '';
  }

  /**
   * 下載
   */
  public download() {
    BootService.mappings(this.url, (result: IAjaxManagerResult) => {
      if (result.success) {
        delete result.success;
        // let parseData = this.parseApiPath(result);
        let parseData = this.parseApiPath2(result);
        let content = this.toEnum('ApiClassName', parseData.classNames) + '\n' + this.toEnum('ApiPath', parseData.paths);
        DownloadUtil.js(this.fileName, content);
      } else {
        this.result = result.message;
      }
    });
  }

  /**
   *
   * @param element
   */
  public copy() {
    DomUtil.copyText(this.result);
  }

  /**
   * 產生
   */
  public build() {
    BootService.mappings(this.url, (result: IAjaxManagerResult) => {
      if (result.success) {
        delete result.success;
        // let parseData = this.parseApiPath(result);
        let parseData = this.parseApiPath2(result);
        this.result = this.toEnum('ApiClassName', parseData.classNames) + '\n' + this.toEnum('ApiPath', parseData.paths);
      } else {
        this.result = result.message;
      }
      this.cdf.markForCheck();
    });
  }

  /** */
  private parseApiPath2 = (data) => {
    let result = {
      classNames: {},
      paths: {}
    };
    data = data.contexts[''].mappings.dispatcherServlets.dispatcherServlet;
    let id, key, patterns, path, methods, method;
    for (let j in data) {
      patterns = data[j].details;
      if (!patterns) {
        continue;
      }
      methods = patterns.requestMappingConditions.methods;
      patterns = patterns.requestMappingConditions.patterns;
      if (patterns.length == 0) {
        continue;
      }
      key = patterns[0];
      path = key.replace(/\/{.+}/g, '').replace(/[{}\[\]]/g, '').trim().replace(/\/$/g, '');
      if (path && !this.ignoreRegExp.test(path)) {
        id = path.replace(/(\/|-)(.)/g, function ($0, $1, $2) {
          return $2.toUpperCase();
        });

        for (let m in methods) {
          method = methods[m];
          method = method.substring(0, 1).toUpperCase() + method.substring(1).toLowerCase();
          result.classNames[method + id] = 'role-' + method.toLowerCase() + '-' + path.replace(/^\//, '').replace(/\//g, '-').toLowerCase();
          result.paths[method + id] = path;
        }

      }

    }
    return result;
  }

  /** */
  private parseApiPath = (data) => {
    let result = {
      classNames: {},
      paths: {}
    };
    let id;
    for (let key in data) {
      let index = key.indexOf(',');
      let paths = key.substring(0, index).replace(/\/{.+}/g, '').replace(/[{}\[\]]/g, '').split('||');
      for (let i in paths) {
        let path = paths[i].trim().replace(/\/$/g, '');
        if (path && !this.ignoreRegExp.test(path)) {
          id = path.replace(/(\/|-)(.)/g, function ($0, $1, $2) {
            return $2.toUpperCase();
          });
          result.classNames[id] = 'authority-' + path.replace(/^\//, '').replace(/\//g, '-').toLowerCase();
          result.paths[id] = path;
        }
      }
    }
    return result;
  }

  private toEnum = (name: string, data) => {
    let content = 'export enum ' + name + '{\n';
    for (let key in data) {
      content += key + '=\'' + data[key] + '\',\n';
    }
    content += '}';
    return content;
  }
}
