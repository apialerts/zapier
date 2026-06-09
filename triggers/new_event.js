const { BASE_URL } = require('../constants');

const perform = async (z, bundle) => {
  return [bundle.cleanedRequest];
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'channelFilter',
        label: 'Channel',
        helpText: 'Only trigger for events in this channel. Leave empty to trigger for all channels.',
        type: 'string',
        required: false,
        dynamic: 'channel_list.id.label',
      },
      {
        key: 'glob',
        label: 'Event Pattern',
        helpText: 'Glob pattern to filter events. Examples: * (all events), user.* (all user events), user.purchase (exact match). Leave empty to trigger for all events.',
        type: 'string',
        required: false,
        placeholder: 'user.*',
      },
    ],
    type: 'hook',
    performSubscribe: {
      body: {
        hookUrl: '{{bundle.targetUrl}}',
        channelFilter: '{{bundle.inputData.channelFilter}}',
        glob: '{{bundle.inputData.glob}}',
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'POST',
      url: `${BASE_URL}/oauth/hooks`,
    },
    performUnsubscribe: {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'DELETE',
      url: `${BASE_URL}/oauth/hooks/{{bundle.subscribeData.id}}`,
    },
    performList: {
      headers: { Accept: 'application/json' },
      url: `${BASE_URL}/oauth/events`,
    },
    sample: {
      id: 'abc123',
      event: 'user.purchase',
      title: 'User Subscribed',
      message: 'John just made his first purchase',
      channel: 'revenue',
      link: 'https://app.apialerts.com',
      tags: ['revenue', 'growth'],
      data: { key: 'value' },
      created: '2026-03-28T00:00:00Z',
    },
    outputFields: [
      { key: 'id', label: 'Event ID' },
      { key: 'event', label: 'Event Key' },
      { key: 'title', label: 'Title' },
      { key: 'message', label: 'Message' },
      { key: 'channel', label: 'Channel' },
      { key: 'link', label: 'Link' },
      { key: 'tags', label: 'Tags', type: 'string', list: true },
      { key: 'data', label: 'Custom Data', type: 'string', dict: true },
      { key: 'created', label: 'Created', type: 'datetime' },
    ],
  },
  display: {
    description: 'Triggers when a new event is created.',
    hidden: false,
    label: 'New Event',
  },
  key: 'new_event',
  noun: 'Event',
};
