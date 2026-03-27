const authentication = require('./authentication');
const newEventTrigger = require('./triggers/new_event.js');
const channelListTrigger = require('./triggers/channel_list.js');
const sendEventCreate = require('./creates/send_event.js');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  creates: { [sendEventCreate.key]: sendEventCreate },
  requestTemplate: {
    headers: { Authorization: 'Bearer {{bundle.authData.access_token}}' },
  },
  triggers: {
    [newEventTrigger.key]: newEventTrigger,
    [channelListTrigger.key]: channelListTrigger,
  },
  authentication: authentication,
};
