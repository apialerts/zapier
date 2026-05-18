const authentication = require('./authentication');
const newEventTrigger = require('./triggers/new_event.js');
const channelListTrigger = require('./triggers/channel_list.js');
const sendEventCreate = require('./creates/send_event.js');

const OAUTH_PUBLIC_PATHS = ['/oauth/token', '/oauth/authorize', '/oauth/revoke'];

const addBearerToken = (request, z, bundle) => {
  const isPublicOAuthPath = OAUTH_PUBLIC_PATHS.some((path) => request.url.includes(path));
  if (bundle.authData?.access_token && !isPublicOAuthPath) {
    request.headers = request.headers || {};
    request.headers.Authorization = `Bearer ${bundle.authData.access_token}`;
  }
  return request;
};

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  flags: { cleanInputData: false },
  beforeRequest: [addBearerToken],
  creates: { [sendEventCreate.key]: sendEventCreate },
  triggers: {
    [newEventTrigger.key]: newEventTrigger,
    [channelListTrigger.key]: channelListTrigger,
  },
  authentication: authentication,
};
