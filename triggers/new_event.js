const { BASE_URL } = require('../constants');

const perform = async (z, bundle) => {
  return [bundle.cleanedRequest];
};

// Send blank filters as null so the backend treats them as "no filter".
// An empty string would otherwise be stored verbatim and match no events.
const cleanString = (value) =>
  typeof value === 'string' && value.trim() !== '' ? value.trim() : null;

const subscribe = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/oauth/hooks`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: z.JSON.stringify({
      hookUrl: bundle.targetUrl,
      channelFilter: cleanString(bundle.inputData.channelFilter),
      glob: cleanString(bundle.inputData.glob),
    }),
  });
  response.throwForStatus();
  return z.JSON.parse(response.content);
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'channelFilter',
        label: 'Channel',
        helpText: 'Optional. Leave blank for all channels, or pick one to only trigger on its events.',
        type: 'string',
        required: false,
        dynamic: 'channel_list.id.label',
      },
      {
        key: 'glob',
        label: 'Event Pattern',
        helpText: 'Optional. Leave blank for all events, or enter a glob pattern to match event keys (e.g. user.* matches user.signup and user.purchase).',
        type: 'string',
        required: false,
        placeholder: 'user.*',
      },
    ],
    type: 'hook',
    performSubscribe: subscribe,
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
