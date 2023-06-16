import React, { Dispatch } from "react";
import { AskForName } from "./AskForName";
import { SayHello } from "./SayHello";
import {
  Case,
  StateWithDispatch,
  createWidget2,
  patternMatch,
  whenElse,
} from "../lib/Widget";
import { AppState, AppAction, AppActionEnum } from "../App";

const setName = (dispatch: Dispatch<AppAction>) => (name: string) =>
  dispatch({ type: AppActionEnum.SET_NAME, name: name });
const clearName = (dispatch: Dispatch<AppAction>) => () =>
  dispatch({ type: AppActionEnum.CLEAR_NAME, name: null });

function SayHelloWrapper(props: StateWithDispatch<AppState, AppAction>) {
  const { dispatch } = props;
  const props2 = {
    ...props,
    setName: setName(dispatch),
    clearName: clearName(dispatch),
  };
  return <SayHello {...props2} />;
}

function AskForNameWrapper(props: StateWithDispatch<AppState, AppAction>) {
  const { dispatch } = props;
  const props2 = {
    ...props,
    setName: setName(dispatch),
    clearName: clearName(dispatch),
  };
  return <AskForName {...props2} />;
}

export function SayHelloWidget(dispatch: Dispatch<AppAction>) {
  return createWidget2<AppState, AppAction>(dispatch, SayHelloWrapper);
}

export function AskForNameWidget(dispatch: Dispatch<AppAction>) {
  return createWidget2<AppState, AppAction>(dispatch, AskForNameWrapper);
}

const noName = (state: AppState) => state.name !== null;
const Widget = (dispatch: Dispatch<AppAction>) =>
  whenElse(
    dispatch,
    noName,
    SayHelloWidget(dispatch),
    AskForNameWidget(dispatch)
  );

const isName = (state: AppState) => (state.name ? true : false);
const isNoName = (state: AppState) => (state.name ? false : true);
const Default = (_: any) => true;

const caseStatements = (
  dispatch: Dispatch<AppAction>
): Case<AppState, AppAction>[] => [
  [isName, SayHelloWidget(dispatch)],
  [isNoName, AskForNameWidget(dispatch)],

  [Default, AskForNameWidget(dispatch)],
];

const Widget2 = (dispatch: Dispatch<AppAction>) =>
  patternMatch(dispatch, caseStatements(dispatch));

// export default Widget;
export default Widget2;
