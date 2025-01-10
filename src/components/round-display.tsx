import { Typography, useMediaQuery } from "@mui/material";

import { useTimerContext } from "../hooks/use-timer-context";

export const RoundDisplay = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
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
        color: (theme) => theme.palette.text.secondary,
      }}
    >
      Round: {state.currentRound}
    </Typography>
  );
};
