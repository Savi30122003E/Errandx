# ErrandX on Android Studio

The app is wrapped with Capacitor: Android Studio opens a real native project that
shows your built web app, so every screen looks exactly as it does in the browser.

## One-time setup
1. Install Node.js 20+ and Android Studio (with an emulator or a USB phone).
2. In this folder: `npm install`
3. Create `.env.local` with `GEMINI_API_KEY=your_key`
4. Start the backend: `npm run dev` (keeps running, port 3000)
5. Create `.env.production` with the backend address the APP should call:
   - Android emulator + backend on your laptop: `VITE_API_BASE_URL=http://10.0.2.2:3000`
   - Real phone / client demo: deploy the server (Cloud Run, Render, Railway...) and use its https URL
6. `npm run build && npm run android:setup`  (creates the `android/` project and adds mic/camera permissions)

## Every time you change the code
`npm run android:sync` then `npm run android:open`, and press Run in Android Studio.

## Notes
- Voice errands: the Android WebView has no browser speech engine, so the app records a
  short clip and the server transcribes it with Gemini (needs the backend + API key).
- The AI features, payments (simulated) and orders (demo data) are the same as the web version.
- For a signed APK/AAB: Android Studio > Build > Generate Signed Bundle / APK.
