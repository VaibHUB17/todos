import { NhostClient } from '@nhost/nhost-js';

const subdomain = process.env.REACT_APP_NHOST_SUBDOMAIN;
const region = process.env.REACT_APP_NHOST_REGION;

// Fail fast with a clear message when env values are missing.
if (!subdomain || !region) {
  throw new Error(
    'Missing Nhost config. Set REACT_APP_NHOST_SUBDOMAIN and REACT_APP_NHOST_REGION in your .env file.'
  );
}

export const nhost = new NhostClient({
  subdomain,
  region
});
