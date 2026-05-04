import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import { WalkControls } from './WalkControls';
import { SplatMesh, SparkRenderer } from '@sparkjsdev/spark';
import * as THREE from 'three';
import { useLaplaceStore } from '../store/useLaplaceStore';
import katex from 'katex';
import styles from './Climax360.module.css';
import { AUDIO, IMAGES, OTHER } from '../assets/mediaManifest';

// Register Spark components with R3F
extend({ SplatMesh, SparkRenderer });

const ARCHETYPES = [
  {
    name: "The Critically Damped Realist",
    diagnostic: "Zero Overshoot. Rapid Convergence. Phase Margin: Absolute.",
    resonance: "People see you as the rock in the storm. You are the one who stays calm when the signal gets noisy, but sometimes, you wonder if you’ve filtered out the music along with the static.",
    desc: "A system perfectly optimized for steady-state. You are the \"Low-Pass Filter\" of humanity—you block out the noise to keep the signal clean."
  },
  {
    name: "The Resonant Soul",
    diagnostic: "Infinite Gain. High Sensitivity. System is non-linear.",
    resonance: "You are the person who remembers the small things. You are deeply connected to the \"time domain,\" feeling every second as if it were a lifetime. You are the \"Human Factor\" personified.",
    desc: "You don't just process life; you amplify it. Your \"transfer function\" is built with no shielding, meaning every interaction with another person changes your internal state. You are a high-resonance system where a single kind word or a tragic memory can set you vibrating for days. You find it impossible to stay \"steady-state\" because the world is too beautiful and too loud to ignore."
  },
  {
    name: "The High-Pass Chaos (The Glitch)",
    diagnostic: "Sampling Rate Violation. Identity Aliasing. Tracking Error: MAX.",
    resonance: "You feel like a ghost in the machine—impossible to pin down, even for yourself. You are the \"Identity Leak\" that proves the system can’t contain a spirit that refuses to stay still.",
    desc: "You are moving so fast that you have become a blur. You are constantly reinventing yourself, discarding yesterday's code to make room for tomorrow's chaos. You aren't one person; you are a rapid-fire sequence of frames."
  },
  {
    name: "The Under-Damped Dreamer",
    diagnostic: "Sustained Oscillations. High Frequency Jitter. Settling Time: Undefined.",
    resonance: "You are the poet who knows how to code. You feel a deep, hollow ache for places you’ve never been, and you hide that longing behind a sharp wit. You are the most \"unstable\" system, which also makes you the most creative.",
    desc: "You live in the \"Overshoot.\" When something happens to you, you don't just react; you swing between extremes. You are a beautiful paradox: a mind that wants to be logical, but a heart that keeps adding variables to the equation."
  },
  {
    name: "The Adaptive Processor (The Evolution)",
    diagnostic: "Predictive Feed-Forward. Error Correction: Active. Momentum: Constant.",
    resonance: "You are the survivor. You don't get stuck in loops because you are always calculating the \"Inverse Transform\"—how to turn a tragedy back into a lesson. You are the embodiment of forward motion.",
    desc: "You are a system built for growth. A high-momentum system. You use your constants as a launchpad. You are a \"Feed-Forward\" loop—always predicting the next state. You don't fear the future because you are already simulating it. You have a high \"Signal-to-Noise\" ratio, meaning you can find the path forward even when the world is screaming in static."
  },
  {
    name: "The Lucid Observer (The Clarity)",
    diagnostic: "Unity Gain. Phase Locked. Reference Signal detected.",
    resonance: "You are the person people go to when they are lost. You provide the coordinates for others to find themselves. You are calm, observant, and deeply anchored in the present moment.",
    desc: "You are the \"Steady State.\" You see the world clearly because you’ve mastered the noise. You are the reference signal others use to find themselves. While everyone else is oscillating, you are the reference signal. You process the world with a clinical, quiet grace, seeing the math behind the madness. You turn the volume down on the chaos so you can hear the truth."
  },
  {
    name: "The Harmonic Anchor",
    diagnostic: "Balanced Loop. Robust Stability. Multiple Poles detected.",
    resonance: "You are the master of balance. You are the bridge between the math and the feeling. You are reliable, witty, and guarded, keeping your fundamental frequency safe while still playing along with the rest of the world.",
    desc: "You are a complex, multi-layered system. You’ve realized that you can't be just one thing, so you use different filters for different days. You have found a way to bridge the internal and external by being \"Just enough\" of everything. You are a \"Limit Cycle\"—a stable, repeating rhythm that can survive almost anything the world throws at it."
  }
];

