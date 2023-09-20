import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";
import get from "lodash/get";

const useStyles = makeStyles((theme) => {
  return {
    wrapper: {
      display: "flex",
    },
    "sk-cube-grid": {
      width: "24px",
      height: "24px",
    },
    "sk-cube": {
      width: "33%",
      height: "33%",
      backgroundColor: get(theme, "palette.primary.main"),
      float: "left",
      animation: "$sk-cubeGridScaleDelay 1.3s infinite ease-in-out",
    },
    "sk-cube1": {
      animationDelay: "0.2s",
    },
    "sk-cube2": {
      animationDelay: "0.3s",
    },
    "sk-cube3": {
      animationDelay: "0.4s",
    },
    "sk-cube4": {
      animationDelay: "0.1s",
    },
    "sk-cube5": {
      animationDelay: "0.2s",
    },
    "sk-cube6": {
      animationDelay: "0.3s",
    },
    "sk-cube7": {
      animationDelay: "0s",
    },
    "sk-cube8": {
      animationDelay: "0.1s",
    },
    "sk-cube9": {
      animationDelay: "0.2s",
    },

    "@keyframes sk-cubeGridScaleDelay": {
      "0%, 70%, 100%": {
        transform: "scale3D(1, 1, 1)",
      },
      "35%": {
        transform: "scale3D(0, 0, 1)",
      },
    },
  };
});

const Loading = () => {
  const classes = useStyles();

  return (
    <Box className={classNames(classes["wrapper"])}>
      <Box className={classNames(classes["sk-cube-grid"])}>
        <Box className={classNames(classes["sk-cube"], classes["sk-cube1"])}></Box>
        <Box className={classNames(classes["sk-cube"], classes["sk-cube2"])}></Box>
        <Box className={classNames(classes["sk-cube"], classes["sk-cube3"])}></Box>
        <Box className={classNames(classes["sk-cube"], classes["sk-cube4"])}></Box>
        <Box className={classNames(classes["sk-cube"], classes["sk-cube5"])}></Box>
        <Box className={classNames(classes["sk-cube"], classes["sk-cube6"])}></Box>
        <Box className={classNames(classes["sk-cube"], classes["sk-cube7"])}></Box>
        <Box className={classNames(classes["sk-cube"], classes["sk-cube8"])}></Box>
        <Box className={classNames(classes["sk-cube"], classes["sk-cube9"])}></Box>
      </Box>
    </Box>
  );
};

export default Loading;
