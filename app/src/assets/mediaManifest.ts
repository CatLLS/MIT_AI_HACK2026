// ─────────────────────────────────────────────────────────────────────────────
// LAPLACE.TRANSFORM — Media Asset Manifest
//
// All media is served from Google Cloud Storage (GCS) for fast, globally
// cached streaming. Update a URL here and HMR will pick it up instantly.
//
// HOW TO ADD / UPDATE AN ASSET:
//   1. Upload the file to the GCS bucket (laplace-transform)
//   2. Copy the public URL: https://storage.googleapis.com/laplace-transform/<filename>
//   3. Paste it below — all components receive the URL automatically.
//
// CACHE HEADERS (important for smooth playback):
//   Run once after uploading new files to set long-lived cache headers:
//   gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" "gs://laplace-transform/**"
// ─────────────────────────────────────────────────────────────────────────────

// ── VIDEOS ───────────────────────────────────────────────────────────────────
export const VIDEOS = {
  // Level 0 → Level 1 transition
  TIME_DOMAIN_INTRO_PT1: "https://storage.googleapis.com/laplace-transform/introDomainPt1.mp4",
  TIME_DOMAIN_INTRO_PT2: "https://storage.googleapis.com/laplace-transform/introDomainPt2.mp4",
  TIME_DOMAIN_INTRO_PT3: "https://storage.googleapis.com/laplace-transform/IntroDomainPt3.mp4",

  // Level 1
  L1_DOT_INTRO: "https://storage.googleapis.com/laplace-transform/level0DotIntro.mp4",   // intro video before interaction
  L1_CLICK_PIXEL: "https://storage.googleapis.com/laplace-transform/videoClickOnPixel.mp4",   // plays when user clicks the orb
  L1_ENDING: "https://storage.googleapis.com/laplace-transform/dotLevelEnding.mp4",   // level 1 → level 2 transition

  // Level 2
  L2_INTRO: "https://storage.googleapis.com/laplace-transform/level2Intro.mp4",   // girl & boy clean scene
  L2_GIRL_BOY_CLEAN: "https://storage.googleapis.com/laplace-transform/girl%26boy(clean).mp4",   // looping ambience during minigame setup
  L2_GIRL_BOY_GLITCH: "https://storage.googleapis.com/laplace-transform/girl%26boyGlitch.mp4",   // loops during the poles minigame
  L2_ENDING: "https://storage.googleapis.com/laplace-transform/Level2End.mp4",   // level 2 → level 3 transition

  // Level 3
  L3_PIANO_INTRO: "https://storage.googleapis.com/laplace-transform/PianoIntro.mp4",   // piano intro before interaction
  L3_INTERACT: "https://storage.googleapis.com/laplace-transform/level3Interact.mp4",   // main interactive scene video

  // Climax
  FINALE_MONTAGE: "https://storage.googleapis.com/laplace-transform/finalMontage.mp4",   // fullscreen montage before L5/L6
} as const;

// ── AUDIO ─────────────────────────────────────────────────────────────────────
export const AUDIO = {
  // Landing
  LANDING_SONG: "https://storage.googleapis.com/laplace-transform/landingSong.mp3",   // background loop on landing page

  // Level 1
  L1_NARRATOR: "https://storage.googleapis.com/laplace-transform/4v2.wav",   // 4v2.wav — CLI narrator voice
  L1_WHISPER: "https://storage.googleapis.com/laplace-transform/iclosedmyeyesWhisper.wav",   // iclosedmyeyesWhisper.wav — ambient whisper

  // Level 2
  L2_NARRATOR: "https://storage.googleapis.com/laplace-transform/10v2.wav",   // 10v2.wav

  // Level 3
  L3_NARRATOR: "https://storage.googleapis.com/laplace-transform/13v1.wav",   // 13v1.wav

  // Climax / Level 5 audio sequence
  CLIMAX_14: "https://storage.googleapis.com/laplace-transform/14v1.wav",   // 14v1.wav
  CLIMAX_16: "https://storage.googleapis.com/laplace-transform/16v1.wav",   // 16v1.wav
  CLIMAX_17: "https://storage.googleapis.com/laplace-transform/17v1.wav",   // 17v1.wav
  CLIMAX_18: "https://storage.googleapis.com/laplace-transform/18v1.wav",   // 18v1.wav

  // Level 6 (360 world)
  CLIMAX_19: "https://storage.googleapis.com/laplace-transform/19v1.wav",   // 19v1.wav — atmospheric landing
  CLIMAX_MUSIC: "https://storage.googleapis.com/laplace-transform/spencer_yk-light-trails-151006.mp3",   // Light Trails by Spencer YK
} as const;

