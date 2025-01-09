import PlayArrow from '@mui/icons-material/PlayArrow';
import Refresh from '@mui/icons-material/Refresh';
import Stop from '@mui/icons-material/Stop';
import { Button, ButtonGroup } from '@mui/material';

import { useTimer } from '../hooks/use-timer';

export const ControlButtons = () => {
  const { state, startTimer, stopTimer, resetTimer } = useTimer();

  const handleStart = () => {
    if (state.currentMode === 'forTime') {
      startTimer();
    } else if (state.targetTime > 0) {
      startTimer(state.targetTime);
    }
  };

  const isStartDisabled =
    (state.currentMode !== 'forTime' && !state.targetTime) ||
    state.isRunning ||
    state.countdownActive;

  return (
    <ButtonGroup
      disableElevation
      orientation="horizontal"
      variant="contained"
      sx={{
        width: '100%',
        '& .MuiButton-root': {
          width: '100%',
          borderRight: 'none',
        },
        '& .MuiButtonGroup-grouped:not(:last-of-type)': {
          borderRight: 'none',
        },
      }}
    >
      <Button
        color="success"
        disabled={isStartDisabled}
        startIcon={<PlayArrow />}
        onClick={handleStart}
      >
        Start
      </Button>
      <Button color="error" disabled={!state.isRunning} startIcon={<Stop />} onClick={stopTimer}>
        Stop
      </Button>
      <Button
        color="warning"
        disabled={state.countdownActive}
        startIcon={<Refresh />}
        onClick={resetTimer}
      >
        Reset
      </Button>
    </ButtonGroup>
  );
};
