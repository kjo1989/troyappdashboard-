import { TroypointPage } from './app.po';

describe('troypoint App', () => {
  let page: TroypointPage;

  beforeEach(() => {
    page = new TroypointPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
