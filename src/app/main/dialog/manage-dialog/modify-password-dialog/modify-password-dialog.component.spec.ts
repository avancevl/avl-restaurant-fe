import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPasswordDialogComponent } from './modify-password-dialog.component';

describe('ModifyPasswordDialogComponent', () => {
  let component: ModifyPasswordDialogComponent;
  let fixture: ComponentFixture<ModifyPasswordDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyPasswordDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
