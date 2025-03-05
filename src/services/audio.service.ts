import { soundService } from "./sound.service";

export class AudioService {
  initialize() {
    soundService.initialize();
  }

  playCountdown(seconds: number) {
    soundService.playCountdownSound(seconds);
  }

  playStart() {
    soundService.playStartSound();
  }

  playEmom(timeInMinute: number) {
    soundService.playEmomSound(timeInMinute);
  }
}

export const audioService = new AudioService();
