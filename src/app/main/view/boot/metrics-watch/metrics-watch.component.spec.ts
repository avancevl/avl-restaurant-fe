import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsWatchComponent } from './metrics-watch.component';

describe('MetricsWatchComponent', () => {
  let component: MetricsWatchComponent;
  let fixture: ComponentFixture<MetricsWatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricsWatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
