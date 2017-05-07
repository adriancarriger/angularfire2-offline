import { Ng4Page } from './app.po';

describe('ng4 App', () => {
  let page: Ng4Page;

  beforeEach(() => {
    page = new Ng4Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
