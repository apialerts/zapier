const { BASE_URL } = require('../constants');

const perform = async (z, bundle) => {
  return [bundle.cleanedRequest];
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [],
    type: 'hook',
    performSubscribe: {
      body: { hookUrl: '{{bundle.targetUrl}}' },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'POST',
      url: `${BASE_URL}/hooks`,
    },
    performUnsubscribe: {
      body: { hookUrl: '{{bundle.subscribeData.id}}' },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'DELETE',
      url: `${BASE_URL}/hooks`,
    },
    performList: {
      headers: { Accept: 'application/json' },
      url: `${BASE_URL}/oauth/events`,
    },
    sample: {
      event: 'user.purchase',
      title: 'User Subscribed',
      message: 'John just made his first purchase',
      channel: 'revenue',
      link: 'https://app.apialerts.com',
      tags: ['revenue', 'growth'],
      data: { key: 'value' },
    },
    outputFields: [
      { key: 'event', label: 'Event Key' },
      { key: 'title', label: 'Title' },
      { key: 'message', label: 'Message' },
      { key: 'channel', label: 'Channel ID' },
      { key: 'link', label: 'Link' },
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
