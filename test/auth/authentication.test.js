const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../../index');
const { mockOAuthMe, authBundle, nockApi, cleanNock } = require('../helpers');

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

afterEach(cleanNock);

describe('authentication', () => {
  it('should be oauth2 type', () => {
    expect(App.authentication.type).toBe('oauth2');
  });

  it('should have autoRefresh enabled', () => {
    expect(App.authentication.oauth2Config.autoRefresh).toBe(true);
  });

  describe('test', () => {
    it('should pass with valid token', async () => {
      nockApi()
        .get('/oauth/me')
        .reply(200, mockOAuthMe);

      const bundle = { ...authBundle, inputData: {} };
      const result = await appTester(App.authentication.test, bundle);

      expect(result.workspaceName).toBe('My Workspace');
    });

    it('should fail with invalid token', async () => {
      nockApi()
        .get('/oauth/me')
        .reply(401, { error: 'Unauthorized' });

      const bundle = { ...authBundle, inputData: {} };
      await expect(
        appTester(App.authentication.test, bundle),
      ).rejects.toThrow();
    });
  });

  describe('connectionLabel', () => {
    it('should use workspaceName', () => {
      expect(App.authentication.connectionLabel).toBe(
        '{{bundle.inputData.workspaceName}}',
      );
    });
  });
});
