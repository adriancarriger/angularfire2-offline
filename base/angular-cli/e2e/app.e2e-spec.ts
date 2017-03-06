import { AfoTestPage } from './app.po';

describe('afo-test App', () => {
  let page: AfoTestPage;

  beforeEach(() => {
    page = new AfoTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
