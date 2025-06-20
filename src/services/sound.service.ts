/* eslint-disable no-console */
class SoundService {
  private audioContext: AudioContext | null = null;
  private lastPlayTime = 0;
  private readonly MIN_INTERVAL = 1000;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (!this.isInitialized) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

        this.audioContext = new AudioContext();

        if (this.audioContext.state === "suspended") {
          await this.audioContext.resume();
        }

        this.isInitialized = true;
      } catch (error) {
        console.error("Failed to initialize audio context:", error);
      }
    }
  }

  private async getAudioContext(): Promise<AudioContext | null> {
    if (!this.audioContext || this.audioContext.state === "suspended") {
      await this.initialize();
    }

    return this.audioContext;
  }

  private async createBeep(frequency: number, duration: number): Promise<void> {
    const ctx = await this.getAudioContext();

    if (!ctx) {
      return;
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.1;

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  async playSound(type: "shortBeep" | "longBeep"): Promise<void> {
    const now = Date.now();

    if (now - this.lastPlayTime < this.MIN_INTERVAL) {
      return;
    }

    try {
      if (this.audioContext?.state === "suspended") {
        this.isInitialized = false;
        await this.initialize();
      }

      if (type === "shortBeep") {
        await this.createBeep(880, 0.1);
      } else {
        await this.createBeep(440, 0.6);
      }

      this.lastPlayTime = now;
    } catch (error) {
      console.error("Failed to play sound:", error);
    }
  }

  playForState(state: any): void {
    if (state.countdownActive) {
      const seconds = Math.floor(state.countdownValue / 1000);

      if (seconds <= 3 && seconds >= 1) {
        this.playSound("shortBeep");
      }
    }

    if (state.isRunning && state.elapsedTime < 100) {
      this.playSound("longBeep");
    }

    if (state.currentMode === "emom" && state.isRunning) {
      const timeInMinute = state.elapsedTime % 60000;
      const seconds = Math.floor(timeInMinute / 1000);

      if (seconds >= 57 && seconds <= 59) {
        this.playSound("shortBeep");
      } else if (timeInMinute < 1000) {
        this.playSound("longBeep");
      }
    }
  }
}

export const soundService = new SoundService();
