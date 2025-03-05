import { Box, Theme, Typography, useTheme } from "@mui/material";
import { FC, memo, useMemo } from "react";

import { useTimerContext } from "../hooks/use-timer-context";
import { formatTimeShort } from "../utils/time";

export const TimeDisplay: FC = memo(() => {
  const theme = useTheme<Theme>();
  const { state } = useTimerContext();

  const time = state.countdownActive ? state.countdownValue : state.elapsedTime;
  const formattedTime = useMemo(() => formatTimeShort(time), [time]);

  const textColor = useMemo(() => {
    if (state.countdownActive) {
      return theme.palette.warning.main;
    }

    return theme.palette.text.primary;
  }, [state.countdownActive, theme.palette]);

  const containerStyles = useMemo(() => ({ textAlign: "center", width: "100%" }), []);
  const timeStyles = useMemo(() => ({ fontWeight: "bold", color: textColor }), [textColor]);

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
