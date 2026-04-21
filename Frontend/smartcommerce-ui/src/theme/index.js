import { createTheme } from "@mui/material/styles";
import { COLORS } from "./colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.primary,
      dark: COLORS.primaryDark,
      light: COLORS.primaryLight,
    },
    secondary: {
      main: COLORS.accent,
    },
    success: {
      main: COLORS.success,
    },
    background: {
      default: COLORS.bgPage,
      paper: COLORS.bgPaper,
    },
    text: {
      primary: COLORS.textPrimary,
      secondary: COLORS.textSecondary,
    },
    divider: COLORS.border,
  },
});