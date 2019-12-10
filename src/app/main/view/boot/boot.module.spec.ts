import { BootModule } from './boot.module';

describe('BootModule', () => {
  let bootModule: BootModule;

  beforeEach(() => {
    bootModule = new BootModule();
  });

  it('should create an instance', () => {
    expect(bootModule).toBeTruthy();
  });
});
