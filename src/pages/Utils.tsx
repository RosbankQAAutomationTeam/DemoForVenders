import {
  Button,
  CircularProgress,
  Link,
  makeStyles,
  Typography
} from "@material-ui/core";
import React from "react";

export const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Tladianta team
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export function BackGround({ component }: { component: any }) {
  const classes = useStyles();
  return <div className={classes.paper}>{component}</div>;
}

export function Spinner() {
  return <CircularProgress />;
}

export function Submit({
  clickAction,
  caption
}: {
  caption: string;
  clickAction: () => void;
}) {
  const classes = useStyles();
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="primary"
      className={classes.submit}
      onClick={() => clickAction()}
    >
      {caption}
    </Button>
  );
}
