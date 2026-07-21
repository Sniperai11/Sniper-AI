export const SECURITY_CONFIG = {
  REQUIRED_HEADERS: [
    "content-security-policy",
    "strict-transport-security",
    "x-frame-options",
    "x-content-type-options"
  ],
  HEADER_RECOMMENDATIONS: {
    "content-security-policy": "Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.google.com;",
    "strict-transport-security": "Strict-Transport-Security \"max-age=31536000; includeSubDomains; preload\"",
    "x-frame-options": "X-Frame-Options: SAMEORIGIN",
    "x-content-type-options": "X-Content-Type-Options: nosniff"
  }
};
