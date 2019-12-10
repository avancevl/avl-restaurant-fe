import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfModifyPasswordDialogComponent } from './self-modify-password-dialog.component';

describe('SelfModifyPasswordDialogComponent', () => {
  let component: SelfModifyPasswordDialogComponent;
  let fixture: ComponentFixture<SelfModifyPasswordDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfModifyPasswordDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfModifyPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
