import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Detect if we're in development mode
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';

// Create a client with authentication based on environment
export const base44 = createClient({
  appId: "687fdd14b5d2931aa1e98b0f", 
  requiresAuth: !isDevelopment // Disable auth in development to prevent callback domain errors
});
