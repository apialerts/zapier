const { BASE_URL } = require('../constants');

const perform = async (z, bundle) => {
  return z
    .request({
      url: `${BASE_URL}/oauth/channels`,
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    .then((response) => {
      response.throwForStatus();
      return z.JSON.parse(response.content);
    });
};

module.exports = {
  operation: {
    perform: perform,
    type: 'polling',
    sample: { id: 'general', label: 'General' },
    outputFields: [
      { key: 'id', label: 'Channel Identifier' },
      { key: 'label', label: 'Channel Name' },
    ],
  },
  display: {
    description: 'Get the list of workspace channels',
    hidden: true,
    label: 'Channel List',
  },
  key: 'channel_list',
  noun: 'Channel',
};
