import { Box, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";

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
