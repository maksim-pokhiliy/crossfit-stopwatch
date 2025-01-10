import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo } from "react";

import { Timer } from "./components/timer";
import { TimerProvider } from "./context/timer-provider";
import { useTimerContext } from "./hooks/use-timer-context";
import { createAppTheme } from "./theme/theme";

const TimerApp = () => {
  const { state } = useTimerContext();
  const theme = useMemo(() => createAppTheme(state.theme), [state.theme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Timer />
    </ThemeProvider>
  );
};

function App() {
  return (
    <TimerProvider>
      <TimerApp />
    </TimerProvider>
  );
}

export default App;
