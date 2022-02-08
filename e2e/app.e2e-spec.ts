import { HouseAfricaMarketplaceAppAngularPage } from './app.po';

describe('house-africa-marketplace-app-angular App', () => {
  let page: HouseAfricaMarketplaceAppAngularPage;

  beforeEach(() => {
    page = new HouseAfricaMarketplaceAppAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
