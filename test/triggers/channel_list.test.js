const App = require('../../index');
const { mockChannels, createMockZ } = require('../helpers');
const { BASE_URL } = require('../../constants');

const perform = App.triggers['channel_list'].operation.perform;

describe('triggers.channel_list', () => {
  describe('perform', () => {
    it('should fetch channels from the API', async () => {
      const z = createMockZ(200, mockChannels);
      const bundle = {};
      const results = await perform(z, bundle);

      expect(z.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${BASE_URL}/oauth/channels`,
          method: 'GET',
        }),
      );
      expect(results).toHaveLength(3);
      expect(results[0].id).toBe('general');
      expect(results[0].label).toBe('General');
    });

    it('should handle empty channel list', async () => {
      const z = createMockZ(200, []);
      const results = await perform(z, {});

      expect(results).toHaveLength(0);
    });

    it('should throw on API error', async () => {
      const z = createMockZ(401, { error: 'Unauthorized' });
      await expect(perform(z, {})).rejects.toThrow();
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
