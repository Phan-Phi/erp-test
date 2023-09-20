import type { PaletteColorOptions, PaletteColor } from "@mui/material";

declare module "@mui/material/styles" {
  interface ThemeOptions {
    primary2?: PaletteColorOptions;
  }

  interface PaletteOptions {
    primary2?: PaletteColorOptions;
  }

  interface Palette {
    primary2: PaletteColor;
  }
}

declare module "@mui/material/FormLabel" {
  interface FormLabelPropsColorOverrides {
    primary2: true;
  }
}

declare module "@mui/material/IconButton" {
  interface IconButtonPropsColorOverrides {
    primary2: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    primary2: true;
  }
}

declare module "@mui/material/SvgIcon" {
  interface SvgIconPropsColorOverrides {
    primary2: true;
  }
}

declare module "@mui/material/InputBase" {
  interface InputBasePropsColorOverrides {
    primary2: true;
  }
}

declare module "@mui/material/Switch" {
  interface SwitchPropsColorOverrides {
    primary2: true;
  }
}

declare module "@mui/material/Checkbox" {
  interface CheckboxPropsColorOverrides {
    primary2: true;
  }
}

declare module "@mui/material/Radio" {
  interface RadioPropsColorOverrides {
    primary2: true;
  }
}

declare module "@mui/material/CircularProgress" {
  interface CircularProgressPropsColorOverrides {
    primary2: true;
  }
}

export {};
