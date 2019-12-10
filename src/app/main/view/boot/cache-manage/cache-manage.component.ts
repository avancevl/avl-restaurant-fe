import { Component, ChangeDetectorRef } from '@angular/core';
import { Cache, Grid } from '@cui/core';
import { CacheManageService } from 'ts/service/core/cache-manage-service';
import { DomUtil } from 'ts/util/dom-util';
import { GridRenderUtil } from 'ts/util/grid-render-util';

interface CacheKey {
  key: string;
  data: any;
}

interface CacheNode {
  name: string;
  cacheKeys: CacheKey[];
}


@Component({
  selector: 'app-cache-manage',
  templateUrl: './cache-manage.component.html',
  styleUrls: ['./cache-manage.component.scss']
})
export class CacheManageComponent {
  @Cache.session('url', window.location.origin)
  public url;
  @Cache.session('activeName', '')
  public activeName: string;

  public activeCache: CacheNode;

  public caches: CacheNode[] = [];
  public grid: Grid.Grid<CacheKey>;

  constructor(private cdf: ChangeDetectorRef) {
    this.init();
    this.grid = this.buildGrid();
  }

  public init() {
    CacheManageService.query(this.url, (result) => {
      this.cdf.markForCheck();
      if (result.success) {
        this.convert(result.data);
      } else {
        alert(result.message);
      }
    });
  }

  private convert(data: any) {
    this.caches.length = 0;
    if (data) {
      let cache, active: CacheNode;
      let cacheKeys: CacheKey[];
      for (let name in data) {
        cache = data[name];
        cacheKeys = [];
        for (let key in cache) {
          cacheKeys.push({
            key: key,
            data: cache[key]
          });
        }
        active = {
          name: name,
          cacheKeys: cacheKeys
        };
        this.caches.push(active);
        if (this.activeName == name) {
          this.activeCache = active;
          this.grid.load(active.cacheKeys);
        }
      }
    }
  }

  public load(cache: CacheNode) {
    this.activeCache = cache;
    this.activeName = cache.name;
    this.grid.load(cache.cacheKeys);
  }

  public evict(notify: boolean, record: CacheKey, index, e: Event) {
    e.stopPropagation();
    CacheManageService.evict(this.url
      , {
        name: this.activeCache.name,
        key: record.key,
        notify: notify
      }
      , this.callback);


  }

  public clearAll(notify: boolean) {
    CacheManageService.clear(this.url
      , {
        notify: notify
      }
      , this.callback);
  }

  public callback = (result) => {
    if (result.success) {
      this.init();
    } else {
      alert(result.message);
    }
  }

  /**
   * 產生grid
   */
  public buildGrid() {
    let grid = Grid.PageGridBuilder.build({
      rowColumns: [
        {
          value: 'key', name: '操作', align: 'left', width: '1%', element: true, tdTranslate: true
          , onRender: (value, record: CacheKey, index) => {
            return [
              DomUtil.buildButton({
                text: '清除',
                className: 'small bg-accent',
                onclick: this.evict.bind(this, false, record, index)
              }),
              DomUtil.buildButton({
                text: '清除並通知',
                className: 'small bg-accent',
                onclick: this.evict.bind(this, true, record, index)
              })
            ];
          }
        }
        , { value: 'key', name: 'key', align: 'left', width: '100%' }
      ],
      contentColumns: [
        , { value: 'data', name: 'data', align: 'left', width: '100%', element: true, onRender: GridRenderUtil.json }
      ]
    });
    return grid;
  }
}
