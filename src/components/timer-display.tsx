import { Box, Fade, Theme, Typography, useMediaQuery } from "@mui/material";
import { FC, memo } from "react";
import { useTimerContext } from "../hooks/use-timer-context";
import { formatTimeLong } from "../utils/time";

export const TimerDisplay: FC = memo(() => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const { state } = useTimerContext();

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
              color: "inherit",
              fontSize: isMobile ? "4rem" : "6rem",
            }}
          >
            {state.countdownValue}
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
          {formatTimeLong(
            state.currentMode === "forTime"
              ? state.elapsedTime
              : Math.max(0, state.targetTime - state.elapsedTime),
          )}
        </Typography>
      )}
    </Box>
  );
});

TimerDisplay.displayName = "TimerDisplay";
