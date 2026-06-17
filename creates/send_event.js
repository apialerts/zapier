const { BASE_URL, INTEGRATION, VERSION } = require('../constants');

const perform = async (z, bundle) => {
  const cleanString = (value) => {
    return typeof value === 'string' && value.trim() !== ''
      ? value.trim()
      : null;
  };

  let tags = bundle.inputData.tags;
  if (typeof tags === 'string') {
    tags = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  } else if (!Array.isArray(tags)) {
    tags = [];
  }

  let data = null;
  if (
    bundle.inputData.data &&
    typeof bundle.inputData.data === 'object' &&
    Object.keys(bundle.inputData.data).length > 0
  ) {
    data = bundle.inputData.data;
  }

  const body = {
    event: cleanString(bundle.inputData.event),
    channel: cleanString(bundle.inputData.channel),
    title: cleanString(bundle.inputData.title),
    message: cleanString(bundle.inputData.message) || 'No message provided',
    link: cleanString(bundle.inputData.link),
    tags: tags.length > 0 ? tags : null,
    data: data,
  };

  return z
    .request({
      url: `${BASE_URL}/oauth/event`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Integration': INTEGRATION,
        'X-Version': VERSION,
      },
      body: z.JSON.stringify(body),
    })
    .then((response) => {
      response.throwForStatus();
      return z.JSON.parse(response.content);
    });
};

module.exports = {
  display: {
    description: 'Sends an event to your API Alerts workspace',
    hidden: false,
    label: 'Send Event',
  },
  key: 'send_event',
  noun: 'Event',
  operation: {
    inputFields: [
      {
        key: 'channel',
        label: 'Channel',
        type: 'string',
        helpText:
          "Optional, Use the channel 'identifier' here not the channel name. Uses the default workspace channel if not set.",
        dynamic: 'channel_list.id.label',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'event',
        label: 'Event Key',
        type: 'string',
        helpText: 'Optional, A event key or name. Useful for event routing',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'title',
        label: 'Title',
        type: 'string',
        helpText: 'Optional, Title to attach to the message',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'message',
        label: 'Message',
        type: 'text',
        helpText: 'Message to send to your devices',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'link',
        label: 'Link',
        type: 'string',
        helpText:
          'Optional link i.e. [https://apialerts.com](https://apialerts.com)',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'tags',
        label: 'Tags',
        type: 'string',
        helpText: 'Optional, list of tags',
        required: false,
        list: true,
        altersDynamicFields: false,
      },
      {
        key: 'data',
        label: 'Custom Data',
        helpText:
          'Optional, Any extra data you would like to send with the event. Useful for event routing',
        dict: true,
        required: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      workspace: 'API Alerts',
      channel: 'General',
      eventId: 'WpNbzEJyxo',
    },
    outputFields: [
      { key: 'workspace', label: 'Workspace Name' },
      { key: 'channel', label: 'Channel Name' },
      { key: 'eventId', label: 'Event ID', type: 'string' },
    ],
    perform: perform,
  },
};
