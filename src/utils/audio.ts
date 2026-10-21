/**
 * Native Web Audio Spatial Museum Room-Tone & Generative Soundscape Synthesizer
 * Generates continuous warm binaural gallery acoustic resonance, Brian Eno-inspired
 * slow generative modal harmonics, and tactile inspection chimes without external audio files.
 */

// A-Dorian / Minor-9 contemplative pitch palette (Hz)
const GALLERY_HARMONIC_PALETTE = [
  164.81, // E3
  220.00, // A3
  246.94, // B3
  261.63, // C4
  329.63, // E4
  392.00, // G4
  440.00, // A4
  493.88, // B4
  523.25, // C5
  659.25  // E5
];

class MuseumAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private roomFilter: BiquadFilterNode | null = null;
  private droneChordOsc: OscillatorNode | null = null;
  private isPlaying: boolean = false;
  private generativeTimer: number | null = null;

  private init() {
    if (this.ctx) return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Room-aware Lowpass Filter (shifts acoustic brightness across halls)
    this.roomFilter = this.ctx.createBiquadFilter();
    this.roomFilter.type = 'lowpass';
    this.roomFilter.frequency.setValueAtTime(520, this.ctx.currentTime);
    this.roomFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);
    this.roomFilter.connect(this.masterGain);

    // 1. Deep Room Resonance (Subtle 55Hz A1 Fundamental)
    const osc1 = this.ctx.createOscillator();
    const oscGain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, this.ctx.currentTime);
    oscGain1.gain.setValueAtTime(0.038, this.ctx.currentTime);
    osc1.connect(oscGain1);
    oscGain1.connect(this.roomFilter);
    osc1.start();

    // 2. Warm Fifth Harmonic Overtone (110Hz + slow detuned 164.81Hz E3)
    const osc2 = this.ctx.createOscillator();
    const oscGain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(110, this.ctx.currentTime);
    oscGain2.gain.setValueAtTime(0.018, this.ctx.currentTime);
    osc2.connect(oscGain2);
    oscGain2.connect(this.roomFilter);
    osc2.start();

    this.droneChordOsc = this.ctx.createOscillator();
    const chordGain = this.ctx.createGain();
    this.droneChordOsc.type = 'triangle';
    this.droneChordOsc.frequency.setValueAtTime(164.81, this.ctx.currentTime);
    chordGain.gain.setValueAtTime(0.008, this.ctx.currentTime);
    this.droneChordOsc.connect(chordGain);
    chordGain.connect(this.roomFilter);
    this.droneChordOsc.start();

    // 3. Pink Air Acoustic Resonance (Diffused Gallery Air Filter)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.032;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(185, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.045, this.ctx.currentTime);

    whiteNoise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(this.roomFilter);
    whiteNoise.start();
  }

  /**
   * Triggers a single slow, glass-like ambient harmonic interval
   */
  private triggerGenerativeNote() {
    if (!this.ctx || !this.roomFilter || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    const freq =
      GALLERY_HARMONIC_PALETTE[Math.floor(Math.random() * GALLERY_HARMONIC_PALETTE.length)];

    const osc = this.ctx.createOscillator();
    const overtone = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const panNode = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2, now);

    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.15, now);

    // Slow Eno-style envelope: 2.2s fade-in, 5.5s resonant decay
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.018, now + 2.2);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 7.8);

    osc.connect(noteGain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(noteGain);

    if (panNode) {
      panNode.pan.setValueAtTime((Math.random() - 0.5) * 0.65, now);
      noteGain.connect(panNode);
      panNode.connect(this.roomFilter);
    } else {
      noteGain.connect(this.roomFilter);
    }

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 8.0);
    overtone.stop(now + 8.0);
  }

  private scheduleNextGenerativeNote() {
    if (this.generativeTimer) {
      window.clearTimeout(this.generativeTimer);
      this.generativeTimer = null;
    }
    if (!this.isPlaying) return;

    this.triggerGenerativeNote();
    const nextDelayMs = 4800 + Math.random() * 3800;
    this.generativeTimer = window.setTimeout(() => {
      this.scheduleNextGenerativeNote();
    }, nextDelayMs);
  }

  /**
   * Modulates room acoustic warmth and harmonic root as visitor moves between rooms
   */
  public setRoomZone(scrollProgress: number) {
    if (!this.ctx || !this.roomFilter || !this.droneChordOsc || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    // Rotunda (0.22–0.42) & Visions (0.42–0.62) have high vaulted ceilings -> brighter acoustic filter
    // Drawing Studio (0.62–0.78) has warm timber/cork -> intimate, damped acoustic filter
    let targetCutoff = 520;
    let targetHarmonic = 164.81; // E3

    if (scrollProgress >= 0.22 && scrollProgress < 0.42) {
      targetCutoff = 920; // Vaulted Rotunda dome
      targetHarmonic = 196.00; // G3
    } else if (scrollProgress >= 0.42 && scrollProgress < 0.62) {
      targetCutoff = 760; // Pavilion II
      targetHarmonic = 164.81; // E3
    } else if (scrollProgress >= 0.62 && scrollProgress < 0.78) {
      targetCutoff = 410; // Intimate Drawing Studio
      targetHarmonic = 146.83; // D3
    } else if (scrollProgress >= 0.78) {
      targetCutoff = 580; // Study Archive & Lounge
      targetHarmonic = 130.81; // C3
    }

    this.roomFilter.frequency.setTargetAtTime(targetCutoff, now, 1.2);
    this.droneChordOsc.frequency.setTargetAtTime(targetHarmonic, now, 1.8);
  }

  /**
   * Subtle tactile felt-harmonic chime when focusing or stepping between artworks
   */
  public playInspectCue(direction: 'open' | 'step' | 'close' = 'open') {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    const baseFreq =
      direction === 'open' ? 523.25 : direction === 'step' ? 587.33 : 392.00;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.004, now + 0.45);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.024, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.15);
  }

  public toggle(): boolean {
    if (!this.ctx) {
      this.init();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.masterGain?.gain.setTargetAtTime(0.0001, this.ctx!.currentTime, 0.4);
      this.isPlaying = false;
      if (this.generativeTimer) {
        window.clearTimeout(this.generativeTimer);
        this.generativeTimer = null;
      }
    } else {
      this.masterGain?.gain.setTargetAtTime(0.22, this.ctx!.currentTime, 0.6);
      this.isPlaying = true;
      this.scheduleNextGenerativeNote();
    }

    return this.isPlaying;
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const museumAudio = new MuseumAudioEngine();
