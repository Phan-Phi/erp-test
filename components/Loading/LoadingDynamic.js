import classNames from "classnames";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { lighten } from "@mui/material/styles";

const LoadingDynamic = () => {
  const classes = useStyles();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 1,
        marginBottom: 1,
      }}
    >
      <Box className={classNames(classes.ball, classes.ball1)}></Box>
      <Box className={classNames(classes.ball, classes.ball2)}></Box>
      <Box className={classNames(classes.ball, classes.ball3)}></Box>
    </Box>
  );
};

const useStyles = makeStyles((theme) => {
  return {
    ball: {
      height: "10px",
      width: "10px",
      borderRadius: "50%",
      float: "left",
      margin: "0 3px",
    },
    ball1: {
      backgroundColor: theme.palette.primary.main,
      animation: "$single1ball1anim 2s infinite linear",
    },

    "@keyframes single1ball1anim": {
      "0%": {
        transform: "scale(1)",
      },
      "12.5%": {
        transform: "scale(1.5)",
      },
      "25%, 100%": {
        transform: "scale(1)",
      },
    },
    ball2: {
      backgroundColor: lighten(theme.palette.primary.main, 0.2),
      animation: "$single1ball2anim 2s infinite linear",
    },
    "@keyframes single1ball2anim": {
      "0%, 25%": {
        transform: "scale(1)",
      },
      "37.5%": {
        transform: "scale(1.5)",
      },
      "50%, 100%": {
        transform: "scale(1)",
      },
    },
    ball3: {
      backgroundColor: lighten(theme.palette.primary.main, 0.4),
      animation: "$single1ball3anim 2s infinite linear",
    },
    "@keyframes single1ball3anim": {
      "0%, 50%": {
        transform: "scale(1)",
      },
      "62.5%": {
        transform: "scale(1.5)",
      },
      "75%, 100%": {
        transform: "scale(1)",
      },
    },
  };
});

export default LoadingDynamic;
