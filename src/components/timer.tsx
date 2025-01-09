import { Box, Container } from "@mui/material";

import { ControlButtons } from "./control-buttons";
import { CountdownSettings } from "./countdown-settings";
import { ModeButtons } from "./mode-buttons";
import { ProgressIndicator } from "./progress-indicator";
import { TimeDisplay } from "./time-display";
import { TimeInput } from "./time-input";

export const Timer = () => {
  return (
    <Container
      maxWidth='xs'
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          width: "100%",
        }}
      >
        <ModeButtons />
        <TimeDisplay />
        <TimeInput />
        <ControlButtons />
        <ProgressIndicator />
        <CountdownSettings />
      </Box>
    </Container>
  );
};
