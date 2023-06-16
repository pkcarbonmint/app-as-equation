import * as React from "react";
import TextField from "@mui/material/TextField";
import { Button, Container, Stack } from "@mui/material";

export type AppEntryState = {
  name: string | null;
  setName: (name: string) => void;
  clearName: () => void;
};

export function AskForName(state: AppEntryState) {
  const [localName, localSetName] = React.useState<string | null>(null);
  function changeName() {
    if (!(localName && localName.length)) {
      return;
    }
    console.log("Settng name to", { localName });
    state.setName(localName);
  }
  const onChange = (evt: any) => {
    localSetName(evt.target.value);
  };
  return (
    <Container>
      <Stack>
        <TextField
          onChange={onChange}
          label="What is your name"
          variant="filled" />
        <Button onClick={changeName}>Submit</Button>
      </Stack>
    </Container>
  );
}
