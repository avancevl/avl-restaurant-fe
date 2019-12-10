import Chart from 'chart.js';
import { BootService } from 'ts/service/core/boot-service';
import { Cache, CUI } from '@cui/core';
import { DateUtil } from 'ts/util/date-util';
import {
  ChangeDetectorRef,
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';


interface Metric {
  id: string;
  name: string;
  className: string;
  width: string;
  chart?: Chart;
}

@Component({
  selector: 'app-metrics-watch',
  templateUrl: './metrics-watch.component.html',
  styleUrls: ['./metrics-watch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricsWatchComponent implements OnDestroy {
  private times = [];
  private metricsStore = {};
  private timer;
  private column = 2;
  private className = {
    open: 'show',
    close: ''
  };

  @Cache.session('MetricsWatch', window.location.origin)
  public url;
  @Cache.session('MetricsWatch', 3000)
  public interval;
  public running = false;
  public metricss: Metric[] = [];

  constructor(private cdf: ChangeDetectorRef) {

  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

  public start() {
    this.cdf.markForCheck();
    if (this.running) {
      return;
    }
    this.running = true;
    this.query();
  }

  public stop() {
    this.cdf.markForCheck();
    if (!this.running) {
      return;
    }
    this.running = false;
    clearTimeout(this.timer);
  }

  public clean() {
    this.times = [];
    this.metricss = [];
    this.metricsStore = {};
  }

  public changeColumn(c: number) {
    if (this.column == c) {
      return;
    }
    this.column = c;
    for (let i in this.metricss) {
      this.metricss[i].width = Math.floor(100 / c) + '%';
    }
  }


  private query = () => {
    if (!this.url) { return; }
    BootService.metrics(this.url, this.callback);
  }

  private callback = (result) => {
    this.cdf.markForCheck();
    if (result.success) {
      delete result.success;
      this.parseMetrics(result);
      this.updateCharts();
      this.timer = setTimeout(this.query, this.interval);
    } else {
      alert(result.message);
      this.stop();
    }
  }

  private parseMetrics(data) {
    let index = this.times.length;
    let matchs, value, store, id, isMulti, render;
    // 迴圈所有指標
    for (let key in data) {
      // 找出需要產生成多筆資料的名稱
      matchs = key.match(KindRegex);
      value = data[key];
      isMulti = (matchs && matchs.length > 0);
      id = isMulti ? matchs[0] : key;
      render = MetricsDataRender[id];
      value = render ? render(value) : value;
      store = this.metricsStore[id];
      if (!store) {
        this.metricss.push({
          id: id,
          name: MetricsName[id] || id,
          className: this.className.close,
          width: Math.floor(100 / this.column) + '%'
        });
        store = this.metricsStore[id] = isMulti ? {} : new Array(index).fill(0);
      }
      if (isMulti) {
        MultiDataHandler(index, id, store, key, value);
      } else {
        store.push(value);
      }
    }
    this.times.push(DateUtil.now('HH:mm:ss'));
  }

  public showChart(parent: Element, metric: Metric) {
    if (!metric.chart) {
      let canvas = document.createElement('canvas');
      metric.chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: this.times,
          datasets: this.dataToChartData(metric.name, metric.id)
        }
      });
      parent.appendChild(canvas);
    }

    if (metric.className == this.className.open) {
      metric.className = this.className.close;
    } else {
      metric.className = this.className.open;
      metric.chart.update();
    }
  }

  /**
   * 更新圖表
   */
  public updateCharts() {
    let metrics;
    for (let i in this.metricss) {
      metrics = this.metricss[i];
      if (metrics.className == this.className.open && metrics.chart) {
        metrics.chart.update();
      }
    }
  }

  private dataToChartData(name, dataName) {
    let data = this.metricsStore[dataName];
    let datasets = [];
    let color;
    if (CUI.isArray(data)) {
      datasets.push(CreateLineData(name, data, Colors[0]));
    } else {
      let c = 0;
      for (let i in data) {
        color = Colors[c++] || Colors[c = 0];
        datasets.push(CreateLineData(i, data[i], color));
      }
    }
    return datasets;
  }
}


// multi data regex
const KindRegex = RegExp([
  'mem',
  'heap',
  'nonheap',
  'threads',
  'classes',
  'httpsessions',
  'datasource',
  'counter\.status\.[^.]+',
  'gauge\.response',
  'gc'
].join('|'));

// 顏色庫
const Colors = [
  ['#E91E63', '#F06292'],
  ['#F44336', '#E57373'],
  ['#9C27B0', '#BA68C8'],
  ['#673AB7', '#9575CD'],
  ['#3F51B5', '#7986CB'],
  ['#2196F3', '#64B5F6'],
  ['#03A9F4', '#4FC3F7'],
  ['#00BCD4', '#4DD0E1'],
  ['#009688', '#4DB6AC'],
  ['#4CAF50', '#81C784'],
  ['#8BC34A', '#AED581'],
  ['#CDDC39', '#DCE775'],
  ['#FFEB3B', '#FFF176'],
  ['#FFC107', '#FFD54F'],
  ['#FF9800', '#FFB74D'],
  ['#FF5722', '#FF8A65'],
  ['#795548', '#A1887F'],
  ['#9E9E9E', '#E0E0E0'],
  ['#607D8B', '#90A4AE']
];

// 名稱
const MetricsName = {};
MetricsName['mem'] = '記憶體(MB)';
MetricsName['processors'] = 'CPU核心';
MetricsName['instance.uptime'] = 'Instance運行時間(小時)';
MetricsName['uptime'] = '系統運行時間(小時)';
MetricsName['systemload.average'] = '系統負載';
MetricsName['heap'] = '堆疊(MB)';
MetricsName['nonheap'] = '非堆疊(MB)';
MetricsName['threads'] = '執行緒(thread)';
MetricsName['classes'] = '類別(classe)';
MetricsName['gc'] = '資源回收(GC)';
MetricsName['httpsessions'] = 'Http Session';
MetricsName['datasource'] = '資料庫連線';
MetricsName['gauge.response'] = '最後回應花費時間(毫)';

// 資料轉換
const MetricsDataRender = {};
MetricsDataRender['mem'] = convertKB2MB;
MetricsDataRender['mem.free'] = convertKB2MB;
MetricsDataRender['heap'] = convertKB2MB;
MetricsDataRender['nonheap'] = convertKB2MB;
MetricsDataRender['instance.uptime'] = convertMs2hour;
MetricsDataRender['uptime'] = convertMs2hour;


/**
 * 毫秒轉小時
 */
function convertMs2hour(value) {
  return Number(value / 3600000).toFixed(1);
}

/**
 * KB 轉 MB
 */
function convertKB2MB(value) {
  return Number(value / 1024).toFixed(1);
}

/**
 * 處理多資料
 */
function MultiDataHandler(length, id, store, key, value) {
  let newId = key.replace(id + '.', '') || key;
  let subStore = store[newId];
  if (!subStore) {
    subStore = store[newId] = Array(length).fill(0);
  }
  subStore.push(value);
}

/**
 * 產生LineData
 */
function CreateLineData(name, data, colors) {
  return {
    label: name,
    fill: false,
    lineTension: 0.1,
    backgroundColor: colors[0],
    borderColor: colors[1],
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: colors[0],
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: colors[0],
    pointHoverBorderColor: colors[1],
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    data: data,
    spanGaps: false,
  };
}
