# API Alerts x Zapier

Source for the API Alerts Zapier app. Published openly for transparency: you can read every line of code that runs when your Zaps talk to API Alerts.

If you just want to use the integration, find it in the Zapier app directory — no need to clone this repo.

## What's in here

Zapier Platform CLI app providing OAuth2 authentication, two triggers and one create action.

- `index.js` — app manifest (triggers, creates, auth, request template with bearer header)
- `authentication.js` — OAuth2 config (authorize, token, refresh)
- `constants.js` — base URLs and version
- `triggers/new_event.js` — fires when a matching event arrives in your workspace
- `triggers/channel_list.js` — dynamic dropdown of your workspace's channels
- `creates/send_event.js` — posts an event into API Alerts
- `test/` — Jest tests using mocked `z.request`

Built on `zapier-platform-core` 18.x, Node `>=22`.

## Contributing

Bug reports, suggestions and pull requests are welcome. A few ground rules:

- Open an issue first for anything non-trivial so we can talk through the design before you spend time on a PR.
- Run `npm test` before submitting — tests in `test/` are pure unit tests with mocked HTTP, no credentials needed.
- Keep changes scoped. One PR = one concern.

For questions or anything else, [open an issue](../../issues) or email support@apialerts.com.

## Running tests locally

```bash
npm install
npm test
```

That's enough to validate code changes. The tests mock `z.request`, so no API credentials or OAuth setup is needed.
