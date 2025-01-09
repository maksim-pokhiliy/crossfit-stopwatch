export const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
} as const;

export const deviceSizes = {
  mobile: `(max-width: ${breakpoints.values.sm - 1}px)`,
  tablet: `(min-width: ${breakpoints.values.sm}px) and (max-width: ${breakpoints.values.md - 1}px)`,
  desktop: `(min-width: ${breakpoints.values.md}px)`,
} as const;
