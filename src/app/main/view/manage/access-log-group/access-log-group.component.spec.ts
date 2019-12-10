import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessLogGroupComponent } from './access-log-group.component';

describe('AccessLogGroupComponent', () => {
  let component: AccessLogGroupComponent;
  let fixture: ComponentFixture<AccessLogGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessLogGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessLogGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
