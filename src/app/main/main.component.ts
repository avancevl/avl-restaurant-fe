import { Async } from '@cui/core';
import { AuthUserNode, MainMenuWidthNode } from 'ts/data/node/common';
import { BasicComponent } from '../basic-component';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent extends BasicComponent {
  public authUser = AuthUserNode.get();
  public paddingLeft = MainMenuWidthNode.get() + 'px';

  constructor(private cdf: ChangeDetectorRef) {
    super();
    this.listenNode(AuthUserNode, () => {
      this.resetUser();
    }, false);

    this.listenNode(MainMenuWidthNode, () => {
      this.paddingLeftChange();
    }, false);
  }


  @Async()
  private resetUser() {
    this.authUser = AuthUserNode.get();
    if (!this.authUser) {
      MainMenuWidthNode.set(0);
    }
    this.cdf.markForCheck();
  }

  @Async()
  private paddingLeftChange() {
    this.paddingLeft = MainMenuWidthNode.get() + 'px';
    this.cdf.markForCheck();
  }
}
