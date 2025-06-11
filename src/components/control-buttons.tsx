import Pause from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Refresh from "@mui/icons-material/Refresh";
import Stop from "@mui/icons-material/Stop";
import { Button, ButtonGroup } from "@mui/material";
import { FC, memo, useCallback } from "react";

import { useTimerContext } from "../hooks/use-timer-context";

export const ControlButtons: FC = memo(() => {
  const { state, startTimer, pauseTimer, resumeTimer, stopTimer, resetTimer } = useTimerContext();

  const isStartDisabled =
    (state.currentMode !== "forTime" && !state.targetTime) ||
    state.isRunning ||
    state.countdownActive;

  const handleStart = useCallback(() => {
    if (state.isPaused) {
      resumeTimer();
    } else if (state.currentMode === "forTime") {
      startTimer();
    } else if (state.targetTime > 0) {
      startTimer(state.targetTime);
    }
  }, [state.currentMode, state.targetTime, state.isPaused, startTimer, resumeTimer]);

  const handlePause = useCallback(pauseTimer, [pauseTimer]);
  const handleStop = useCallback(stopTimer, [stopTimer]);
  const handleReset = useCallback(resetTimer, [resetTimer]);

  return (
    <ButtonGroup
      disableElevation
      aria-label="Timer controls"
      orientation="horizontal"
      role="group"
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
      <Button
        aria-label={state.isPaused ? "Resume timer" : `Start ${state.currentMode} timer`}
        color="success"
        disabled={isStartDisabled}
        startIcon={<PlayArrow />}
        onClick={handleStart}
      >
        {state.isPaused ? "Resume" : "Start"}
      </Button>

      {state.isRunning && (
        <Button
          aria-label="Pause timer"
          color="warning"
          startIcon={<Pause />}
          onClick={handlePause}
        >
          Pause
        </Button>
      )}

      <Button
        aria-label="Stop timer"
        color="error"
        disabled={!state.isRunning && !state.isPaused}
        startIcon={<Stop />}
        onClick={handleStop}
      >
        Stop
      </Button>

      <Button
        aria-label="Reset timer"
        color="info"
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
