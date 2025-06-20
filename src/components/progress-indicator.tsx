import { Box, LinearProgress, Theme } from "@mui/material";
import { FC, memo, useMemo } from "react";

import { useTimerContext } from "../hooks/use-timer-context";

export const ProgressIndicator: FC = memo(() => {
  const { state } = useTimerContext();

  const progress = useMemo(
    () => Math.min((state.elapsedTime / state.targetTime) * 100, 100),
    [state.elapsedTime, state.targetTime],
  );

  const containerStyles = useMemo(() => ({ width: "100%", mt: 2 }), []);

  const progressBarStyles = useMemo(
    () => ({
      height: 8,
      borderRadius: 4,
      backgroundColor: (theme: Theme) =>
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
      "& .MuiLinearProgress-bar": {
        borderRadius: 4,
        backgroundColor: (theme: Theme) =>
          progress >= 100
            ? theme.palette.error.main
            : progress >= 80
              ? theme.palette.warning.main
              : theme.palette.primary.main,
        transition: "transform 0.1s linear",
      },
    }),
    [progress],
  );

  if (state.currentMode === "forTime" || !state.targetTime || !state.isRunning) {
    return null;
  }

  return (
    <Box sx={containerStyles}>
      <LinearProgress sx={progressBarStyles} value={progress} variant="determinate" />
    </Box>
  );
});

ProgressIndicator.displayName = "ProgressIndicator";