// ── IMAGES ────────────────────────────────────────────────────────────────────
export const IMAGES = {
  // Level 1 — constant orb images
  L1_NOSTALGIA: "https://storage.googleapis.com/laplace-transform/nostalgiaPoint.png",
  L1_LONGING: "https://storage.googleapis.com/laplace-transform/longingPoint.png",
  L1_LOGIC: "https://storage.googleapis.com/laplace-transform/logicPoint.png",
  L1_INSANITY: "https://storage.googleapis.com/laplace-transform/insanityPoint.png",

  // Level 2 — sky backgrounds (by user habit choice)
  L2_SKY_HABITS: "https://storage.googleapis.com/laplace-transform/skyHabits.png",   // "Habits"
  L2_SKY_CONNECTIONS: "https://storage.googleapis.com/laplace-transform/skyConnections.png",   // "Connections"
  L2_SKY_CONVOLUTED: "https://storage.googleapis.com/laplace-transform/skyConvoluted.png",   // "Convolution"
  L2_SKY_SOUL: "https://storage.googleapis.com/laplace-transform/skySoul.png",   // "Soul"

  // Level 3 — lens reflection portraits
  L3_GIRL_SARCASM: "https://storage.googleapis.com/laplace-transform/girlSarcasmo.png",
  L3_GIRL_LOGIC: "https://storage.googleapis.com/laplace-transform/girlLogic.png",
  L3_GIRL_VELOCITY: "https://storage.googleapis.com/laplace-transform/girlVelocity.png",
  L3_GIRL_DAMPING: "https://storage.googleapis.com/laplace-transform/girlDamping.png",

  // Climax
  PANORAMA_360: "https://storage.googleapis.com/laplace-transform/360World.png",   // 360World.png equirectangular texture
  MIT_HACK_LOGO: "https://storage.googleapis.com/laplace-transform/MITHack.webp",   // MITHack.webp — shown in credits
} as const;

// ── OTHER ─────────────────────────────────────────────────────────────────────
export const OTHER = {
  SPLAT_WORLD: "https://storage.googleapis.com/laplace-transform/3dSplatWorld.spz",   // 3dSplatWorld.spz — gaussian splat scene
  CREDITS_TXT: "https://storage.googleapis.com/laplace-transform/credits.txt",   // credits.txt — scrolling credits text
} as const;

// ── HELPER — resolves dynamic Level 1 orb image by choice name ───────────────
export function getConstantImage(constant: string): string {
  const map: Record<string, string> = {
    Nostalgia: IMAGES.L1_NOSTALGIA,
    Longing: IMAGES.L1_LONGING,
    Logic: IMAGES.L1_LOGIC,
    Insanity: IMAGES.L1_INSANITY,
  };
  return map[constant] ?? IMAGES.L1_NOSTALGIA;
}

// ── HELPER — resolves dynamic Level 2 sky image by habit name ────────────────
export function getSkyImage(habit: string): string {
  const map: Record<string, string> = {
    Habits: IMAGES.L2_SKY_HABITS,
    Connections: IMAGES.L2_SKY_CONNECTIONS,
    Convolution: IMAGES.L2_SKY_CONVOLUTED,
    Soul: IMAGES.L2_SKY_SOUL,
  };
  return map[habit] ?? IMAGES.L2_SKY_HABITS;
}

// ── HELPER — resolves dynamic Level 3 lens portrait by lens name ──────────────
export function getLensImage(lens: string): string {
  const map: Record<string, string> = {
    Sarcasm: IMAGES.L3_GIRL_SARCASM,
    Logic: IMAGES.L3_GIRL_LOGIC,
    Velocity: IMAGES.L3_GIRL_VELOCITY,
    Damping: IMAGES.L3_GIRL_DAMPING,
  };
  return map[lens] ?? IMAGES.L3_GIRL_SARCASM;
}
