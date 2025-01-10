class SoundService {
  private audioContext: AudioContext | null = null;
  private lastPlayTime = 0;
  private readonly MIN_INTERVAL = 1000;

  private async getAudioContext(): Promise<AudioContext> {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    return this.audioContext;
  }

  private async createBeep(frequency: number, duration: number): Promise<void> {
    const ctx = await this.getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Настройка звука
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.1; // Уменьшаем громкость

    // Плавное затухание для избежания щелчков
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
      if (type === "shortBeep") {
        await this.createBeep(880, 0.1); // Высокий короткий звук
      } else {
        await this.createBeep(1320, 0.6); // Низкий длинный звук
      }

      this.lastPlayTime = now;
    } catch (error) {
      console.error("Failed to play sound:", error);
    }
  }

  async playCountdownSound(secondsLeft: number): Promise<void> {
    const seconds = Math.floor(secondsLeft);

    if (seconds === 2 || seconds === 1 || seconds === 0) {
      await this.playSound("shortBeep");
    }
  }

  async playStartSound(): Promise<void> {
    await this.playSound("longBeep");
  }

  async playEmomSound(timeInMinute: number): Promise<void> {
    const seconds = Math.floor(timeInMinute / 1000);

    if (seconds >= 57 && seconds <= 59) {
      await this.playSound("shortBeep");
    } else if (timeInMinute < 1000) {
      await this.playSound("longBeep");
    }
  }
}

export const soundService = new SoundService();
