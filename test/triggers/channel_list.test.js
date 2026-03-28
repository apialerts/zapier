const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../../index');
const { mockChannels, authBundle, nockApi, cleanNock } = require('../helpers');

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

afterEach(cleanNock);

describe('triggers.channel_list', () => {
  describe('perform', () => {
    it('should fetch channels from the API', async () => {
      nockApi()
        .get('/oauth/channels')
        .reply(200, mockChannels);

      const bundle = { ...authBundle, inputData: {} };
      const results = await appTester(
        App.triggers['channel_list'].operation.perform,
        bundle,
      );

      expect(results).toHaveLength(3);
      expect(results[0].id).toBe('general');
      expect(results[0].label).toBe('General');
      expect(results[1].id).toBe('revenue');
      expect(results[2].id).toBe('deployments');
    });

    it('should handle empty channel list', async () => {
      nockApi()
        .get('/oauth/channels')
        .reply(200, []);

      const bundle = { ...authBundle, inputData: {} };
      const results = await appTester(
        App.triggers['channel_list'].operation.perform,
        bundle,
      );

      expect(results).toHaveLength(0);
    });

    it('should throw on API error', async () => {
      nockApi()
        .get('/oauth/channels')
        .reply(401, { error: 'Unauthorized' });

      const bundle = { ...authBundle, inputData: {} };
      await expect(
        appTester(App.triggers['channel_list'].operation.perform, bundle),
      ).rejects.toThrow();
    });
  });

  describe('structure', () => {
    it('should be a polling trigger', () => {
      expect(App.triggers['channel_list'].operation.type).toBe('polling');
    });

    it('should be hidden (used as dynamic dropdown)', () => {
      expect(App.triggers['channel_list'].display.hidden).toBe(true);
    });

    it('should have id and label output fields', () => {
      const fields = App.triggers['channel_list'].operation.outputFields;
      const keys = fields.map((f) => f.key);
      expect(keys).toContain('id');
      expect(keys).toContain('label');
    });
  });
});
