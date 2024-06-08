import { createTheme } from "@mui/material";
import LinkBehavior from "./components/LinkBehaviour";

const theme = createTheme({
  typography: { fontFamily: "Poppins, sans-serif" },
  palette: { primary: { main: "#2e2e2e" } },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
});

export default theme;
