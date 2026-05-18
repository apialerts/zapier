# Releasing

Maintainer-only workflow for shipping a new version of the API Alerts Zapier app.

## Prerequisites

- Zapier Platform CLI installed and logged in: `npm install -g zapier-platform-cli && zapier login`
- `CLIENT_ID` / `CLIENT_SECRET` for the prod OAuth client (from 1Password)
- Write access to the `api-alerts` app on Zapier

## Release workflow

### 1. Prepare the change

Make the code change. Run tests.

```bash
npm install
npm test
```

### 2. Bump version + changelog

Pick the next semver bump based on the change:

- `patch` — bug fix, no behavior change visible to users
- `minor` — new trigger / action, backwards compatible
- `major` — breaking change to an existing trigger / action (forces user re-setup)

```bash
npm version <patch|minor|major>
```

Add a section to `CHANGELOG.md` matching the new version. Zapier's parser looks for `## <version>` and supports these conventions:

- Lines starting with `Update` or `Fix` are treated as bugfix lines
- Issues referenced as `#<num>` (numeric only)
- Triggers / creates referenced as `trigger/<key>`, `create/<key>`, `search/<key>`


### 3. Push to Zapier

```bash
zapier-platform push
```

This uploads the current tree to the Zapier platform under the version in `package.json`. It creates a new draft version, or overwrites an existing draft of the same version. Promoted versions are immutable.

### 4. Set app-level env vars

Only required on a brand-new version (re-pushes inherit env from the prior version, but it's cheap to re-run):

```bash
zapier-platform env:set <version> CLIENT_ID=<from 1Password> CLIENT_SECRET=<from 1Password>
```

Never put `ACCESS_TOKEN` / `REFRESH_TOKEN` on the Zapier env — those are per-user and stored by Zapier internally after each user's OAuth flow.

### 5. Smoke test the new version

**In Zapier's dev console**, open the app's Versions tab, switch the visible version to the new draft, and test your own Zap against it. Recommended for first release of any minor / major bump.

### 6. Promote

```bash
zapier-platform promote <version>
```

This makes the new version the default for any new Zaps. Existing Zaps stay on whatever version they were created against.

### 7. Migrate existing users (when ready)

If the change is non-breaking and you want everyone moved over:

```bash
zapier-platform migrate <old version> <new version>
```

Migration is asynchronous and happens in batches. For breaking changes (major bumps), don't migrate — let users opt in by re-creating their Zap, which is how Zapier surfaces the upgrade prompt.

### 8. Verify in production

`zapier-platform versions` shows the version table with state and user counts. Confirm the new version shows `Zap Users` > 0 once a real user has authenticated against it.
