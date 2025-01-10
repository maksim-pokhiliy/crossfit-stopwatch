import { Box, Slider, Typography, useMediaQuery } from "@mui/material";

import { TIMER_CONSTANTS } from "../constants/timer";
import { useTimerContext } from "../hooks/use-timer-context";

export const CountdownSettings = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { state, currentTimer, setState } = useTimerContext();

  const handleChange = (_: Event, value: number | number[]) => {
    if (typeof value === "number") {
      currentTimer.setCountdownDuration(value);
      setState(currentTimer.getState());
    }
  };

  return (
    <Box sx={{ width: "100%", mt: isMobile ? 2 : 4, px: isMobile ? 0 : 2 }}>
      <Typography gutterBottom align={isMobile ? "center" : "left"}>
        Countdown Duration: {state.countdownDuration / 1000}s
      </Typography>

      <Slider
        disabled={state.isRunning || state.countdownActive}
        max={TIMER_CONSTANTS.MAX_COUNTDOWN}
        min={TIMER_CONSTANTS.MIN_COUNTDOWN}
        step={1000}
        value={state.countdownDuration}
        valueLabelDisplay='auto'
        valueLabelFormat={(value) => `${value / 1000}s`}
        marks={[
          { value: 0, label: "0s" },
          { value: 3000, label: "3s" },
          { value: 5000, label: "5s" },
          { value: 10000, label: "10s" },
        ]}
        sx={{
          "& .MuiSlider-markLabel": {
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          },
        }}
        onChange={handleChange}
      />
    </Box>
  );
};
