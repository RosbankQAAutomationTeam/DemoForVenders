import {
  Avatar,
  Box,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  TextField,
  Typography
} from "@material-ui/core";
import SportsMotorsportsIcon from "@material-ui/icons/SportsMotorsports";
import React from "react";
import { v4 as uuid } from "uuid";
import { addUser, countries, country, failOptions, page } from "./../info";
import { BackGround, Copyright, Spinner, Submit, useStyles } from "./Utils";

interface navigatable {
  navigate: (currentTitle: page) => void;
}

const baseState = {
  uid: "",
  password: "",
  name: "",
  country: "" as country
};

const extendedState = {
  ...baseState,
  sessionId: uuid(),
  autoSessionId: true
};

const waitingState = {
  ...extendedState,
  isReady: false
};

type BaseState = typeof baseState;

type ExtendedState = typeof extendedState;

type WaitingState = typeof waitingState;

interface BaseProps {
  navigate: (currentTitle: page) => void;
}

function RegisterAvatar() {
  const classes = useStyles();
  return (
    <Avatar className={classes.avatar}>
      <SportsMotorsportsIcon />
    </Avatar>
  );
}

function RegisterHeader({ v }: { v: 1 | 2 | 3 }) {
  return (
    <div>
      <RegisterAvatar />
      <Typography component="h1" variant="h5">
        Регистрация v{v}
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
      label="Идентификатор пользователя"
      name="uid"
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
      id="password"
      onBlur={(event) => {
        blurAction(event.target.value);
      }}
    />
  );
}

function Name({ blurAction }: { blurAction: (value: string) => void }) {
  return (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id="name"
      label="Имя"
      name="name"
      onBlur={(event) => {
        blurAction(event.target.value);
      }}
    />
  );
}

function Country({ blurAction }: { blurAction: (value: string) => void }) {
  return (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id="country"
      label="Страна"
      name="country"
      onBlur={(event) => {
        blurAction(event.target.value);
      }}
    />
  );
}

function CreateSessionId({
  changeAction
}: {
  changeAction: (value: boolean) => void;
}) {
  return (
    <FormControlLabel
      control={<Checkbox value="createSessionId" color="primary" />}
      label="Создать идентификатор сессии автоматически"
      onChange={(_event, checked: boolean) => {
        changeAction(checked);
      }}
    />
  );
}

interface SessionIdProps {
  auto: boolean;
  value: string;
  blurAction: (value: string) => void;
}

class SessionId extends React.Component<
  SessionIdProps,
  { sessionId: string; auto: boolean }
> {
  constructor(props: SessionIdProps) {
    super(props);
    this.state = {
      sessionId: props.value,
      auto: props.auto
    };
  }

  static getDerivedStateFromProps(
    props: SessionIdProps,
    state: { sessionId: string; auto: boolean }
  ) {
    return {
      sessionId: props.auto ? props.value : state.sessionId,
      auto: props.auto
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
        disabled={this.props.auto}
        value={this.props.value}
        onChange={(event) => this.props.blurAction(event.target.value)}
      />
    );
  }
}

