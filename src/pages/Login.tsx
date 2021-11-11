import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React from "react";
import { v4 as uuid } from "uuid";
import { getUserInfo, page } from "./../info";
import { BackGround, Copyright, Spinner, Submit, useStyles } from "./Utils";

interface navigatable {
  navigate: (currentTitle: page) => void;
  updateSessionId: (sessionId: string) => void;
}

interface BaseLoginProps extends navigatable {}

const baseLoginState = {
  uid: "",
  password: "",
  rememberMe: false
};

const extendedLoginState = {
  ...baseLoginState,
  haveSessionId: false,
  sessionId: uuid()
};

const waitingLoginState = {
  ...extendedLoginState,
  isReady: false
};

type BaseLoginState = typeof baseLoginState;

type ExtendedLoginState = typeof extendedLoginState;

type WaitingLoginState = typeof waitingLoginState;

function LoginAvatar() {
  const classes = useStyles();
  return (
    <Avatar className={classes.avatar}>
      <LockOutlinedIcon />
    </Avatar>
  );
}

function LoginHeader({ v }: { v: 1 | 2 | 3 }) {
  return (
    <div>
      <LoginAvatar />
      <Typography component="h1" variant="h5">
        Тест v{v}
      </Typography>
    </div>
  );
}

function UID({ blurAction }: { blurAction: (value: string) => void }) {
  return (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id="uid"
      label="Уникальный идентификатор пользователя"
      name="uid"
      autoFocus
      onBlur={(event) => {
        blurAction(event.target.value);
      }}
    />
  );
}

function Password({ blurAction }: { blurAction: (value: string) => void }) {
  return (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      name="password"
      label="Пароль"
      type="password"
      id="password"
      onBlur={(event) => {
        blurAction(event.target.value);
      }}
    />
  );
}

function RememberMe({
  changeAction
}: {
  changeAction: (value: boolean) => void;
}) {
  return (
    <FormControlLabel
      control={<Checkbox value="remember" color="primary" />}
      label="Запомнить меня"
      onChange={(_event, checked: boolean) => {
        changeAction(checked);
      }}
    />
  );
}

function HaveSessionId({
  changeAction
}: {
  changeAction: (value: boolean) => void;
}) {
  return (
    <FormControlLabel
      control={<Checkbox value="haveSessionId" color="secondary" />}
      label="Войти по идентификатору"
      onChange={(_event, checked: boolean) => {
        changeAction(checked);
      }}
    />
  );
}

interface SessionIdProps {
  disabled: boolean;
  value: string;
  blurAction: (value: string) => void;
}

class SessionId extends React.Component<
  SessionIdProps,
  { sessionId: string; disabled: boolean }
> {
  constructor(props: SessionIdProps) {
    super(props);
    this.state = {
      sessionId: props.value,
      disabled: props.disabled
    };
  }

  static getDerivedStateFromProps(
    props: SessionIdProps,
    state: { sessionId: string; disabled: boolean }
  ) {
    return {
      sessionId: props.disabled ? props.value : state.sessionId,
      disabled: props.disabled
    };
  }

  setValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      ...this.state,
      sessionId: event.currentTarget.value
    });
  };

  render() {
    return (
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        name="sessionId"
        label="Идентификатор сессии"
        disabled={this.props.disabled}
        value={this.props.value}
        onChange={(event) => this.props.blurAction(event.target.value)}
      />
    );
  }
}

function Alternative({ navigate }: { navigate: (page: page) => void }) {
  return (
    <Grid container>
      <Grid item xs>
        <Link
          href="#"
          variant="body2"
          onClick={() => {
            alert(
              "Функционал не поддерживается. Зарегистрируйтесь повторно или свяжитесь с Tladianta Team"
            );
          }}
        >
          Восстановить доступ
        </Link>
      </Grid>
      <Grid item>
        <Link
          href="#"
          variant="body2"
          onClick={() => {
            navigate("Регистрация");
          }}
        >
          {"Зарегистрироваться"}
        </Link>
      </Grid>
    </Grid>
  );
}

function LoginForm({
  v,
  component
}: {
  v: 1 | 2 | 3;
  component: React.ReactNode;
}) {
  const classes = useStyles();
  return (
    <div className="App">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <BackGround
          component={
            <React.Fragment>
              <LoginHeader v={v} />
              <form className={classes.form} noValidate>
                {component}
              </form>
            </React.Fragment>
          }
        ></BackGround>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </div>
  );
}

abstract class BaseLogin<
  Props extends BaseLoginProps,
  State extends BaseLoginState
> extends React.Component<Props, State> {
  setId = (uid: string) => {
    this.setState({ ...this.state, uid });
  };

  setPassword = (password: string) => {
    this.setState({ ...this.state, password });
  };

  setRememberMe = (rememberMe: boolean) => {
    this.setState({ ...this.state, rememberMe });
  };

  connect = () => {
    const userInfo = getUserInfo({
      uid: this.state.uid,
      password: this.state.password
    });
    if (!userInfo) {
      alert("Неверный uid или пароль");
      this.setPassword("");
      return;
    }
    const sessionId = uuid();
    userInfo.sessionIds.push(sessionId);
    this.props.updateSessionId(sessionId);
  };

  setSessionId = (sessionId: string) => {
    this.setState({ ...this.state, sessionId });
  };
}

