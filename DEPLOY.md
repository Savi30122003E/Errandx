# Deploying ErrandX for a client

1. Put this folder in a GitHub repository (the .gitignore already keeps your keys out).
2. On render.com: New > Blueprint > pick the repository. It reads render.yaml.
3. When asked, paste your GEMINI_API_KEY. Deploy.
4. Open the https address Render gives you. Check /api/health shows {"ok":true,"ai":true}.
5. On a phone, open that address in Chrome > menu > Install app.

Free plan note: the service sleeps after ~15 minutes idle and takes about a minute to wake.
Open the link a few minutes before any client meeting.
