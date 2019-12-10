import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { BasicComponent } from 'app/basic-component';
import { BasicService } from 'ts/service/core/basic-service';
import { CUI } from '@cui/core';
import { Global } from 'ts/globle';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends BasicComponent implements AfterViewInit {

  @ViewChild('loginWindow') loginWindowRef: ElementRef;
  private loginWindow: HTMLElement;

  public errorMessage = '';
  public form = {
    account: Global.env.account,
    password: Global.env.password
  };
  constructor(private cdf: ChangeDetectorRef) {
    super();

  }

  ngAfterViewInit(): void {
    this.loginWindow = this.loginWindowRef.nativeElement;
    this.resizeHandler();
    setTimeout(() => {
      this.loginWindow.classList.add('show');
    }, 0);
    CUI.addElementContentChangeEvent(this.loginWindow, this.resizeHandler);
    CUI.addListenOnEnter(this.loginWindow, this.login);
  }


  /**
   * 更新置中位置
   */
  private resizeHandler = () => {
    CUI.setTranslateCenter(this.loginWindow);
  }

  /**
   * 登錄
   */
  public login = () => {
    Global.loader.open('登錄中');
    BasicService.login(this.form, (result) => {
      Global.loader.close();
      if (!result.success) {
        this.errorMessage = result.message;
      }
      this.cdf.markForCheck();
    });
  }
}
