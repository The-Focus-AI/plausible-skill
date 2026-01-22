#!/usr/bin/env node

/**
 * Simple script to query Plausible Analytics API
 * 
 * Usage:
 *   node query-plausible.js <site_id> [date_range] [metrics] [dimensions]
 * 
 * Examples:
 *   node query-plausible.js example.com 7d
 *   node query-plausible.js example.com 30d visitors,pageviews visit:source
 * 
 * Or set environment variables:
 *   PLAUSIBLE_SITE_ID=example.com PLAUSIBLE_DATE_RANGE=7d node query-plausible.js
 */

import { execSync } from 'child_process';

const PLAUSIBLE_API_URL = process.env.PLAUSIBLE_API_URL || 'https://plausible.io/api/v2';

/**
 * Get API key from 1Password or environment variable
 */
async function getApiKey() {
  // Try environment variable first
  if (process.env.PLAUSIBLE_API_KEY) {
    return process.env.PLAUSIBLE_API_KEY;
  }

  // Try 1Password
  try {
    const result = execSync(
      'op read "op://Development/plausible api/notesPlain"',
      { encoding: 'utf8' }
    );
    return result.trim();
  } catch (error) {
    throw new Error(
      'Could not get Plausible API key. Set PLAUSIBLE_API_KEY environment variable or configure 1Password CLI.'
    );
  }
}

/**
 * Make a query to Plausible API
 */
async function queryPlausible(query) {
  const apiKey = await getApiKey();

  const response = await fetch(`${PLAUSIBLE_API_URL}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Plausible API error (${response.status}): ${errorText}`);
  }

  return await response.json();
}

/**
 * Main function
 */
async function main() {
  // Parse command line arguments or use environment variables
  const siteId = process.argv[2] || process.env.PLAUSIBLE_SITE_ID;
  const dateRange = process.argv[3] || process.env.PLAUSIBLE_DATE_RANGE || '7d';
  const metricsArg = process.argv[4] || process.env.PLAUSIBLE_METRICS || 'visitors';
  const dimensionsArg = process.argv[5] || process.env.PLAUSIBLE_DIMENSIONS;

  if (!siteId) {
    console.error('Error: site_id is required');
    console.error('Usage: node query-plausible.js <site_id> [date_range] [metrics] [dimensions]');
    console.error('   or set PLAUSIBLE_SITE_ID environment variable');
    process.exit(1);
  }

  // Build query
  const query = {
    site_id: siteId,
    metrics: metricsArg.split(',').map(m => m.trim()),
    date_range: dateRange,
  };

  // Add dimensions if provided
  if (dimensionsArg) {
    query.dimensions = dimensionsArg.split(',').map(d => d.trim());
  }

  try {
    const result = await queryPlausible(query);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { queryPlausible, getApiKey };
