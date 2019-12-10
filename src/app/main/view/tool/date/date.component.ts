import { Component, OnInit } from '@angular/core';
import { DateUtil } from 'ts/util/date-util';
import { AppConfig } from 'ts/app-config';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent {
  public format: string = AppConfig.YYYYMMDDHHmmss;
  public time = DateUtil.now() as number;
  public date = DateUtil.now(this.format) as string;
  public timeResult: string;
  public dateResult: number;

  constructor() {
    this.input();
  }


  public input() {
    this.timeResult = DateUtil.format(this.time, this.format);
    this.dateResult = DateUtil.time(this.date);
  }

}
