import { CssBaseline, ThemeProvider } from "@mui/material";
import { FC, useMemo } from "react";

import { Timer } from "./components/timer";
import { TimerProvider } from "./context/timer-provider";
import { useTimerContext } from "./hooks/use-timer-context";
import { createAppTheme } from "./theme/theme";

const TimerApp: FC = () => {
  const { state } = useTimerContext();
  const theme = useMemo(() => createAppTheme(state.theme), [state.theme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Timer />
    </ThemeProvider>
  );
};

const App: FC = () => {
  return (
    <TimerProvider>
      <TimerApp />
    </TimerProvider>
  );
};

export default App;
