import { CommonDialogModule } from './common-dialog.module';

describe('CommonDialogModule', () => {
  let commonDialogModule: CommonDialogModule;

  beforeEach(() => {
    commonDialogModule = new CommonDialogModule();
  });

  it('should create an instance', () => {
    expect(commonDialogModule).toBeTruthy();
  });
});
