import { createTheme } from '@material-ui/core/styles';
import {
  flexMixin,
  centerFlex,
  textOverflowEllipse,
  textClamp,
  breadcrumbs,
} from "./mixins";

const theme = createTheme({
  typography: {
    fontFamily: ["Inter", "Jost", "sans-serif"].join(","),
  },
  mixins: {
    customize: {
      flexMixin,
      centerFlex,
      textClamp,
      textOverflowEllipse,
      breadcrumbs,
    },
  },
  breakpoints: {
    keys: ["xs", "sm", "md", "lg", "xl"],
    values: {
      xs: 0,
      sm: 600,
      md: 740,
      lg: 960,
      xl: 1280,
    },
  },
  palette: {
  },
});

export default theme;
