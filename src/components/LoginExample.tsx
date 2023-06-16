import { Dispatch } from "react";
import {
  Case,
  StateWithDispatch,
  createWidget2,
  when,
  patternMatch,
} from "../lib/Widget";

type LoginState = {
  loginMethod: "Phone" | "Google" | "Email";
};

type LoginAction = {
  type: "SwitchLoginMethod" | "GoogleLogin" | "Register";
};
function GoogleLogin(props: LoginState) {
  return <div>Google login </div>;
}
function PhoneLogin(props: LoginState) {
  return <div>Phone login </div>;
}

export function createGoogleLoginWidget(dispatch: Dispatch<LoginAction>) {
  return createWidget2<LoginState, LoginAction>(
    dispatch,
    (state: LoginState) => <GoogleLogin {...state} />
  );
}

export function createPhoneLoginWidget(dispatch: Dispatch<LoginAction>) {
  return createWidget2<LoginState, LoginAction>(
    dispatch,
    (state: LoginState) => <PhoneLogin {...state} />
  );
}

const isGoogle = (state: LoginState) => true;
const isPhone = (state: LoginState) => false;
const Default = (_: any) => true;

const caseStatements = (
  dispatch: Dispatch<LoginAction>
): Case<LoginState, LoginAction>[] => [
  [isGoogle, createGoogleLoginWidget(dispatch)],
  [isPhone, createPhoneLoginWidget(dispatch)],

  [Default, createPhoneLoginWidget(dispatch)],
];

const LoginWidget = (dispatch: Dispatch<LoginAction>) =>
  patternMatch(dispatch, caseStatements(dispatch));

export default LoginWidget;

type PatternCase<WidgetState, WidgetAction> = [
  evaluator: (state: WidgetState) => boolean,
  View: React.FC<StateWithDispatch<WidgetState, WidgetAction>>
];

export function matchPattern<WidgetState, WidgetAction>(
  dispatch: React.Dispatch<WidgetAction>,
  cases: PatternCase<WidgetState, WidgetAction>[]
) {
  return function Widget(state: WidgetState) {
    const matched = cases.find(([evaluator, _]) => evaluator(state));
    if (!matched) return null;
    const View = matched[1];
    return <View {...state} dispatch={dispatch} />;
  };
}

const LoginWidget2 = (dispatch: Dispatch<LoginAction>) =>
  matchPattern(dispatch, caseStatements(dispatch));

type PatternCase2<WidgetState> = [
  evaluator: (state: WidgetState) => boolean,
  View: React.FC<WidgetState>
];

export function matchPattern2<WidgetState>(cases: PatternCase2<WidgetState>[]) {
  return function Widget(state: WidgetState) {
    const matched = cases.find(([evaluator, _]) => evaluator(state));
    if (!matched) return null;
    const View = matched[1];
    return <View {...state} dummy={{}} />;
  };
}
