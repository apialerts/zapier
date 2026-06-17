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
    id: 'abc123',
    event: 'user.purchase',
    title: 'User Subscribed',
    message: 'John just made his first purchase',
    channel: 'revenue',
    link: 'https://app.apialerts.com',
    tags: ['revenue', 'growth'],
  },
];

const mockOAuthMe = {
  workspaceId: 'ws_123',
  workspaceName: 'My Workspace',
};

const createMockZ = (responseStatus, responseBody) => {
  const mockResponse = {
    status: responseStatus,
    content: JSON.stringify(responseBody),
    throwForStatus: function () {
      if (this.status >= 400) {
        throw new Error(`Response status ${this.status}`);
      }
    },
  };

  return {
    request: jest.fn().mockResolvedValue(mockResponse),
    JSON: JSON,
  };
};

module.exports = {
  mockChannels,
  mockEventResponse,
  mockEvents,
  mockOAuthMe,
  createMockZ,
};
