# Releasing

Releases run through GitHub Actions. Creating a GitHub release pushes the integration to Zapier, and two manual buttons handle going live and moving existing users - no local CLI needed.

## Steps

1. Bump the version in `package.json` and add a matching `## <version>` section to `CHANGELOG.md`.
2. Merge to `main`.
3. Create a GitHub release with the tag `v<version>` (the tag must match the `package.json` version, or the workflow fails its version check).

The tag triggers `.github/workflows/publish.yml`, which tests, validates, runs `zapier-platform push`, and sets the OAuth env vars on the new version.

## Go live

`push` only creates a draft version - it doesn't affect any users. Promotion is a deliberate, manual step: smoke-test the draft against your own Zap in Zapier's dev console first, then promote.

In the **Actions** tab, run the **Promote** workflow and enter the version (e.g. `3.0.3`). This makes the version the default for new Zaps. Existing Zaps stay on the version they were created against.

## Migrate existing users (optional)

To move existing users' Zaps onto a newer version, run the **Migrate** workflow in the **Actions** tab with the from/to versions, and an optional percentage for a gradual rollout.

Only migrate for non-breaking changes. For breaking changes, leave users where they are and let them opt in by recreating their Zap.