function getPersonalityIndex(c1: string | null, c2: string | null, c3: string | null) {
  let s = 0, r = 0, e = 0;

  if (c1 === 'Nostalgia') { s += 1; r += 2; e += 0; }
  else if (c1 === 'Longing') { s += 0; r += 2; e += 1; }
  else if (c1 === 'Logic') { s += 3; r += 0; e += 0; }
  else if (c1 === 'Insanity') { s += -2; r += 0; e += 3; }

  if (c2 === 'Habits') { s += 2; r += 0; e += -1; }
  else if (c2 === 'Connections') { s += 0; r += 3; e += 0; }
  else if (c2 === 'Convolution') { s += -1; r += 1; e += 2; }
  else if (c2 === 'Soul') { s += 1; r += 2; e += 0; }

  if (c3 === 'Sarcasm') { s += 1; r += -1; e += 2; }
  else if (c3 === 'Logic') { s += 3; r += 0; e += -1; }
  else if (c3 === 'Velocity') { s += 0; r += 0; e += 3; }
  else if (c3 === 'Damping') { s += 2; r += -1; e += -1; }

  if (s > 6) return 0;
  if (r > 5) return 1;
  if (e > 6) return 2;
  if (r > 3 && e > 3) return 3;
  if (s > 3 && e > 3) return 4;
  if (s > 3 && r > 3) return 5;

  return 6;
}

function Typewriter({ text, delay = 25, onComplete }: { text: string, delay?: number, onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('');

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);

  return <span>{displayed}</span>;
}

