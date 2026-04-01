### **Project Specification: LAPLACE.TRANSFORM**

**Core Concept:** A browser-based interactive film where a narrative about emotional trauma is mapped to the mathematics of control theory. The user’s inputs directly alter the "Poles and Zeros" of a Laplace equation, dictating the physical stability of the website’s UI and the final 360-degree environment.

---

### **1. Visual Identity & UI (The "Altar of Code")**
* **Aesthetic:** "Digital Core" / Y2K / 1999 High-end Workstation.
* **Palette:** Deep Midnight Purple (#120024), Ultraviolet (#9D00FF), Neon White.
* **Interface:** A centralized CLI (Command Line Interface). 
    * **Features:** Blinking cursor, typing simulation, ASCII art headers, and a persistent "Live Formula" UI rendered via **KaTeX** or **MathJax**.
    * **Reactivity:** The CLI letters must "tremble" or "glitch" (CSS `skew` and `filter: blur`) as the system stability decreases.

---

### **2. The Mathematical Stability Engine (The Source of Truth)**
The application state is driven by an **s-plane Coordinate System** ($s = \sigma + j\omega$).
* **The Pole ($X$):** A JavaScript object tracking a coordinate on a 2D grid.
* **Stability Index (Real Part $\sigma$):** * **If $\sigma < 0$ (Stable):** UI is crisp. Transitions are smooth.
    * **If $\sigma > 0$ (Unstable):** The website physically "breaks." Trigger CSS `shake` animations, random `div` rotations, and chromatic aberration.
* **Resonance (Imaginary Part $j\omega$):** Controls the frequency of visual pulses and the pitch of the background bitcrushed audio.
* **Logic:** Every user input (e.g., "Bread", "Sarcasm") maps to a specific coordinate change, moving the "X" on the hidden s-plane.

---

### **3. The "Director" LLM & AI Pipeline**
A background process that synthesizes narrative continuity across multiple APIs.
* **Inputs:** `Input_1` (Constant), `Input_2` (Memory), `Input_3` (Filter/Lens).
* **The Synthesis Script:** Use an LLM (GPT-4o or similar) to ingest all three inputs and output:
    1.  **A 360-Image Prompt:** For the final environment (e.g., "A purple desert of giant floating loaves under a violet rainstorm").
    2.  **Object Prompts:** 3 separate prompts for transparent 2D "Billboards" (Sprites) to be placed in the 3D scene.
* **API Execution:** Call **Replicate (Flux/SDXL-Panorama)** for the 360 skybox and **Flux (Standard)** for the 2D sprites.

---

### **4. Level Specifications (The Sequence)**
* **Level 1 (The Dot):** 2.5D Parallax. User enters a "Constant." Render an ASCII girl standing next to a 2D image of the input.
* **Level 2 (The Linear):** Luma-rendered video loop background. Introduce a "Damping Slider." Moving the slider must live-update the Real Part ($\sigma$) of the system pole, visually stabilizing or destabilizing the background video.
* **Level 3 (The Quadratic):** 2D melting piano scene. Audio engine plays bitcrushed whispers of the user's previous inputs. User chooses a "Lens" (Sarcasm/Logic). This choice triggers an **ElevenLabs** API call to change the Narrator’s voice clone tone for the remainder of the experience.

---

### **5. The Climax: 360 Render & Inverse Transform**
* **The Transition:** Triggered by `y/n` prompt. Use a GSAP-driven particle burst where CLI text "shatters" to reveal the 3D space.
* **360 Environment:** * **Sphere:** A `THREE.SphereGeometry` with the AI-generated equirectangular texture mapped to the `BackSide`.
    * **Volumetric Sprites:** Place the AI-generated 2D transparent objects (from the Director's prompt) as `THREE.Sprite` at varying depths ($z$) to create parallax when the user pans the camera.
    * **The Liquid Mirror:** A central, reflective `THREE.Mesh` (Silver Sphere). It uses a `CubeCamera` to reflect the 360-environment in real-time.
* **The Ending:** As the user looks into the liquid mirror, the final text `IT WAS ME` is injected into the DOM with a 1-bit dithered transparency effect.

---

### **6. Technical Constraints for Antigravity**
* **State Management:** Use **Zustand** to ensure the Math Engine's `stabilityIndex` is globally accessible by the Audio, CSS, and Three.js components.
* **Performance:** All AI generations (Skybox/Sprites) must be triggered **asynchronously** during Level 2 so they are cached and ready for the Level 4 transition.
* **Audio:** Implement a **Web Audio API** chain with a `BiquadFilterNode` and a `ConvolverNode` to simulate "system noise" that scales with the `stabilityIndex`.
