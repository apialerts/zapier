const nock = require('nock');
const { BASE_URL, OAUTH_URL } = require('../constants');

const mockChannels = [
  { id: 'general', label: 'General' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'deployments', label: 'Deployments' },
];

const mockEventResponse = {
  workspace: 'My Workspace',
  channel: 'General',
  eventId: 'abc123',
};

const mockEvents = [
  {
    event: 'user.purchase',
    title: 'User Subscribed',
    message: 'John just made his first purchase',
    channel: 'revenue',
    link: 'https://app.apialerts.com',
    tags: ['revenue', 'growth'],
    data: { key: 'value' },
  },
];

const mockOAuthMe = {
  workspaceId: 'ws_123',
  workspaceName: 'My Workspace',
};

const mockAccessToken = {
  access_token: 'mock_access_token',
  refresh_token: 'mock_refresh_token',
  token_type: 'Bearer',
  expires_in: 3600,
};

const authBundle = {
  authData: {
    access_token: 'mock_access_token',
    refresh_token: 'mock_refresh_token',
  },
};

const nockApi = () => nock(BASE_URL);
const nockOAuth = () => nock(OAUTH_URL);

const cleanNock = () => {
  nock.cleanAll();
  nock.enableNetConnect();
};

module.exports = {
  mockChannels,
  mockEventResponse,
  mockEvents,
  mockOAuthMe,
  mockAccessToken,
  authBundle,
  nockApi,
  nockOAuth,
  cleanNock,
};
