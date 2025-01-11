import { Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { soundService } from "./sound.service";

// Расширяем тип Window для поддержки webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

describe("SoundService", () => {
  let mockAudioContext: {
    createOscillator: Mock;
    createGain: Mock;
    state: string;
    resume: Mock;
    currentTime: number;
    destination: AudioDestinationNode;
  };

  let mockOscillator: {
    connect: Mock;
    frequency: { value: number };
    type: string;
    start: Mock;
    stop: Mock;
  };

  let mockGainNode: {
    connect: Mock;
    gain: {
      value: number;
      setValueAtTime: Mock;
      exponentialRampToValueAtTime: Mock;
    };
  };

  beforeEach(() => {
    mockOscillator = {
      connect: vi.fn(),
      frequency: { value: 0 },
      type: "",
      start: vi.fn(),
      stop: vi.fn(),
    };

    mockGainNode = {
      connect: vi.fn(),
      gain: {
        value: 0,
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
    };

    mockAudioContext = {
      createOscillator: vi.fn().mockReturnValue(mockOscillator),
      createGain: vi.fn().mockReturnValue(mockGainNode),
      state: "running",
      resume: vi.fn().mockResolvedValue(undefined),
      currentTime: 0,
      destination: {} as AudioDestinationNode,
    };

    // Мокаем глобальный AudioContext
    vi.stubGlobal(
      "AudioContext",
      vi.fn().mockImplementation(() => mockAudioContext),
    );

    // Очищаем состояние сервиса
    (soundService as any).audioContext = null;
    (soundService as any).lastPlayTime = 0;
    (soundService as any).isInitialized = false;
  });

  describe("initialize", () => {
    it("should initialize audio context", async () => {
      await soundService.initialize();

      expect(AudioContext).toHaveBeenCalled();
      expect((soundService as any).audioContext).toBe(mockAudioContext);
      expect((soundService as any).isInitialized).toBe(true);
    });

    it("should use webkitAudioContext when AudioContext is not available", async () => {
      // Удаляем AudioContext
      vi.stubGlobal("AudioContext", undefined);

      // Мокаем webkitAudioContext
      vi.stubGlobal(
        "webkitAudioContext",
        vi.fn().mockImplementation(() => mockAudioContext),
      );

      await soundService.initialize();

      expect(window.webkitAudioContext).toHaveBeenCalled();
      expect((soundService as any).audioContext).toBe(mockAudioContext);
      expect((soundService as any).isInitialized).toBe(true);
    });

    it("should resume suspended audio context", async () => {
      mockAudioContext.state = "suspended";

      await soundService.initialize();

      expect(mockAudioContext.resume).toHaveBeenCalled();
    });

    it("should not initialize twice", async () => {
      await soundService.initialize();
      await soundService.initialize();

      expect(AudioContext).toHaveBeenCalledTimes(1);
    });

    it("should handle initialization error", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      vi.stubGlobal(
        "AudioContext",
        vi.fn().mockImplementation(() => {
          throw new Error("Test error");
        }),
      );

      await soundService.initialize();

      expect(consoleError).toHaveBeenCalledWith(
        "Failed to initialize audio context:",
        expect.any(Error),
      );
    });

    it("should reinitialize when audio context is suspended", async () => {
      // Первая инициализация
      await soundService.initialize();
      expect((soundService as any).audioContext).toBe(mockAudioContext);

      // Меняем состояние на suspended
      mockAudioContext.state = "suspended";

      // Пытаемся воспроизвести звук
      await soundService.playSound("shortBeep");

      // Должна произойти повторная инициализация
      expect(AudioContext).toHaveBeenCalledTimes(2);
    });

    it("should handle failed audio context initialization", async () => {
      // Первая инициализация
      await soundService.initialize();

      // Симулируем ситуацию, когда контекст не создался
      (soundService as any).audioContext = null;

      // Пытаемся воспроизвести звук
      await soundService.playSound("shortBeep");

      // Не должно быть попыток создать осциллятор
      expect(mockAudioContext.createOscillator).not.toHaveBeenCalled();
    });
  });

  describe("playSound", () => {
    beforeEach(async () => {
      await soundService.initialize();
    });

    it("should play short beep", async () => {
      await soundService.playSound("shortBeep");

      expect(mockOscillator.frequency.value).toBe(880);
      expect(mockOscillator.type).toBe("sine");
      expect(mockGainNode.gain.value).toBe(0.1);
      expect(mockOscillator.start).toHaveBeenCalledWith(0);
      expect(mockOscillator.stop).toHaveBeenCalledWith(0.1);
    });

    it("should play long beep", async () => {
      await soundService.playSound("longBeep");

      expect(mockOscillator.frequency.value).toBe(440);
      expect(mockOscillator.type).toBe("sine");
      expect(mockGainNode.gain.value).toBe(0.1);
      expect(mockOscillator.start).toHaveBeenCalledWith(0);
      expect(mockOscillator.stop).toHaveBeenCalledWith(0.6);
    });

    it("should respect minimum interval between sounds", async () => {
      vi.spyOn(Date, "now").mockReturnValueOnce(1000).mockReturnValueOnce(1500);

      await soundService.playSound("shortBeep");
      await soundService.playSound("shortBeep");

      expect(mockOscillator.start).toHaveBeenCalledTimes(1);
    });

    it("should handle playback error", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      mockAudioContext.createOscillator.mockImplementation(() => {
        throw new Error("Test error");
      });

      await soundService.playSound("shortBeep");

      expect(consoleError).toHaveBeenCalledWith("Failed to play sound:", expect.any(Error));
    });
  });

  describe("playCountdownSound", () => {
    beforeEach(async () => {
      await soundService.initialize();
    });

    it("should play sound at 2 seconds", async () => {
      await soundService.playCountdownSound(2.5);

      expect(mockOscillator.frequency.value).toBe(880);
    });

    it("should play sound at 1 second", async () => {
      await soundService.playCountdownSound(1.8);

      expect(mockOscillator.frequency.value).toBe(880);
    });

    it("should play sound at 0 seconds", async () => {
      await soundService.playCountdownSound(0.9);

      expect(mockOscillator.frequency.value).toBe(880);
    });

    it("should not play sound at other times", async () => {
      await soundService.playCountdownSound(3.5);

      expect(mockOscillator.start).not.toHaveBeenCalled();
    });
  });

  describe("playStartSound", () => {
    beforeEach(async () => {
      await soundService.initialize();
    });

    it("should play long beep", async () => {
      await soundService.playStartSound();

      expect(mockOscillator.frequency.value).toBe(440);
      expect(mockOscillator.stop).toHaveBeenCalledWith(0.6);
    });
  });

  describe("playEmomSound", () => {
    beforeEach(async () => {
      await soundService.initialize();
    });

    it("should play short beep at 57-59 seconds", async () => {
      await soundService.playEmomSound(57000);
      await soundService.playEmomSound(58000);
      await soundService.playEmomSound(59000);

      expect(mockOscillator.frequency.value).toBe(880);
      expect(mockOscillator.stop).toHaveBeenCalledWith(0.1);
    });

    it("should play long beep at last second", async () => {
      await soundService.playEmomSound(500);

      expect(mockOscillator.frequency.value).toBe(440);
      expect(mockOscillator.stop).toHaveBeenCalledWith(0.6);
    });

    it("should not play sound at other times", async () => {
      await soundService.playEmomSound(30000);

      expect(mockOscillator.start).not.toHaveBeenCalled();
    });
  });
});
