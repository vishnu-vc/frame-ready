FRAME READY — NETLIFY HTML VERSION
Developer: vc_vishnu
Instagram: https://www.instagram.com/vc_vishnu/

DEPLOY
1. Extract this ZIP.
2. Visit https://app.netlify.com/drop and sign in to your Netlify account.
3. Drag the entire frame-ready-netlify folder onto the deployment area.
   Choose the folder that directly contains index.html.
4. Wait for deployment and open the HTTPS address Netlify provides.

Upload the entire folder, including engine/, app.js, worker.js, and style.css.
No npm install, build command, backend, API key, or environment variable is needed.
For repository-based deployment, set the publish directory to the folder containing index.html
and leave the build command empty. The included netlify.toml uses the repository root.
Netlify documentation: https://docs.netlify.com/deploy/create-deploys/

USE
Choose WhatsApp Status or Instagram Reel, select a video, choose fit or fill,
and click Convert video. Download the resulting MP4 file(s).
Videos are processed locally by the browser and are not sent to a server.
The engine downloads about 31 MB on first conversion; allow time for it to load.
Use desktop Chrome or Edge for best compatibility and keep the tab open.
Maximum source size: 250 MB. Maximum duration: 30 minutes.
WhatsApp exports numbered 30- or 60-second clips; choose 60 seconds only if supported
by your Status editor. Instagram exports the full video; account limits vary.
HDR sources require conversion to SDR in your phone/editor first.
Platforms may recompress uploads; this app cannot guarantee identical upload quality.

LOCAL PREVIEW (OPTIONAL)
Do not open index.html directly with file://; browsers restrict workers and file loading.
If Python is installed, open a terminal in this folder and run:
  python -m http.server 8000
Then visit http://localhost:8000 . Stop the server with Ctrl+C.

CREDITS
The conversion engine and its notices are included in engine/.
The visible developer credit links to the Instagram address above.
