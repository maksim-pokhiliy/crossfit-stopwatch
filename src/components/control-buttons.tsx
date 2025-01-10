import PlayArrow from "@mui/icons-material/PlayArrow";
import Refresh from "@mui/icons-material/Refresh";
import Stop from "@mui/icons-material/Stop";
import { Button, ButtonGroup } from "@mui/material";
import { memo, useCallback } from "react";

import { useTimer } from "../hooks/use-timer";
import { soundService } from "../services/sound.service";

export const ControlButtons = memo(() => {
  const { state, startTimer, stopTimer, resetTimer } = useTimer();

  const handleStart = useCallback(async () => {
    await soundService.initialize();

    if (state.currentMode === "forTime") {
      startTimer();
    } else if (state.targetTime > 0) {
      startTimer(state.targetTime);
    }
  }, [state.currentMode, state.targetTime, startTimer]);

  const handleStop = useCallback(async () => {
    await soundService.initialize();
    stopTimer();
  }, [stopTimer]);

  const handleReset = useCallback(async () => {
    await soundService.initialize();
    resetTimer();
  }, [resetTimer]);

  const isStartDisabled =
    (state.currentMode !== "forTime" && !state.targetTime) ||
    state.isRunning ||
    state.countdownActive;

  return (
    <ButtonGroup
      disableElevation
      aria-label='Timer controls'
      orientation='horizontal'
      role='group'
      variant='contained'
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
      <Button
        aria-label={`Start ${state.currentMode} timer`}
        color='success'
        disabled={isStartDisabled}
        startIcon={<PlayArrow />}
        onClick={handleStart}
      >
        Start
      </Button>

      <Button
        aria-label='Stop timer'
        color='error'
        disabled={!state.isRunning}
        startIcon={<Stop />}
        onClick={handleStop}
      >
        Stop
      </Button>

      <Button
        aria-label='Reset timer'
        color='warning'
        disabled={state.countdownActive}
        startIcon={<Refresh />}
        onClick={handleReset}
      >
        Reset
      </Button>
    </ButtonGroup>
  );
});

ControlButtons.displayName = "ControlButtons";
