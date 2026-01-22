# Plausible Query Script

Simple Node.js script to query Plausible Analytics API v2.

## Overview

This repository contains:
- A simple script (`query-plausible.js`) to query Plausible Analytics
- A Claude skill (`.cursor/skills/plausible-query/`) with comprehensive guidance on querying Plausible

## Quick Start

### Prerequisites

- Node.js 18+ (uses native fetch)
- Plausible API key (from your Plausible account settings)

### Authentication

The script supports two methods for API key authentication:

**1. Environment Variable:**
```bash
export PLAUSIBLE_API_KEY=your_api_key_here
```

**2. 1Password (recommended):**
Store your API key at: `op://Development/plausible api/notesPlain`

### Usage

**Basic query:**
```bash
node query-plausible.js example.com 7d
```

**With metrics:**
```bash
node query-plausible.js example.com 30d visitors,pageviews
```

**With dimensions:**
```bash
node query-plausible.js example.com 30d visitors,pageviews visit:source
```

**Using environment variables:**
```bash
PLAUSIBLE_SITE_ID=example.com PLAUSIBLE_DATE_RANGE=7d node query-plausible.js
```

### Command Line Arguments

```
node query-plausible.js <site_id> [date_range] [metrics] [dimensions]
```

- `site_id` (required): Your domain as configured in Plausible (e.g., "example.com")
- `date_range` (optional): Time period - "day", "7d", "30d", "month", "6mo", "12mo" (default: "7d")
- `metrics` (optional): Comma-separated metrics - "visitors", "pageviews", "bounce_rate", etc. (default: "visitors")
- `dimensions` (optional): Comma-separated dimensions - "visit:source", "visit:country", etc.

### Examples

**Get visitor count for last week:**
```bash
node query-plausible.js example.com 7d visitors
```

**Top traffic sources:**
```bash
node query-plausible.js example.com 30d visitors,pageviews visit:source
```

**Country breakdown:**
```bash
node query-plausible.js example.com month visitors visit:country
```

## Output

The script outputs JSON results from the Plausible API:

```json
{
  "results": [
    {
      "metrics": [1234],
      "dimensions": []
    }
  ],
  "meta": {
    "imports_included": false,
    "total_rows": 1
  },
  "query": {
    "site_id": "example.com",
    "metrics": ["visitors"],
    "date_range": "7d"
  }
}
```

## Claude Skill

This repository includes a Claude skill for comprehensive Plausible querying guidance:

**Location:** `.cursor/skills/plausible-query/`

The skill provides:
- Complete API reference documentation
- Common query patterns
- Real-world examples
- Best practices

The skill automatically triggers when you ask about:
- Querying Plausible
- Plausible analytics
- Plausible API
- Metrics and dimensions
- Query construction

## API Documentation

For detailed API documentation, query patterns, and examples, see:
- `.cursor/skills/plausible-query/SKILL.md` - Main skill guide
- `.cursor/skills/plausible-query/references/api-reference.md` - Complete API reference
- `.cursor/skills/plausible-query/references/query-patterns.md` - Common patterns
- `.cursor/skills/plausible-query/references/examples.md` - Detailed examples
- `.cursor/skills/plausible-query/examples/common-queries.json` - JSON query templates

## Available Metrics

- `visitors` - Unique visitors
- `visits` - Number of visits/sessions
- `pageviews` - Pageview events
- `bounce_rate` - Bounce rate percentage
- `visit_duration` - Average visit duration (seconds)
- `views_per_visit` - Average pages per visit
- `events` - Total events

## Common Dimensions

**Event dimensions:**
- `event:page` - Full page URL
- `event:page.pathname` - Page path
- `event:name` - Event name

**Visit dimensions:**
- `visit:source` - Traffic source
- `visit:country` - Country code
- `visit:device` - Device type
- `visit:browser` - Browser name
- `visit:utm_campaign` - UTM campaign

**Time dimensions:**
- `time:day` - Group by day
- `time:week` - Group by week
- `time:month` - Group by month
- `time:hour` - Group by hour (day range only)

## Rate Limits

- Default: 600 requests per hour
- Contact Plausible support for increased limits

## License

MIT
