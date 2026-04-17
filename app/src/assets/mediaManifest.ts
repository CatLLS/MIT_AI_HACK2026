// ─────────────────────────────────────────────────────────────────────────────
// LAPLACE.TRANSFORM — Media Asset Manifest
//
// All media is served from Vercel Blob for fast, globally cached streaming.
// Paste each Blob URL below after uploading the file. Once all links are filled
// in, the components automatically receive the updated URLs — no other changes
// needed.
//
// HOW TO USE:
//   1. Upload the file to Vercel Blob (Storage → Blob → Upload)
//   2. Copy the public URL
//   3. Replace the "INSERT_BLOB_URL_HERE" placeholder below
//   4. Save — HMR will hot-reload it instantly
// ─────────────────────────────────────────────────────────────────────────────

// ── VIDEOS ───────────────────────────────────────────────────────────────────
export const VIDEOS = {
  // Level 0 → Level 1 transition
  TIME_DOMAIN_INTRO: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/Introduction%28I%29-the-time-domain.mp4",

  // Level 1
  L1_DOT_INTRO: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level1/level0DotIntro.mp4",   // intro video before interaction
  L1_CLICK_PIXEL: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level1/videoClickOnPixel.mp4",   // plays when user clicks the orb
  L1_ENDING: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level1/dotLevelEnding.mp4",   // level 1 → level 2 transition

  // Level 2
  L2_INTRO: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level2/level2Intro.mp4",   // girl & boy clean scene
  L2_GIRL_BOY_CLEAN: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level2/girl%26boy%28clean%29.mp4",   // looping ambience during minigame setup
  L2_GIRL_BOY_GLITCH: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level2/girl%26boyGlitch.mp4",   // loops during the poles minigame
  L2_ENDING: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level2/Level2End.mp4",   // level 2 → level 3 transition

  // Level 3
  L3_PIANO_INTRO: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level3/PianoIntro.mp4",   // piano intro before interaction
  L3_INTERACT: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level3/level3Interact.mp4",   // main interactive scene video

  // Climax
  FINALE_MONTAGE: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/climax/finalMontage.mp4",   // fullscreen montage before L5/L6
} as const;

// ── AUDIO ─────────────────────────────────────────────────────────────────────
export const AUDIO = {
  // Landing
  LANDING_SONG: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/landingSong.mp3",   // background loop on landing page

  // Level 1
  L1_NARRATOR: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level1/4v2.wav",   // 4v2.wav — CLI narrator voice
  L1_WHISPER: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level1/iclosedmyeyesWhisper.wav",   // iclosedmyeyesWhisper.wav — ambient whisper

  // Level 2
  L2_NARRATOR: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level2/10v2.wav",   // 10v2.wav

  // Level 3
  L3_NARRATOR: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level3/13v1.wav",   // 13v1.wav

  // Climax / Level 5 audio sequence
  CLIMAX_14: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/climax/14v1.wav",   // 14v1.wav
  CLIMAX_16: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/climax/16v1.wav",   // 16v1.wav
  CLIMAX_17: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/climax/17v1.wav",   // 17v1.wav
  CLIMAX_18: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/climax/18v1.wav",   // 18v1.wav

  // Level 6 (360 world)
  CLIMAX_19: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/19v1.wav",   // 19v1.wav — atmospheric landing
  CLIMAX_MUSIC: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/spencer_yk-light-trails-151006.mp3",   // Light Trails by Spencer YK
} as const;

// ── IMAGES ────────────────────────────────────────────────────────────────────
export const IMAGES = {
  // Level 1 — constant orb images
  L1_NOSTALGIA: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level1/nostalgiaPoint.png",
  L1_LONGING: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level1/longingPoint.png",
  L1_LOGIC: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level1/logicPoint.png",
  L1_INSANITY: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level1/insanityPoint.png",

  // Level 2 — sky backgrounds (by user habit choice)
  L2_SKY_HABITS: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level2/skyHabits.png",   // "Habits"
  L2_SKY_CONNECTIONS: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level2/skyConnections.png",   // "Connections"
  L2_SKY_CONVOLUTED: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level2/skyConvoluted.png",   // "Convolution"
  L2_SKY_SOUL: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level2/skySoul.png",   // "Soul"

  // Level 3 — lens reflection portraits
  L3_GIRL_SARCASM: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level3/girlSarcasmo.png",
  L3_GIRL_LOGIC: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level3/girlLogic.png",
  L3_GIRL_VELOCITY: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level3/girlVelocity.png",
  L3_GIRL_DAMPING: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/level3/girlDamping.png",

  // Climax
  PANORAMA_360: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/climax/360World.png",   // 360World.png equirectangular texture
  MIT_HACK_LOGO: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/MITHack.webp",   // MITHack.webp — shown in credits
} as const;

// ── OTHER ─────────────────────────────────────────────────────────────────────
export const OTHER = {
  SPLAT_WORLD: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/climax/3dSplatWorld.spz",   // 3dSplatWorld.spz — gaussian splat scene
  CREDITS_TXT: "https://iczrxx4i9tzizbpp.public.blob.vercel-storage.com/preloads/credits.txt",   // credits.txt — scrolling credits text
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
