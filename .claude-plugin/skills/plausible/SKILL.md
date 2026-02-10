---
name: plausible
description: This skill should be used when the user asks to "query Plausible", "get Plausible analytics", "fetch Plausible stats", "query Plausible API", "get analytics data from Plausible", "plausible metrics", "plausible dimensions", "website traffic", "visitor stats", "page views", "traffic sources", "bounce rate", or needs guidance on constructing Plausible Analytics API queries. Provides tools for querying the Plausible Analytics API v2.
---

# Plausible Analytics Query Guide

Query Plausible Analytics API v2 to retrieve website analytics data.

## Query Script

Run queries using the included script:

```bash
node ${CLAUDE_PLUGIN_ROOT}/query-plausible.js <site_id> [date_range] [metrics] [dimensions]
```

### Authentication

The script gets the API key from:
1. `PLAUSIBLE_API_KEY` environment variable
2. 1Password: `op://Development/plausible api/notesPlain`

### Examples

**Basic visitor count:**
```bash
node ${CLAUDE_PLUGIN_ROOT}/query-plausible.js example.com 7d
```

**Traffic sources:**
```bash
node ${CLAUDE_PLUGIN_ROOT}/query-plausible.js example.com 30d visitors,pageviews visit:source
```

**Country breakdown:**
```bash
node ${CLAUDE_PLUGIN_ROOT}/query-plausible.js example.com month visitors visit:country
```

### Arguments

- `site_id` (required): Domain as configured in Plausible (e.g., "example.com")
- `date_range` (optional): "day", "7d", "30d", "month", "6mo", "12mo" (default: "7d")
- `metrics` (optional): Comma-separated - "visitors", "pageviews", "bounce_rate", "visit_duration", "views_per_visit", "events" (default: "visitors")
- `dimensions` (optional): Comma-separated - "visit:source", "visit:country", "event:page", "time:day", etc.

## Available Metrics

| Metric | Description |
|--------|-------------|
| `visitors` | Unique visitors |
| `visits` | Number of sessions |
| `pageviews` | Pageview events |
| `bounce_rate` | Bounce rate percentage |
| `visit_duration` | Average visit duration (seconds) |
| `views_per_visit` | Average pages per visit |
| `events` | Total events |

## Common Dimensions

**Event:** `event:page`, `event:page.pathname`, `event:name`
**Visit:** `visit:source`, `visit:country`, `visit:device`, `visit:browser`, `visit:utm_campaign`
**Time:** `time:day`, `time:week`, `time:month`, `time:hour` (hour requires "day" date_range)

## API Query Structure

For direct API calls, POST to `https://plausible.io/api/v2/query`:

```json
{
  "site_id": "example.com",
  "metrics": ["visitors", "pageviews"],
  "date_range": "30d",
  "dimensions": ["visit:source"],
  "filters": [["contains", "event:page", ["/blog"]]],
  "order_by": [["visitors", "desc"]],
  "limit": 10
}
```

## Filter Operators

- `is` / `is_not` - Exact match/exclusion
- `contains` / `contains_not` - Substring match
- `matches` / `matches_not` - Regex match
- Combine with `["and", [...]]` or `["or", [...]]`

## Additional Resources

- `references/api-reference.md` - Complete API reference
- `references/query-patterns.md` - Common query patterns
- `references/examples.md` - Real-world examples
- `examples/common-queries.json` - JSON query templates
