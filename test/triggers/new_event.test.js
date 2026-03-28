const App = require('../../index');
const { BASE_URL } = require('../../constants');

const perform = App.triggers['new_event'].operation.perform;

describe('triggers.new_event', () => {
  describe('perform', () => {
    it('should return the webhook payload as-is', async () => {
      const payload = {
        id: 'xyz789',
        event: 'user.signup',
        message: 'New user registered',
        channel: 'signups',
      };

      const z = {};
      const bundle = { cleanedRequest: payload };
      const results = await perform(z, bundle);

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual(payload);
    });

    it('should return payload with all fields', async () => {
      const payload = {
        id: 'abc123',
        event: 'user.purchase',
        title: 'New Purchase',
        message: 'John bought a plan',
        channel: 'revenue',
        link: 'https://example.com',
        tags: ['revenue', 'growth'],
      };

      const z = {};
      const bundle = { cleanedRequest: payload };
      const results = await perform(z, bundle);

      expect(results[0].id).toBe('abc123');
      expect(results[0].event).toBe('user.purchase');
      expect(results[0].title).toBe('New Purchase');
      expect(results[0].message).toBe('John bought a plan');
      expect(results[0].channel).toBe('revenue');
      expect(results[0].link).toBe('https://example.com');
      expect(results[0].tags).toEqual(['revenue', 'growth']);
    });
  });

  describe('subscribe/unsubscribe', () => {
    it('should POST to /oauth/hooks for subscribe', () => {
      const sub = App.triggers['new_event'].operation.performSubscribe;
      expect(sub.method).toBe('POST');
      expect(sub.url).toBe(`${BASE_URL}/oauth/hooks`);
      expect(sub.body.hookUrl).toBe('{{bundle.targetUrl}}');
    });

    it('should DELETE to /oauth/hooks/{id} for unsubscribe', () => {
      const unsub = App.triggers['new_event'].operation.performUnsubscribe;
      expect(unsub.method).toBe('DELETE');
      expect(unsub.url).toBe(`${BASE_URL}/oauth/hooks/{{bundle.subscribeData.id}}`);
    });
  });

  describe('performList', () => {
    it('should point to /oauth/events', () => {
      const list = App.triggers['new_event'].operation.performList;
      expect(list.url).toBe(`${BASE_URL}/oauth/events`);
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

    it('should have sample data matching live payload', () => {
      const sample = App.triggers['new_event'].operation.sample;
      expect(sample.id).toBeDefined();
      expect(sample.event).toBeDefined();
      expect(sample.message).toBeDefined();
      expect(sample.channel).toBeDefined();
      expect(sample.data).toBeDefined();
    });

    it('should have output fields matching live payload', () => {
      const fields = App.triggers['new_event'].operation.outputFields;
      const keys = fields.map((f) => f.key);
      expect(keys).toEqual(['id', 'event', 'title', 'message', 'channel', 'link', 'tags', 'data', 'createdAt']);
    });
  });
});