abstract class ExtendedLogin<
  Props extends BaseLoginProps,
  State extends ExtendedLoginState
> extends BaseLogin<Props, State> {
  setHaveSessionId = (haveSessionId: boolean) => {
    this.setState({
      ...this.state,
      haveSessionId,
      sessionId: haveSessionId ? "" : uuid()
    });
  };

  public connect = () => {
    if (this.state.haveSessionId) {
      this.props.updateSessionId(this.state.sessionId);
    } else {
      const userInfo = getUserInfo({
        uid: this.state.uid,
        password: this.state.password
      });
      if (!userInfo) {
        alert("Неверный uid или пароль");
        this.setPassword("");
        return;
      }
      userInfo.sessionIds.push(this.state.sessionId);
      this.props.updateSessionId(this.state.sessionId);
    }
  };
}

class LoginV1 extends BaseLogin<BaseLoginProps, BaseLoginState> {
  constructor(props: BaseLoginProps) {
    super(props);
    this.state = {
      ...baseLoginState
    };
  }
  render() {
    return (
      <LoginForm
        v={1}
        component={
          <React.Fragment>
            <UID blurAction={this.setId} />
            <Password blurAction={this.setPassword} />
            <RememberMe changeAction={this.setRememberMe} />
            <Submit caption="Войти" clickAction={this.connect} />
            <Alternative navigate={this.props.navigate} />
          </React.Fragment>
        }
      />
    );
  }
}

class LoginV2 extends ExtendedLogin<BaseLoginProps, ExtendedLoginState> {
  constructor(props: BaseLoginProps) {
    super(props);
    this.state = {
      ...extendedLoginState
    };
  }
  render() {
    return (
      <LoginForm
        v={2}
        component={
          <React.Fragment>
            {!this.state.haveSessionId ? (
              <React.Fragment>
                <UID blurAction={this.setId} />
                <Password blurAction={this.setPassword} />
              </React.Fragment>
            ) : (
              <></>
            )}
            <SessionId
              blurAction={this.setSessionId}
              value={this.state.sessionId}
              disabled={!this.state.haveSessionId}
            />
            <Grid container>
              <Grid item xs>
                <HaveSessionId changeAction={this.setHaveSessionId} />
              </Grid>
              <Grid item>
                <RememberMe changeAction={this.setRememberMe} />
              </Grid>
            </Grid>
            <Submit caption="Подключиться" clickAction={this.connect} />
            <Alternative navigate={this.props.navigate} />
          </React.Fragment>
        }
      />
    );
  }
}

class LoginV3 extends ExtendedLogin<BaseLoginProps, WaitingLoginState> {
  constructor(props: BaseLoginProps) {
    super(props);
    this.state = {
      ...waitingLoginState
    };
    new Promise((res) => setTimeout(res, 8000)).then(() =>
      this.setState({ ...waitingLoginState, isReady: true })
    );
  }

  connect = () => {
    const task = () => {
      new Promise((res) => setTimeout(res, 8000)).then(() => {
        this.setState({ ...this.setState, isReady: true });
        if (this.state.haveSessionId) {
          this.props.updateSessionId(this.state.sessionId);
        } else {
          const userInfo = getUserInfo({
            uid: this.state.uid,
            password: this.state.password
          });
          if (!userInfo) {
            alert("Неверный uid или пароль");
            this.setPassword("");
            return;
          }
          userInfo.sessionIds.push(this.state.sessionId);
          this.props.updateSessionId(this.state.sessionId);
        }
      });
    };
    this.setState({ ...this.state, isReady: false }, task);
  };

  render() {
    return this.state.isReady ? (
      <LoginForm
        v={3}
        component={
          <React.Fragment>
            {!this.state.haveSessionId ? (
              <React.Fragment>
                <UID blurAction={this.setId} />
                <Password blurAction={this.setPassword} />
              </React.Fragment>
            ) : (
              <></>
            )}
            <SessionId
              blurAction={this.setSessionId}
              value={this.state.sessionId}
              disabled={!this.state.haveSessionId}
            />
            <Grid container>
              <Grid item xs>
                <HaveSessionId changeAction={this.setHaveSessionId} />
              </Grid>
              <Grid item>
                <RememberMe changeAction={this.setRememberMe} />
              </Grid>
            </Grid>
            <Submit caption="Подключиться" clickAction={this.connect} />
            <Alternative navigate={this.props.navigate} />
          </React.Fragment>
        }
      />
    ) : (
      <Spinner />
    );
  }
}

function NoLogin() {
  return <div />;
}

interface Props extends navigatable {
  v: 1 | 2 | 3;
}

export default class Login extends React.Component<Props> {
  render() {
    switch (this.props.v) {
      case 1:
        return <LoginV1 {...this.props} />;
      case 2:
        return <LoginV2 {...this.props} />;
      case 3:
        return <LoginV3 {...this.props} />;
    }
    return <NoLogin />;
  }
}
