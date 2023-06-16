import React, { useReducer, useState } from "react";
import "./App.css";
import GreetingWidget from "./components/GreetingWidget";

export interface AppState {
  name: string | null;
}

export enum AppActionEnum {
  INIT,
  SET_NAME,
  CLEAR_NAME,
}

export type AppAction = {
  type: AppActionEnum;
  name: string | null;
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionEnum.SET_NAME:
      console.log("Setting name", action.name);
      return { ...state, name: action.name };
    case AppActionEnum.CLEAR_NAME:
      console.log("Clearing name");
      return { ...state, name: null };
  }
  return state;
}

function App() {

  const [state, dispatch]: [AppState, React.Dispatch<AppAction>] = useReducer(
    reducer,
    { name: null }
  );

  const Widget = GreetingWidget(dispatch);

  return (
    <div className="App">
      <Widget {...state} />
    </div>
  );
}

export default App;
