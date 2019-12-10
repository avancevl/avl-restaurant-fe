import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigServerComponent } from './config-server.component';

describe('ConfigServerComponent', () => {
  let component: ConfigServerComponent;
  let fixture: ComponentFixture<ConfigServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
