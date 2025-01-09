import { Box, Fade, Typography, useMediaQuery, useTheme } from "@mui/material";

import { useTimerContext } from "../hooks/use-timer-context";

const formatTime = (ms: number): string => {
  const hours = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
};

export const TimerDisplay = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { state } = useTimerContext();

  const getCountdownText = () => {
    if (state.countdownValue === 0) {
      return "GO!";
    }

    return state.countdownValue;
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: isMobile ? "6rem" : "8rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Roboto Mono, monospace",
      }}
    >
      {state.countdownActive ? (
        <Fade in={state.countdownActive}>
          <Typography
            variant={isMobile ? "h1" : "h1"}
            sx={{
              fontFamily: "inherit",
              fontVariantNumeric: "tabular-nums",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              color: state.countdownValue === 0 ? theme.palette.success.main : "inherit",
              fontSize: isMobile ? "4rem" : "6rem",
            }}
          >
            {getCountdownText()}
          </Typography>
        </Fade>
      ) : (
        <Typography
          variant={isMobile ? "h2" : "h1"}
          sx={{
            fontFamily: "inherit",
            fontVariantNumeric: "tabular-nums",
            fontSize: isMobile ? "2rem" : "4rem",
          }}
        >
          {formatTime(
            state.currentMode === "forTime"
              ? state.elapsedTime
              : Math.max(0, state.targetTime - state.elapsedTime),
          )}
        </Typography>
      )}
    </Box>
  );
};
