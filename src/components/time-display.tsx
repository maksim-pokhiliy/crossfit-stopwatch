import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";

import { useTimerContext } from "../hooks/use-timer-context";

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);

  const pad = (num: number, size: number = 2) => num.toString().padStart(size, "0");

  return `${hours ? `${pad(hours)}:` : ""}${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
};

export const TimeDisplay = () => {
  const theme = useTheme();
  const { state } = useTimerContext();
  const time = state.countdownActive ? state.countdownValue : state.elapsedTime;

  const shortBeepRef = useRef<HTMLAudioElement | null>(null);
  const longBeepRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedTimeRef = useRef<number>(0);
  const lastPlayedSecondRef = useRef<number>(-1);

  useEffect(() => {
    const baseUrl = window.location.origin;

    shortBeepRef.current = new Audio(`${baseUrl}/sounds/short-beep.mp3`);
    longBeepRef.current = new Audio(`${baseUrl}/sounds/long-beep.mp3`);
  }, []);

  const playSound = async (sound: HTMLAudioElement | null, currentSecond: number) => {
    if (!sound) {
      return;
    }

    const now = Date.now();

    if (lastPlayedSecondRef.current === currentSecond) {
      return;
    }

    if (now - lastPlayedTimeRef.current < 1000) {
      return;
    }

    try {
      sound.currentTime = 0;
      await sound.play();
      lastPlayedTimeRef.current = now;
      lastPlayedSecondRef.current = currentSecond;
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const formattedTime = useMemo(() => formatTime(time), [time]);

  const textColor = useMemo(() => {
    if (state.countdownActive) {
      return theme.palette.warning.main;
    }

    if (state.currentMode === "emom" && state.isRunning) {
      const timeInMinute = state.elapsedTime % 60000;

      if (timeInMinute >= 55000) {
        return theme.palette.error.main;
      }

      if (timeInMinute >= 50000) {
        return theme.palette.warning.main;
      }
    }

    return theme.palette.text.primary;
  }, [state.countdownActive, state.currentMode, state.isRunning, state.elapsedTime, theme.palette]);

  const containerStyles = useMemo(() => ({ textAlign: "center", width: "100%" }), []);

  const timeStyles = useMemo(
    () => ({
      fontWeight: "bold",
      color: textColor,
    }),
    [textColor],
  );

  useEffect(() => {
    if (state.countdownActive) {
      if (state.countdownValue <= 3000) {
        const seconds = Math.floor(state.countdownValue / 1000);

        if (seconds >= 0 && seconds <= 3) {
          playSound(shortBeepRef.current, -seconds);
        }
      }
    } else if (!state.countdownActive && state.isRunning && state.elapsedTime < 1000) {
      playSound(longBeepRef.current, 1000);
    }

    if (state.currentMode === "emom" && state.isRunning) {
      const timeInMinute = state.elapsedTime % 60000;
      const seconds = Math.floor(timeInMinute / 1000);

      if (timeInMinute >= 57000 && timeInMinute <= 59000) {
        if (seconds === 57 || seconds === 58 || seconds === 59) {
          playSound(shortBeepRef.current, seconds);
        }
      } else if (timeInMinute < 1000) {
        playSound(longBeepRef.current, 0);
      }
    }
  }, [
    state.countdownActive,
    state.countdownValue,
    state.currentMode,
    state.isRunning,
    state.elapsedTime,
  ]);

  return (
    <Box sx={containerStyles}>
      {state.currentMode === "emom" && state.isRunning && (
        <Typography gutterBottom color='text.secondary' variant='h6'>
          Round {state.currentRound}
        </Typography>
      )}

      <Typography component='div' sx={timeStyles} variant='h2'>
        {formattedTime}
      </Typography>

      {state.countdownActive && state.countdownDuration > 0 && (
        <Typography color='text.secondary' variant='subtitle1'>
          Get ready!
        </Typography>
      )}
    </Box>
  );
};