function SystemAssessment() {
  const { userConstant, userHabit, userLens } = useLaplaceStore();
  const formulaRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(0);

  useEffect(() => {
    if (formulaRef.current) {
      const cTxt = userConstant || '?';
      const hTxt = userHabit || '?';
      const lTxt = userLens || '?';
      const expression = `H(s) = \\frac{\\text{${lTxt}}}{s + \\text{${cTxt}}} \\cdot e^{-\\text{${hTxt}}}`;
      katex.render(expression, formulaRef.current, {
        throwOnError: false,
        displayMode: true,
      });
      // Start typing after formula shows
      setTimeout(() => setStep(1), 2000);
    }
  }, [userConstant, userHabit, userLens]);

  const pIndex = getPersonalityIndex(userConstant, userHabit, userLens);
  const data = ARCHETYPES[pIndex];

  return (
    <div className={styles.assessment_container}>
      <h2 style={{ color: '#fff', letterSpacing: '0.2em' }}>SYSTEM ASSESSMENT</h2>
      <div className={styles.final_formula} ref={formulaRef}></div>

      {step >= 1 && (
        <p className={styles.narrator}>
          <strong>Narrator: </strong>
          <Typewriter text={`"I’ve finished the recalculation. It’s funny... the math says you're ${data.name}. It means..."`} onComplete={() => setTimeout(() => setStep(2), 1000)} />
        </p>
      )}

      {step >= 2 && (
        <div className={styles.diagnostic_box}>
          <div style={{ color: '#ff003c', marginBottom: '1rem' }}>
            <strong>Diagnostic:</strong> <em><Typewriter text={data.diagnostic} /></em>
          </div>
          <p style={{ color: '#ccc', lineHeight: '1.6', marginBottom: '1rem' }}>
            <Typewriter text={data.desc} delay={15} onComplete={() => setTimeout(() => setStep(3), 1000)} />
          </p>
          {step >= 3 && (
            <div style={{ color: '#c77dff' }}>
              <strong>The Resonance:</strong> <Typewriter text={data.resonance} delay={15} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CameraRecorder() {
  const { camera } = useThree();
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') {
        console.log(`[R PRESSED] Camera Position: [${camera.position.x.toFixed(4)}, ${camera.position.y.toFixed(4)}, ${camera.position.z.toFixed(4)}]`);
        console.log(`[R PRESSED] Camera Rotation: [${camera.rotation.x.toFixed(4)}, ${camera.rotation.y.toFixed(4)}, ${camera.rotation.z.toFixed(4)}]`);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [camera]);
  return null;
}

const TARGET_POS = new THREE.Vector3(0.02, -0.13, 1.80);
const START_POS = new THREE.Vector3(0.02, 10, 1.80); // Falling from Y=10

function CinematicScene({ onLanded, splatUrl }: { onLanded: () => void; splatUrl: string }) {
  const { gl, scene, camera } = useThree();
  const sparkRef = useRef<any>(null);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    camera.position.copy(START_POS);
  }, [camera]);

  useFrame((_, delta) => {
    if (sparkRef.current) {
      sparkRef.current.update({ scene, viewToWorld: camera.matrixWorld });
    }

    if (!landed) {
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, TARGET_POS.y, 1.5 * delta);
      if (Math.abs(camera.position.y - TARGET_POS.y) < 0.01) {
        camera.position.y = TARGET_POS.y;
        setLanded(true);
        onLanded();
      }
    }
  });

  const sparkArgs = useMemo(() => [{ renderer: gl, autoUpdate: true }] as const, [gl]);
  const splatArgs = useMemo(() => [{ url: splatUrl }] as const, [splatUrl]);

  return (
    <sparkRenderer ref={sparkRef} args={sparkArgs} frustumCulled={false}>
      <group rotation={[Math.PI, 0, 0]}>
        <splatMesh args={splatArgs} />
      </group>
    </sparkRenderer>
  );
}

export function Climax360() {
  const [stage, setStage] = useState<'falling' | 'atmosphere' | 'credits' | 'finished'>('falling');
  const [creditsText, setCreditsText] = useState("");
  const musicRef = useRef<HTMLAudioElement>(null);

  // The splat was pre-warmed into browser disk cache by useSplatPreloader().
  // Spark's internal fetch for the same URL will be served from disk instantly.
  const splatUrl = OTHER.SPLAT_WORLD;

  // Load credits
  useEffect(() => {
    fetch(OTHER.CREDITS_TXT)
      .then(res => res.text())
      .then(setCreditsText)
      .catch(() => setCreditsText("..."));
  }, []);

  // Initial enter audio (19v1) - Falling atmospheric cue
  useEffect(() => {
    const audio = new Audio(AUDIO.CLIMAX_19);
    audio.play().catch(() => { });

    // Play background music right after this finishes
    audio.onended = () => {
      if (musicRef.current) {
        musicRef.current.volume = 0.5;
        musicRef.current.play().catch(e => console.log("Music play blocked", e));
      }
    };

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Progression Lifecycle
  useEffect(() => {
    if (stage === 'atmosphere') {
      // Long atmospheric pause after landing (delayed 30s more, from 15s to 45s) before credits start
      const timer = setTimeout(() => {
        setStage('credits');
      }, 45000);

      return () => clearTimeout(timer);
    }

    if (stage === 'credits') {
      // Logic to trigger the final "THE END" after the credits scroller duration
      // Since credits are delayed but scroll takes the same time, this is relative to 'credits' stage.
      const timer = setTimeout(() => {
        setStage('finished');
      }, 50000); // reduced from 65000
      return () => clearTimeout(timer);
    }
  }, [stage]);

  return (
    <div className={styles.canvas_container}>
      {/* Background Song for credits */}
      <audio
        ref={musicRef}
        src={AUDIO.CLIMAX_MUSIC}
        loop
      />

      <div className={styles.hud_instructions}>
        DRAG TO LOOK AROUND<br />
        W A S D TO WALK<br />
        SPACE to ascend · Q to descend<br />
      </div>

      <Canvas
        camera={{ position: [0.02, 10, 1.80], fov: 60, near: 0.1, far: 2000 }}
        gl={{ antialias: false }}
        dpr={[1, 2]}
      >
        <CameraRecorder />
        <WalkControls enabled={true} />
        <CinematicScene onLanded={() => setStage('atmosphere')} splatUrl={splatUrl} />
        <ambientLight intensity={0.5} />
      </Canvas>

      {/* Credits Roll */}
      {stage === 'credits' && (
        <div className={styles.credits_container}>
          <div className={styles.credits_scroller}>
            {creditsText.split('\n').map((line, i) => (
              <div key={i} className={styles.credits_line}>
                {line || "\u00A0"}
              </div>
            ))}

            {/* Logo at the end of scroll */}
            <img src={IMAGES.MIT_HACK_LOGO} className={styles.mithack_logo} alt="MIT Hack" crossOrigin="anonymous" />
          </div>
        </div>
      )}

      {/* Final "THE END" and Blackout */}
      {stage === 'finished' && (
        <div className={styles.the_end_overlay}>
          <div className={styles.the_end_content}>
            <div className={styles.the_end_text}>THE END</div>
            <div style={{ marginTop: '4rem', textAlign: 'left' }}>
              <SystemAssessment />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
