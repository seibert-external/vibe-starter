export function attachTzCookie() {
  if (typeof window === "undefined") {
    return;
  }
  document.cookie = `tz=${Intl.DateTimeFormat().resolvedOptions().timeZone}; SameSite=None; Secure; Max-Age=31536000`;
}
