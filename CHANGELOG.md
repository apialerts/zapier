# Changelog

## 3.0.3

Fixes filtering on the New Event trigger.

1. Blank Channel or Event Pattern filters are now sent as null so the trigger fires on all events, instead of matching nothing.
2. Clearer help text on both filter fields.

## 3.0.2

API Alerts rebuilt on the Zapier CLI platform. OAuth2 sign-in tied to your API Alerts workspace.

1. New trigger! trigger/new_event - fires when a matching event arrives in your workspace. Optional Channel and Event Pattern filters scope which events start your Zap (Event Pattern accepts glob syntax, e.g. `user.*`).
2. New trigger! trigger/channel_list - dynamic dropdown of your workspace's channels, used to populate the Channel filter.
3. New action! create/send_event - post an event into API Alerts from any Zap.

## 3.0.1

Initial rebuild of the integration on the Zapier CLI platform.

## 2.0.0

Added workspace support via channels. Built on Zapier's legacy web builder, API key authentication.

## 1.0.0

Initial release: a single trigger using API key authentication. Built on Zapier's legacy web builder.
