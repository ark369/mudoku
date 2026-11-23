let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  freq: number,
  durationSec: number,
  type: OscillatorType = 'sine',
  gainPeak = 0.06,
  delaySec = 0
): void {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const now = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + durationSec + 0.02);
  } catch {
    // Ignore audio errors on restricted devices
  }
}

export function playPlaceSound(enabled: boolean): void {
  if (!enabled) return;
  // Tactile wooden-enamel token knock
  playTone(195, 0.038, 'triangle', 0.075, 0);
  playTone(465, 0.075, 'triangle', 0.05, 0.018);
}

export function playCrossSound(enabled: boolean): void {
  if (!enabled) return;
  // Crisp graphite stroke whisper
  playTone(290, 0.045, 'triangle', 0.036, 0);
}

export function playNoteSound(enabled: boolean): void {
  if (!enabled) return;
  playTone(620, 0.045, 'sine', 0.032, 0);
}

export function playUndoSound(enabled: boolean): void {
  if (!enabled) return;
  playTone(400, 0.055, 'sine', 0.038, 0);
  playTone(320, 0.065, 'sine', 0.038, 0.028);
}

export function playWarningSound(enabled: boolean): void {
  if (!enabled) return;
  playTone(230, 0.14, 'triangle', 0.055, 0);
  playTone(190, 0.16, 'triangle', 0.048, 0.085);
}

export function playVictorySound(enabled: boolean): void {
  if (!enabled) return;
  // Soft rubber-stamp thud followed by warm mystery chord
  playTone(115, 0.09, 'triangle', 0.08, 0);
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((f, i) => playTone(f, 0.25, 'triangle', 0.065, 0.07 + i * 0.085));
}
