import { Typography, useMediaQuery, useTheme } from "@mui/material";

import { useTimerContext } from "../hooks/use-timer-context";

export const RoundDisplay = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
        color: theme.palette.text.secondary,
      }}
    >
      Round: {state.currentRound}
    </Typography>
  );
};
