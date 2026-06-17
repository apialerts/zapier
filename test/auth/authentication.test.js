const App = require('../../index');

describe('authentication', () => {
  it('should be oauth2 type', () => {
    expect(App.authentication.type).toBe('oauth2');
  });

  it('should have autoRefresh enabled', () => {
    expect(App.authentication.oauth2Config.autoRefresh).toBe(true);
  });

  it('should use correct test endpoint', () => {
    expect(App.authentication.test.url).toContain('/oauth/me');
  });

  it('should use correct authorize URL', () => {
    expect(App.authentication.oauth2Config.authorizeUrl.url).toContain('/oauth/authorize');
  });

  it('should use correct token URL for access token', () => {
    expect(App.authentication.oauth2Config.getAccessToken.url).toContain('/oauth/token');
  });

  it('should use correct token URL for refresh', () => {
    expect(App.authentication.oauth2Config.refreshAccessToken.url).toContain('/oauth/token');
  });

  it('should use workspaceName as connection label', () => {
    expect(App.authentication.connectionLabel).toBe(
      '{{bundle.inputData.workspaceName}}',
    );
  });
});
