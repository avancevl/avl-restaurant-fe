import { ManageDialogModule } from './manage-dialog.module';

describe('ManageDialogModule', () => {
  let manageDialogModule: ManageDialogModule;

  beforeEach(() => {
    manageDialogModule = new ManageDialogModule();
  });

  it('should create an instance', () => {
    expect(manageDialogModule).toBeTruthy();
  });
});
