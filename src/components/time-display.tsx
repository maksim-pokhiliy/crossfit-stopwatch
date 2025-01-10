import { Box, Typography, useTheme } from "@mui/material";
import { memo, useEffect, useMemo } from "react";

import { useTimerContext } from "../hooks/use-timer-context";
import { soundService } from "../services/sound.service";

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);

  const pad = (num: number, size: number = 2) => num.toString().padStart(size, "0");

  return `${hours ? `${pad(hours)}:` : ""}${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
};

export const TimeDisplay = memo(() => {
  const theme = useTheme();
  const { state } = useTimerContext();
  const time = state.countdownActive ? state.countdownValue : state.elapsedTime;

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
    const playCountdown = async () => {
      if (state.countdownActive) {
        const seconds = Math.floor(state.countdownValue / 1000);

        await soundService.initialize();
        await soundService.playCountdownSound(seconds);
      } else if (!state.countdownActive && state.isRunning && state.elapsedTime < 100) {
        await soundService.initialize();
        await soundService.playStartSound();
      } else if (state.currentMode === "emom" && state.isRunning) {
        const timeInMinute = state.elapsedTime % 60000;

        await soundService.initialize();
        await soundService.playEmomSound(timeInMinute);
      }
    };

    playCountdown();
  }, [
    state.countdownActive,
    state.countdownValue,
    state.currentMode,
    state.isRunning,
    state.elapsedTime,
  ]);

  return (
    <Box aria-live='polite' role='timer' sx={containerStyles}>
      {state.currentMode === "emom" && state.isRunning && (
        <Typography
          gutterBottom
          aria-label={`Round ${state.currentRound}`}
          color='text.secondary'
          variant='h6'
        >
          Round {state.currentRound}
        </Typography>
      )}

      <Typography
        aria-label={`${state.countdownActive ? "Countdown" : state.currentMode} timer: ${formattedTime}`}
        component='div'
        sx={timeStyles}
        variant='h2'
      >
        {formattedTime}
      </Typography>

      {state.countdownActive && state.countdownDuration > 0 && (
        <Typography aria-label='Get ready for workout' color='text.secondary' variant='subtitle1'>
          Get ready!
        </Typography>
      )}
    </Box>
  );
});

TimeDisplay.displayName = "TimeDisplay";