function RegisterForm({
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
              <RegisterHeader v={v} />
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

abstract class BaseRegister<
  Props extends BaseProps = BaseProps,
  State extends BaseState = BaseState
> extends React.Component<Props, State> {
  setId = (uid: string) => {
    this.setState({ ...this.state, uid });
  };

  setPassword = (password: string) => {
    this.setState({ ...this.state, password });
  };

  setName = (name: string) => {
    this.setState({ ...this.state, name });
  };

  setCountry = (country: string) => {
    if (country === "") {
      alert("Страна должна быть заполнена");
      return;
    }
    if (
      !countries.find((item) => item.toLowerCase() === country.toLowerCase())
    ) {
      alert(`Страна ${country} не поддерживается`);
      return;
    }
    alert(
      `Ваше устройство не поддерживается в регионе '${country}'. Обратитесь к поставщику в вашем регионе`
    );
    this.setState({ ...this.state, country });
  };

  validateState() {
    if (
      this.state.country === "" ||
      this.state.name === "" ||
      this.state.password === "" ||
      this.state.uid === ""
    ) {
      return false;
    }
    return true;
  }

  registerUser(sessionId: string = "") {
    if (!this.validateState()) {
      alert("Не все обязательные поля были заполнены");
      return;
    }
    if (
      addUser({
        uid: this.state.uid,
        password: this.state.password,
        name: this.state.name,
        country: this.state.country,
        sessionIds: [sessionId]
      })
    ) {
      this.props.navigate("Главная");
    }
  }
}

abstract class ExtendedRegister<
  Props extends BaseProps = BaseProps,
  State extends ExtendedState = ExtendedState
> extends BaseRegister<Props, State> {
  setSessionId = (sessionId: string) => {
    this.setState({ ...this.state, sessionId });
  };

  setAutoSessionId = (autoSessionId: boolean) => {
    this.setState({
      ...this.state,
      autoSessionId,
      sessionId: autoSessionId ? uuid() : ""
    });
  };

  registerUser() {
    super.registerUser(this.state.sessionId);
  }
}

class RegisterV1 extends BaseRegister<BaseProps & { failOption: string }> {
  constructor(props: BaseProps & { failOption: string }) {
    super(props);
    this.state = {
      ...baseState
    };
    this.registerUser = this.registerUser.bind(this);
  }

  render() {
    return (
      <RegisterForm
        v={1}
        component={
          <React.Fragment>
            <UID blurAction={this.setId} />
            <Name blurAction={this.setName} />
            <Country blurAction={this.setCountry} />
            <Password blurAction={this.setPassword} />
            <Submit
              caption="Зарегестрироваться"
              clickAction={
                this.props.failOption === failOptions[0][1]
                  ? () => this.props.navigate("Главная")
                  : this.registerUser
              }
            />
          </React.Fragment>
        }
      />
    );
  }
}

class RegisterV2 extends ExtendedRegister<BaseProps & { failOption: string }> {
  constructor(props: BaseProps & { failOption: string }) {
    super(props);
    this.state = {
      ...extendedState
    };
    this.registerUser = this.registerUser.bind(this);
  }

  render() {
    return (
      <RegisterForm
        v={2}
        component={
          <React.Fragment>
            <UID blurAction={this.setId} />
            <Name blurAction={this.setName} />
            <Country
              blurAction={(country) => {
                console.log(this.props.failOption);
                const _country =
                  this.props.failOption === failOptions[1][1]
                    ? "Бразилия"
                    : country;
                this.setCountry(_country);
              }}
            />
            <Password blurAction={this.setPassword} />
            <SessionId
              blurAction={this.setSessionId}
              auto={this.state.autoSessionId}
              value={this.state.sessionId}
            />
            <CreateSessionId changeAction={this.setAutoSessionId} />
            <Submit
              caption="Зарегестрироваться"
              clickAction={this.registerUser}
            />
          </React.Fragment>
        }
      />
    );
  }
}

class RegisterV3 extends ExtendedRegister<BaseProps, WaitingState> {
  constructor(props: BaseProps) {
    super(props);
    this.state = {
      ...waitingState
    };
    new Promise((res) => setTimeout(res, 25000)).then(() =>
      this.setState({ ...waitingState, isReady: true })
    );
    super.registerUser = super.registerUser.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  registerUser() {
    if (!this.validateState()) {
      alert("Не все обязательные поля были заполнены");
      return;
    }
    const task = () => {
      new Promise((res) => setTimeout(res, 25000)).then(super.registerUser);
    };
    this.setState({ ...this.state, isReady: false }, task);
  }

  render() {
    return (
      <RegisterForm
        v={3}
        component={
          this.state.isReady ? (
            <React.Fragment>
              <UID blurAction={this.setId} />
              <Name blurAction={this.setName} />
              <Country blurAction={this.setCountry} />
              <Password blurAction={this.setPassword} />
              <SessionId
                blurAction={this.setSessionId}
                auto={this.state.autoSessionId}
                value={this.state.sessionId}
              />
              <CreateSessionId changeAction={this.setAutoSessionId} />
              <Submit
                caption="Зарегестрироваться"
                clickAction={this.registerUser}
              />
            </React.Fragment>
          ) : (
            <Spinner />
          )
        }
      />
    );
  }
}

function NoRegister() {
  return <div />;
}

interface Props extends navigatable {
  v: 1 | 2 | 3;
  failOption: string;
}

export default class Register extends React.Component<Props> {
  render() {
    switch (this.props.v) {
      case 1:
        return <RegisterV1 {...this.props} />;
      case 2:
        return <RegisterV2 {...this.props} />;
      case 3:
        return <RegisterV3 {...this.props} />;
    }
    return <NoRegister />;
  }
}
