// frontend/src/utils/tokenStore.ts

// ✅ Access token lives in memory only — XSS safe
// Refresh token lives in httpOnly cookie — set by your Node backend
// On page refresh, /auth/refresh endpoint issues a new access token

let accessToken: string | null = null;

export const tokenStore = {
  get  : ()                    => accessToken,
  set  : (token: string)       => { accessToken = token; },
  clear: ()                    => { accessToken = null;  },
};