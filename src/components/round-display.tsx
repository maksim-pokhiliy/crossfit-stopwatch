import { Theme, Typography, useMediaQuery } from "@mui/material";
import { FC, memo } from "react";

import { useTimerContext } from "../hooks/use-timer-context";

export const RoundDisplay: FC = memo(() => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const { state } = useTimerContext();

  if (state.currentMode !== "emom") {
    return null;
  }

  return (
    <Typography
      variant={isMobile ? "h6" : "h5"}
      sx={{
        fontFamily: "Roboto Mono, monospace",
        textAlign: "center",
        minWidth: "120px",
        color: (theme: Theme) => theme.palette.text.secondary,
      }}
    >
      Round: {state.currentRound}
    </Typography>
  );
});

RoundDisplay.displayName = "RoundDisplay";
