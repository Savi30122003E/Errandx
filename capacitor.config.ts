import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Wraps the built web app (dist/) in a native Android project you open in Android Studio.
 * See ANDROID.md for the 5-minute setup.
 */
const config: CapacitorConfig = {
  appId: 'com.errandx.app',
  appName: 'ErrandX',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    // true lets the emulator call a plain-http backend (http://10.0.2.2:3000) during demos.
    // Set to false for the final release build, when your backend uses https.
    allowMixedContent: true
  }
};

export default config;
