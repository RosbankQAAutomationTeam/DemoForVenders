import {
  ButtonGroup,
  Button,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import React from "react";

function FailController<FailOption extends string>({
  failOptions,
  fail
}: {
  failOptions: FailOption[];
  fail?: (failOption: FailOption) => void;
}) {
  if (failOptions.length === 0 || failOptions.length === 1) {
    return <></>;
  }
  if (failOptions.length === 2) {
    return (
      <FormControlLabel
        control={<Checkbox color="primary" />}
        label={failOptions[1]}
        onChange={(_event, checked: boolean) => {
          if (fail) {
            fail(checked ? failOptions[1] : failOptions[0]);
          }
        }}
      />
    );
  }
  return <></>;
}

interface StateControllerProps {
  updateVersion: (index: 1 | 2 | 3) => void;
  failOptions: string[];
  fail?: (failOption: string) => void;
}

export function StateController({
  updateVersion,
  failOptions,
  fail
}: StateControllerProps) {
  return (
    <React.Fragment>
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        {[1, 2, 3].map((index) => (
          <Button key={index} onClick={() => updateVersion(index as 1 | 2 | 3)}>
            {`V${index}`}
          </Button>
        ))}
      </ButtonGroup>
      <FailController {...{ failOptions, fail }} />
    </React.Fragment>
  );
}
