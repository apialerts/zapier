const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../../index');
const { mockEventResponse, authBundle, nockApi, cleanNock } = require('../helpers');
const { INTEGRATION, VERSION } = require('../../constants');

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

afterEach(cleanNock);

describe('creates.send_event', () => {
  describe('perform', () => {
    it('should send an event with only a message', async () => {
      nockApi()
        .post('/oauth/event', (body) => {
          expect(body.message).toBe('Deploy complete');
          expect(body.channel).toBeNull();
          expect(body.event).toBeNull();
          expect(body.tags).toBeNull();
          return true;
        })
        .reply(200, mockEventResponse);

      const bundle = {
        ...authBundle,
        inputData: { message: 'Deploy complete' },
      };

      const result = await appTester(
        App.creates['send_event'].operation.perform,
        bundle,
      );

      expect(result.workspace).toBe('My Workspace');
      expect(result.channel).toBe('General');
      expect(result.eventId).toBe('abc123');
    });

    it('should send an event with all fields', async () => {
      nockApi()
        .post('/oauth/event', (body) => {
          expect(body.message).toBe('New user signed up');
          expect(body.channel).toBe('signups');
          expect(body.event).toBe('user.signup');
          expect(body.title).toBe('New User');
          expect(body.link).toBe('https://example.com');
          expect(body.tags).toEqual(['growth', 'organic']);
          expect(body.data).toEqual({ source: 'web' });
          return true;
        })
        .reply(200, mockEventResponse);

      const bundle = {
        ...authBundle,
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

      const result = await appTester(
        App.creates['send_event'].operation.perform,
        bundle,
      );

      expect(result.workspace).toBe('My Workspace');
    });

    it('should send correct headers', async () => {
      nockApi()
        .post('/oauth/event')
        .reply(function () {
          expect(this.req.headers['x-integration']).toContain(INTEGRATION);
          expect(this.req.headers['x-version']).toContain(VERSION);
          expect(this.req.headers['content-type']).toContain('application/json');
          return [200, mockEventResponse];
        });

      const bundle = {
        ...authBundle,
        inputData: { message: 'Test' },
      };

      await appTester(
        App.creates['send_event'].operation.perform,
        bundle,
      );
    });

    it('should trim whitespace from string fields', async () => {
      nockApi()
        .post('/oauth/event', (body) => {
          expect(body.message).toBe('Hello');
          expect(body.channel).toBe('dev');
          expect(body.title).toBe('Title');
          return true;
        })
        .reply(200, mockEventResponse);

      const bundle = {
        ...authBundle,
        inputData: {
          message: '  Hello  ',
          channel: '  dev  ',
          title: '  Title  ',
        },
      };

      await appTester(
        App.creates['send_event'].operation.perform,
        bundle,
      );
    });

    it('should treat empty strings as null', async () => {
      nockApi()
        .post('/oauth/event', (body) => {
          expect(body.channel).toBeNull();
          expect(body.event).toBeNull();
          expect(body.title).toBeNull();
          expect(body.link).toBeNull();
          return true;
        })
        .reply(200, mockEventResponse);

      const bundle = {
        ...authBundle,
        inputData: {
          message: 'Hello',
          channel: '   ',
          event: '',
          title: '',
          link: '  ',
        },
      };

      await appTester(
        App.creates['send_event'].operation.perform,
        bundle,
      );
    });

    it('should parse comma-separated tags string', async () => {
      nockApi()
        .post('/oauth/event', (body) => {
          expect(body.tags).toEqual(['deploy', 'prod', 'v2']);
          return true;
        })
        .reply(200, mockEventResponse);

      const bundle = {
        ...authBundle,
        inputData: {
          message: 'Deploy',
          tags: 'deploy, prod, v2',
        },
      };

      await appTester(
        App.creates['send_event'].operation.perform,
        bundle,
      );
    });

    it('should handle empty data object as null', async () => {
      nockApi()
        .post('/oauth/event', (body) => {
          expect(body.data).toBeNull();
          return true;
        })
        .reply(200, mockEventResponse);

      const bundle = {
        ...authBundle,
        inputData: {
          message: 'Hello',
          data: {},
        },
      };

      await appTester(
        App.creates['send_event'].operation.perform,
        bundle,
      );
    });

    it('should default message to fallback when empty', async () => {
      nockApi()
        .post('/oauth/event', (body) => {
          expect(body.message).toBe('No message provided');
          return true;
        })
        .reply(200, mockEventResponse);

      const bundle = {
        ...authBundle,
        inputData: { message: '   ' },
      };

      await appTester(
        App.creates['send_event'].operation.perform,
        bundle,
      );
    });

    it('should throw on API error', async () => {
      nockApi()
        .post('/oauth/event')
        .reply(400, { error: 'Bad request' });

      const bundle = {
        ...authBundle,
        inputData: { message: 'Test' },
      };

      await expect(
        appTester(App.creates['send_event'].operation.perform, bundle),
      ).rejects.toThrow();
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
