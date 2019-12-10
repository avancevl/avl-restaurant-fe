import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiBuildComponent } from './api-build.component';

describe('ApiBuildComponent', () => {
  let component: ApiBuildComponent;
  let fixture: ComponentFixture<ApiBuildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApiBuildComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiBuildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
