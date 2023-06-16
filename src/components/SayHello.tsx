import * as React from "react";
import { Button, Container, Stack, Typography } from "@mui/material";
import { AppEntryState } from "./AskForName";

export function SayHello(state: AppEntryState) {
  const {name, clearName} = state;
  return (
    <Container>
      <Stack>
        <Typography component="h2">Hello {state.name}</Typography>
        <Button onClick={clearName}> Clear name </Button>
      </Stack>
    </Container>
  );
}
