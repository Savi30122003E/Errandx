// Run once after `npx cap add android`.
// Adds the permissions ErrandX needs (voice errands, photo errands) and allows the
// Android emulator to reach a backend running on your laptop (http://10.0.2.2:3000).
import fs from 'node:fs';
import path from 'node:path';

const manifestPath = path.resolve('android/app/src/main/AndroidManifest.xml');
if (!fs.existsSync(manifestPath)) {
  console.error('android/ folder not found. Run "npx cap add android" first.');
  process.exit(1);
}

let xml = fs.readFileSync(manifestPath, 'utf8');
const permissions = [
  'android.permission.INTERNET',
  'android.permission.RECORD_AUDIO',
  'android.permission.MODIFY_AUDIO_SETTINGS',
  'android.permission.CAMERA'
];

let changed = false;
for (const perm of permissions) {
  if (!xml.includes(`android:name="${perm}"`)) {
    xml = xml.replace('</manifest>', `    <uses-permission android:name="${perm}" />\n</manifest>`);
    changed = true;
  }
}

// Plain-http backend is only needed for local emulator demos; use https in production.
if (!xml.includes('usesCleartextTraffic')) {
  xml = xml.replace('<application', '<application\n        android:usesCleartextTraffic="true"');
  changed = true;
}

if (changed) {
  fs.writeFileSync(manifestPath, xml);
  console.log('AndroidManifest.xml updated.');
} else {
  console.log('AndroidManifest.xml already up to date.');
}
