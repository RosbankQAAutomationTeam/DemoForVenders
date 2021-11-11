import React from "react";
import Login from "./Login";
import Registration from "./Register";
import Product from "./Product";
import { getUserInfo, page, userInfo } from "./../info";

interface Props {
  v: 1 | 2 | 3;
  failOption: string;
}

interface State {
  currentTitle: page;
  sessionId: string;
  userInfo?: userInfo;
}

export default class PageManager extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentTitle: "Главная",
      sessionId: ""
    };
  }

  update = (currentTitle: page) => {
    if (currentTitle === this.state.currentTitle) {
      return;
    }
    if (currentTitle === "Продукт" && !this.state.userInfo) {
      return;
    }
    this.setState({ ...this.state, currentTitle });
  };

  updateSession = (sessionId: string, currentTitle: page = "Продукт") => {
    const userInfo = getUserInfo({ sessionId });
    if (!userInfo) {
      return;
    }
    this.setState({ ...this.state, sessionId, userInfo }, () =>
      this.update(currentTitle)
    );
  };

  render() {
    console.log(this.state.currentTitle);
    switch (this.state.currentTitle) {
      case "Главная":
        return (
          <Login
            updateSessionId={this.updateSession}
            v={this.props.v}
            navigate={this.update}
          />
        );
      case "Регистрация":
        return <Registration {...this.props} navigate={this.update} />;
      case "Продукт":
        return this.state.userInfo ? (
          <Product
            v={this.props.v}
            name={this.state.userInfo.name}
            country={this.state.userInfo.country}
            navigate={this.update}
            failOption={this.props.failOption}
          />
        ) : (
          <div>Ошибка авторизации</div>
        );
    }
  }
}
