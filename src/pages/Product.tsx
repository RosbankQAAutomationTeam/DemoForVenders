import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Typography
} from "@material-ui/core";
import React from "react";
import DesktopAccessDisabledIcon from "@material-ui/icons/DesktopAccessDisabled";
import { country, page } from "./../info";
import { BackGround, Copyright, Spinner, useStyles } from "./Utils";

function ProductAvatar() {
  const classes = useStyles();
  return (
    <Avatar className={classes.avatar}>
      <DesktopAccessDisabledIcon />
    </Avatar>
  );
}

function ProductHeader({ v }: { v: 1 | 2 | 3 }) {
  return (
    <div>
      <ProductAvatar />
      <Typography component="h1" variant="h5">
        Проверка статуса v{v}
      </Typography>
    </div>
  );
}

function Logout({
  clickAction,
  caption
}: {
  caption: string;
  clickAction: () => void;
}) {
  const classes = useStyles();
  return (
    <Button
      type="reset"
      fullWidth
      variant="contained"
      color="primary"
      className={classes.submit}
      onClick={clickAction}
    >
      {caption}
    </Button>
  );
}

function ProductForm({
  v,
  headerComponent,
  bodyComponent
}: {
  v: 1 | 2 | 3;
  headerComponent: React.ReactNode;
  bodyComponent: React.ReactNode;
}) {
  const classes = useStyles();
  return (
    <div className="App">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <BackGround
          component={
            <React.Fragment>
              {headerComponent}
              <form className={classes.form} noValidate>
                {bodyComponent}
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

interface Props {
  name: string;
  country: country;
  navigate: (page: page) => void;
}

function ProductV1({ name, country, navigate }: Props) {
  return (
    <ProductForm
      v={2}
      headerComponent={
        <Typography component="h1" variant="h5">
          Проверка статуса v{1}
        </Typography>
      }
      bodyComponent={
        <React.Fragment>
          <Typography component="h2" variant="h6">
            Уважаемый '{name}' ваш статус в данный момент неизвестен. Обратитесь
            к представителю в вашем регионе '{country}'
          </Typography>
          <Logout
            clickAction={() => navigate("Главная")}
            caption="На главную"
          />
        </React.Fragment>
      }
    />
  );
}

function ProductV2({ name, country, navigate }: Props) {
  return (
    <ProductForm
      v={2}
      headerComponent={<ProductHeader v={2} />}
      bodyComponent={
        <React.Fragment>
          <Typography component="h2" variant="h6">
            Уважаемый '{name}' проверка статуса для вашего устройства
            недоступна. Обратитесь к представителю в вашем регионе '{country}'
          </Typography>
          <Logout
            clickAction={() => navigate("Главная")}
            caption="Выйти из системы"
          />
        </React.Fragment>
      }
    />
  );
}

function ProductV3({
  name,
  country,
  navigate,
  failOption
}: Props & { failOption: string }) {
  return failOption === "" ? (
    <ProductForm
      v={3}
      headerComponent={<ProductHeader v={3} />}
      bodyComponent={
        <React.Fragment>
          <Typography component="h2" variant="h6">
            Уважаемый '{name}', к сожалению, проверка статуса для вашего
            устройства недоступна. Обратитесь к представителю в вашем регионе '
            {country}'
          </Typography>
          <Logout
            clickAction={() => navigate("Главная")}
            caption="Выйти из системы"
          />
        </React.Fragment>
      }
    />
  ) : (
    <Spinner />
  );
}

export default class Product extends React.Component<
  Props & { v: number; failOption: string }
> {
  render() {
    switch (this.props.v) {
      case 1:
        return <ProductV1 {...this.props} />;
      case 2:
        return <ProductV2 {...this.props} />;
      case 3:
        return <ProductV3 {...this.props} />;
    }
    return <div>500</div>;
  }
}
