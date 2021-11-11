import React from "react";
import PageManager from "./pages/PageManager";
import { StateController } from "./pages/components/StateController";
import { failOptions } from "info";

type loginVariant = 1 | 2 | 3;

interface State {
  v: loginVariant;
  failOption: string;
}

interface Props {}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      v: 1,
      failOption: ""
    };
    this.update = this.update.bind(this);
    this.fail = this.fail.bind(this);
  }

  update(v: loginVariant) {
    this.setState({ ...this.state, v });
  }

  fail(failOption: string) {
    this.setState({ ...this.state, failOption });
  }

  render() {
    return (
      <React.Fragment>
        <StateController
          updateVersion={this.update}
          failOptions={failOptions[this.state.v - 1]}
          fail={this.fail}
        />
        <PageManager v={this.state.v} failOption={this.state.failOption} />
      </React.Fragment>
    );
  }
}
