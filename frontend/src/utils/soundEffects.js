import confetti from "canvas-confetti";

let audioCtx = null;
let lastPopTime = 0;

function getAudioContext() {
    if (typeof window === "undefined") return null;
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    return audioCtx;
}

export function isSoundEnabled() {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("sound_effects_enabled") !== "false";
}

export function setSoundEnabled(enabled) {
    if (typeof window === "undefined") return;
    localStorage.setItem("sound_effects_enabled", enabled ? "true" : "false");
}

/**
 * Cash register / coin drop chime on successful sale registration
 */
export function playSaleSuccessSound() {
    if (!isSoundEnabled()) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;

        // Note 1: High crisp chime
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(987.77, now); // B5
        osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08); // E6
        gain1.gain.setValueAtTime(0.18, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.35);

        // Note 2: Secondary overtone / bell sparkle (offset by 60ms)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(1567.98, now + 0.06); // G6
        osc2.frequency.exponentialRampToValueAtTime(2093.0, now + 0.14); // C7
        gain2.gain.setValueAtTime(0.12, now + 0.06);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.06);
        osc2.stop(now + 0.45);
    } catch (e) {
        // Silently fail if AudioContext is blocked by browser policy
    }
}

/**
 * Celebratory triumphant fanfare chord for Cierre del Día
 */
export function playFanfareSound() {
    if (!isSoundEnabled()) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        // Triumphant arpeggio: C5 -> E5 -> G5 -> C6
        const notes = [
            { freq: 523.25, time: 0, dur: 0.18 },
            { freq: 659.25, time: 0.1, dur: 0.18 },
            { freq: 783.99, time: 0.2, dur: 0.22 },
            { freq: 1046.5, time: 0.32, dur: 0.65 },
        ];

        notes.forEach(({ freq, time, dur }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, now + time);
            gain.gain.setValueAtTime(0.15, now + time);
            gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + time);
            osc.stop(now + time + dur);
        });
    } catch (e) {}
}

/**
 * Soft tactile bubble pop for bouncy buttons, chips, and navigation
 */
export function playPopSound() {
    if (!isSoundEnabled()) return;
    try {
        const nowMs = Date.now();
        if (nowMs - lastPopTime < 45) return; // Debounce rapid multi-triggers
        lastPopTime = nowMs;

        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Subtle random pitch variation (+-25Hz) for organic, musical feel
        const pitchJitter = (Math.random() - 0.5) * 50;
        const startFreq = 480 + pitchJitter;
        const endFreq = 160 + pitchJitter * 0.4;

        osc.type = "sine";
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.055);

        gain.gain.setValueAtTime(0.10, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.055);
    } catch (e) {}
}

/**
 * Double cannon celebratory confetti burst
 */
export function triggerConfetti() {
    try {
        // Left cannon
        confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors: ["#477da6", "#638d73", "#b48648", "#ad5570", "#f59e0b"],
            disableForReducedMotion: true,
        });

        // Right cannon
        confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors: ["#477da6", "#638d73", "#b48648", "#ad5570", "#f59e0b"],
            disableForReducedMotion: true,
        });
    } catch (e) {}
}

/**
 * Attaches a lightweight global pointer listener so all bouncy buttons & tabs pop automatically!
 */
export function initGlobalSoundListeners() {
    if (typeof window === "undefined") return;

    function handlePointerDown(e) {
        if (!isSoundEnabled()) return;

        const interactiveEl = e.target.closest(
            "button, a, .active-press, [role='button'], input[type='radio'], input[type='checkbox']"
        );

        if (interactiveEl && !interactiveEl.closest(".no-sfx")) {
            playPopSound();
        }
    }

    document.addEventListener("pointerdown", handlePointerDown, { passive: true });
}
