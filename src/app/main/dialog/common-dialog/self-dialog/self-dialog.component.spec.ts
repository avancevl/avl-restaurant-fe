import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfDialogComponent } from './self-dialog.component';

describe('SelfDialogComponent', () => {
  let component: SelfDialogComponent;
  let fixture: ComponentFixture<SelfDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
