import { createTheme, responsiveFontSizes } from "@mui/material";
import { describe, expect, it, vi } from "vitest";

import { breakpoints } from "./breakpoints";
import { createAppTheme } from "./theme";

// Мокаем mui функции
vi.mock("@mui/material", () => ({
  createTheme: vi.fn().mockReturnValue({ mockTheme: true }),
  responsiveFontSizes: vi.fn((theme) => ({ ...theme, responsive: true })),
}));

describe("createAppTheme", () => {
  it("should create light theme", () => {
    const theme = createAppTheme("light");

    expect(createTheme).toHaveBeenCalledWith({
      breakpoints,
      palette: {
        mode: "light",
      },
      typography: {
        fontFamily: "'Roboto Mono', monospace",
        h2: {
          fontSize: "3rem",
          "@media (min-width:600px)": {
            fontSize: "3.75rem",
          },
          "@media (min-width:900px)": {
            fontSize: "4.5rem",
          },
        },
        h6: {
          fontSize: "1.1rem",
          "@media (min-width:600px)": {
            fontSize: "1.25rem",
          },
        },
      },
      components: {
        MuiContainer: {
          styleOverrides: {
            root: {
              "@media (min-width:600px)": {
                paddingLeft: "2rem",
                paddingRight: "2rem",
              },
            },
          },
        },
        MuiButtonGroup: {
          styleOverrides: {
            root: {
              gap: 20,
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              borderRadius: 8,
            },
          },
        },
      },
    });

    expect(responsiveFontSizes).toHaveBeenCalledWith({ mockTheme: true });
    expect(theme).toEqual({ mockTheme: true, responsive: true });
  });

  it("should create dark theme", () => {
    const theme = createAppTheme("dark");

    expect(createTheme).toHaveBeenCalledWith(
      expect.objectContaining({
        palette: {
          mode: "dark",
        },
      }),
    );

    expect(responsiveFontSizes).toHaveBeenCalledWith({ mockTheme: true });
    expect(theme).toEqual({ mockTheme: true, responsive: true });
  });
});
