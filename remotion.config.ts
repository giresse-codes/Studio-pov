import {Config} from '@remotion/cli/config';

// Rendu : 1080x1920, 30 fps, H.264 (réglages de chaque composition dans src/Root.tsx)
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setCrf(18);
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
// Navigateur déjà installé dans l'environnement cloud (évite un téléchargement)
Config.setBrowserExecutable(process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell');
Config.setChromiumOpenGlRenderer('swangle');
