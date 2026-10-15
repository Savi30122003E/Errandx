/**
 * Where the ErrandX backend lives.
 *
 * - Browser / AI Studio / `npm run dev`: leave VITE_API_BASE_URL empty, the app
 *   calls the same server that served the page (relative /api/... URLs).
 * - Android app (Capacitor / Android Studio): the web files are bundled inside the
 *   APK, so there is no "same server". Set VITE_API_BASE_URL to your deployed
 *   backend before building, e.g. https://errandx-api.example.com
 *   (for the Android emulator talking to your laptop use http://10.0.2.2:3000).
 */
const rawBase: string = import.meta.env?.VITE_API_BASE_URL || '';

export const API_BASE_URL = rawBase.replace(/\/+$/, '');

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
