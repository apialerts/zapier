const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../../index');
const { mockEvents, authBundle, nockApi, cleanNock } = require('../helpers');

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

afterEach(cleanNock);

describe('triggers.new_event', () => {
  describe('perform', () => {
    it('should return the webhook payload as-is', async () => {
      const payload = {
        event: 'user.signup',
        message: 'New user registered',
        channel: 'signups',
      };

      const bundle = {
        cleanedRequest: payload,
      };

      const results = await appTester(
        App.triggers['new_event'].operation.perform,
        bundle,
      );

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual(payload);
    });

    it('should return payload with all fields', async () => {
      const payload = {
        event: 'user.purchase',
        title: 'New Purchase',
        message: 'John bought a plan',
        channel: 'revenue',
        link: 'https://example.com',
        tags: ['revenue', 'growth'],
        data: { amount: 99 },
      };

      const bundle = { cleanedRequest: payload };
      const results = await appTester(
        App.triggers['new_event'].operation.perform,
        bundle,
      );

      expect(results[0].event).toBe('user.purchase');
      expect(results[0].title).toBe('New Purchase');
      expect(results[0].message).toBe('John bought a plan');
      expect(results[0].channel).toBe('revenue');
      expect(results[0].link).toBe('https://example.com');
      expect(results[0].tags).toEqual(['revenue', 'growth']);
      expect(results[0].data).toEqual({ amount: 99 });
    });
  });

  describe('performList', () => {
    it('should fetch recent events', async () => {
      nockApi()
        .get('/oauth/events')
        .reply(200, mockEvents);

      const bundle = { ...authBundle, inputData: {} };
      const results = await appTester(
        App.triggers['new_event'].operation.performList,
        bundle,
      );

      expect(results).toHaveLength(1);
      expect(results[0].event).toBe('user.purchase');
      expect(results[0].message).toBe('John just made his first purchase');
    });
  });

  describe('structure', () => {
    it('should be a hook trigger', () => {
      expect(App.triggers['new_event'].operation.type).toBe('hook');
    });

    it('should have correct display properties', () => {
      expect(App.triggers['new_event'].display.label).toBe('New Event');
      expect(App.triggers['new_event'].display.hidden).toBe(false);
    });

    it('should have sample data', () => {
      const sample = App.triggers['new_event'].operation.sample;
      expect(sample.event).toBeDefined();
      expect(sample.message).toBeDefined();
      expect(sample.channel).toBeDefined();
    });

    it('should have output fields', () => {
      const fields = App.triggers['new_event'].operation.outputFields;
      const keys = fields.map((f) => f.key);
      expect(keys).toContain('event');
      expect(keys).toContain('message');
      expect(keys).toContain('channel');
    });
  });
});
