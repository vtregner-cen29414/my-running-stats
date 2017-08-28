import { MyRunningStatsPage } from './app.po';

describe('my-running-stats App', () => {
  let page: MyRunningStatsPage;

  beforeEach(() => {
    page = new MyRunningStatsPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
