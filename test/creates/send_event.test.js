const App = require('../../index');
const { mockEventResponse, createMockZ } = require('../helpers');
const { BASE_URL, INTEGRATION, VERSION } = require('../../constants');

const perform = App.creates['send_event'].operation.perform;

describe('creates.send_event', () => {
  describe('perform', () => {
    it('should send an event with only a message', async () => {
      const z = createMockZ(200, mockEventResponse);
      const bundle = { inputData: { message: 'Deploy complete' } };
      const result = await perform(z, bundle);

      const call = z.request.mock.calls[0][0];
      const body = JSON.parse(call.body);

      expect(body.message).toBe('Deploy complete');
      expect(body.channel).toBeNull();
      expect(body.event).toBeNull();
      expect(body.tags).toBeNull();

      expect(result.workspace).toBe('My Workspace');
      expect(result.channel).toBe('General');
      expect(result.eventId).toBe('abc123');
    });

    it('should send an event with all fields', async () => {
      const z = createMockZ(200, mockEventResponse);
      const bundle = {
        inputData: {
          message: 'New user signed up',
          channel: 'signups',
          event: 'user.signup',
          title: 'New User',
          link: 'https://example.com',
          tags: ['growth', 'organic'],
          data: { source: 'web' },
        },
      };
      const result = await perform(z, bundle);

      const call = z.request.mock.calls[0][0];
      const body = JSON.parse(call.body);

      expect(body.message).toBe('New user signed up');
      expect(body.channel).toBe('signups');
      expect(body.event).toBe('user.signup');
      expect(body.title).toBe('New User');
      expect(body.link).toBe('https://example.com');
      expect(body.tags).toEqual(['growth', 'organic']);
      expect(body.data).toEqual({ source: 'web' });

      expect(result.workspace).toBe('My Workspace');
    });

    it('should send correct URL and headers', async () => {
      const z = createMockZ(200, mockEventResponse);
      const bundle = { inputData: { message: 'Test' } };
      await perform(z, bundle);

      const call = z.request.mock.calls[0][0];
      expect(call.url).toBe(`${BASE_URL}/oauth/event`);
      expect(call.method).toBe('POST');
      expect(call.headers['X-Integration']).toBe(INTEGRATION);
      expect(call.headers['X-Version']).toBe(VERSION);
      expect(call.headers['Content-Type']).toBe('application/json');
    });

    it('should trim whitespace from string fields', async () => {
      const z = createMockZ(200, mockEventResponse);
      const bundle = {
        inputData: {
          message: '  Hello  ',
          channel: '  dev  ',
          title: '  Title  ',
        },
      };
      await perform(z, bundle);

      const body = JSON.parse(z.request.mock.calls[0][0].body);
      expect(body.message).toBe('Hello');
      expect(body.channel).toBe('dev');
      expect(body.title).toBe('Title');
    });

    it('should treat empty strings as null', async () => {
      const z = createMockZ(200, mockEventResponse);
      const bundle = {
        inputData: {
          message: 'Hello',
          channel: '   ',
          event: '',
          title: '',
          link: '  ',
        },
      };
      await perform(z, bundle);

      const body = JSON.parse(z.request.mock.calls[0][0].body);
      expect(body.channel).toBeNull();
      expect(body.event).toBeNull();
      expect(body.title).toBeNull();
      expect(body.link).toBeNull();
    });

    it('should parse comma-separated tags string', async () => {
      const z = createMockZ(200, mockEventResponse);
      const bundle = {
        inputData: { message: 'Deploy', tags: 'deploy, prod, v2' },
      };
      await perform(z, bundle);

      const body = JSON.parse(z.request.mock.calls[0][0].body);
      expect(body.tags).toEqual(['deploy', 'prod', 'v2']);
    });

    it('should handle tags as array', async () => {
      const z = createMockZ(200, mockEventResponse);
      const bundle = {
        inputData: { message: 'Deploy', tags: ['deploy', 'prod'] },
      };
      await perform(z, bundle);

      const body = JSON.parse(z.request.mock.calls[0][0].body);
      expect(body.tags).toEqual(['deploy', 'prod']);
    });

    it('should handle empty data object as null', async () => {
      const z = createMockZ(200, mockEventResponse);
      const bundle = {
        inputData: { message: 'Hello', data: {} },
      };
      await perform(z, bundle);

      const body = JSON.parse(z.request.mock.calls[0][0].body);
      expect(body.data).toBeNull();
    });

    it('should default message to fallback when empty', async () => {
      const z = createMockZ(200, mockEventResponse);
      const bundle = { inputData: { message: '   ' } };
      await perform(z, bundle);

      const body = JSON.parse(z.request.mock.calls[0][0].body);
      expect(body.message).toBe('No message provided');
    });

    it('should throw on API error', async () => {
      const z = createMockZ(400, { error: 'Bad request' });
      const bundle = { inputData: { message: 'Test' } };
      await expect(perform(z, bundle)).rejects.toThrow();
    });
  });

  describe('structure', () => {
    it('should have correct display properties', () => {
      expect(App.creates['send_event'].display.label).toBe('Send Event');
      expect(App.creates['send_event'].display.hidden).toBe(false);
    });

    it('should require message field', () => {
      const fields = App.creates['send_event'].operation.inputFields;
      const message = fields.find((f) => f.key === 'message');
      expect(message.required).toBe(true);
    });

    it('should have channel as dynamic dropdown', () => {
      const fields = App.creates['send_event'].operation.inputFields;
      const channel = fields.find((f) => f.key === 'channel');
      expect(channel.dynamic).toBe('channel_list.id.label');
      expect(channel.required).toBe(false);
    });

    it('should have all expected input fields', () => {
      const fields = App.creates['send_event'].operation.inputFields;
      const keys = fields.map((f) => f.key);
      expect(keys).toEqual(['channel', 'event', 'title', 'message', 'link', 'tags', 'data']);
    });
  });
});
