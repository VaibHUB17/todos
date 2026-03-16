import { NhostClient } from '@nhost/nhost-js';

const normalizeEnv = (value) =>
  value ? value.trim().replace(/^['\"]|['\"]$/g, '') : '';

const subdomain = normalizeEnv(process.env.REACT_APP_NHOST_SUBDOMAIN);
const region = normalizeEnv(process.env.REACT_APP_NHOST_REGION);

// Fail fast with a clear message when env values are missing.
if (!subdomain || !region) {
  throw new Error(
    'Missing Nhost config. Set REACT_APP_NHOST_SUBDOMAIN and REACT_APP_NHOST_REGION in your .env file.'
  );
}

export const nhost = new NhostClient({
  subdomain,
  region,
  clientUrl: typeof window !== 'undefined' ? window.location.origin : undefined
});
