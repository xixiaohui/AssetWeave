import { createTheme } from "@mui/material/styles";


export const theme = createTheme({
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  palette: {
    mode: "light",
    primary: {
      main: "#111827", // 金融黑
    },
    background: {
      default: "#f7f8fa",
    },
  },
});
