const App = require('../../index');
const { BASE_URL } = require('../../constants');
const { createMockZ } = require('../helpers');

const perform = App.triggers['new_event'].operation.perform;
const subscribe = App.triggers['new_event'].operation.performSubscribe;

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
    it('should POST to /oauth/hooks with the hook url and filters', async () => {
      const z = createMockZ(200, { id: 'hook_1' });
      const bundle = {
        targetUrl: 'https://hooks.zapier.com/abc',
        inputData: { channelFilter: 'revenue', glob: 'user.*' },
      };

      const result = await subscribe(z, bundle);

      const req = z.request.mock.calls[0][0];
      expect(req.method).toBe('POST');
      expect(req.url).toBe(`${BASE_URL}/oauth/hooks`);
      const body = JSON.parse(req.body);
      expect(body.hookUrl).toBe('https://hooks.zapier.com/abc');
      expect(body.channelFilter).toBe('revenue');
      expect(body.glob).toBe('user.*');
      expect(result.id).toBe('hook_1');
    });

    it('should send null filters when blank so the backend matches all events', async () => {
      const z = createMockZ(200, { id: 'hook_2' });
      const bundle = {
        targetUrl: 'https://hooks.zapier.com/abc',
        inputData: { channelFilter: '', glob: '   ' },
      };

      await subscribe(z, bundle);

      const body = JSON.parse(z.request.mock.calls[0][0].body);
      expect(body.channelFilter).toBeNull();
      expect(body.glob).toBeNull();
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
      expect(keys).toEqual(['id', 'event', 'title', 'message', 'channel', 'link', 'tags', 'data', 'created']);
    });
  });
});
