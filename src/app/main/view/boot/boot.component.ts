import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-boot',
  templateUrl: './boot.component.html',
  styleUrls: ['./boot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BootComponent {
  constructor() { }
}
