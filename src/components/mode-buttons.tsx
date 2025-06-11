import { Button, ButtonGroup, Tooltip } from "@mui/material";
import { FC, memo, useCallback } from "react";

import { useTimerContext } from "../hooks/use-timer-context";
import { TimerMode } from "../types/timer";

const modeDescriptions: Record<TimerMode, string> = {
  forTime: "Complete the workout as fast as possible",
  amrap: "Complete As Many Rounds As Possible in a set time",
  emom: "Every Minute On the Minute - perform the workout at the start of each minute",
};

export const ModeButtons: FC = memo(() => {
  const { state, setMode } = useTimerContext();

  const handleModeChange = useCallback(
    (mode: TimerMode) => {
      setMode(mode);
    },
    [setMode],
  );

  return (
    <ButtonGroup
      disableElevation
      color="primary"
      orientation="horizontal"
      variant="contained"
      sx={{
        width: "100%",
        "& .MuiButton-root": {
          width: "100%",
          borderRight: "none",
        },
        "& .MuiButtonGroup-grouped:not(:last-of-type)": {
          borderRight: "none",
        },
      }}
    >
      {(Object.keys(modeDescriptions) as TimerMode[]).map((mode) => (
        <Tooltip key={mode} arrow placement="top" title={modeDescriptions[mode]}>
          <Button
            color={state.currentMode === mode ? "primary" : "inherit"}
            disabled={state.isRunning || state.countdownActive}
            variant="contained"
            onClick={() => handleModeChange(mode)}
          >
            {mode.toUpperCase()}
          </Button>
        </Tooltip>
      ))}
    </ButtonGroup>
  );
});

ModeButtons.displayName = "ModeButtons";
