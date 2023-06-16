import React, { Dispatch, useReducer, useState } from "react";

export type ReducerFunctionType<WidgetState, WidgetAction> = (
  state: WidgetState,
  action: WidgetAction
) => WidgetState;

export type StateWithDispatch<WidgetState, WidgetAction> = WidgetState & {
  dispatch: React.Dispatch<WidgetAction>;
};

export type ViewMapper<WidgetState, WidgetAction> = (
  state: WidgetState
) => React.FC<StateWithDispatch<WidgetState, WidgetAction>>;

// Given a partial state, return a react component
export type PartialViewMapper<WidgetState, WidgetAction, PartialState> = (
  state: PartialState
) => React.FC<StateWithDispatch<WidgetState, WidgetAction>>;

export type WidgetComposeArr<WidgetState, WidgetAction> = (
  widgets: Widget<WidgetState, WidgetAction>[]
) => Widget<WidgetState, WidgetAction>;

export type WidgetComposeBinary<WidgetState, WidgetAction> = (
  Widget1: React.FC<WidgetState>,
  Widget2: React.FC<WidgetState>
) => Widget<WidgetState, WidgetAction>;

export type WidgetComposeDispatchBinary<WidgetState, WidgetAction> = (
  dispatch: React.Dispatch<WidgetAction>,
  Widget1: Widget<WidgetState, WidgetAction>,
  Widget2: Widget<WidgetState, WidgetAction>
) => Widget<WidgetState, WidgetAction>;

// Define a DSL type for widget composition
export type WidgetDSL<WidgetState, WidgetAction> =
  | React.FC<StateWithDispatch<WidgetState, WidgetAction>> // Single widget component
  | [React.FC<StateWithDispatch<WidgetState, WidgetAction>>] // List of widget components
  | [
      WidgetComposeArr<WidgetState, WidgetAction>, // Widget composition function
      ...WidgetDSL<WidgetState, WidgetAction>[]
    ];

export type Widget<WidgetState, WidgetAction> = React.FC<WidgetState>;
// type Widget<WidgetState, WidgetAction> = (state: WidgetState) => JSX.Element;

const NullWidget = (_: any): JSX.Element => {
  return <></>;
};

export type Case<WidgetState, WidgetAction> = [
  evaluator: (state: WidgetState) => boolean,
  View: React.FC<StateWithDispatch<WidgetState, WidgetAction>>
];

export function createWidget<WidgetState, WidgetAction>(
  initializer: (state?: WidgetState) => WidgetState,
  reducer: ReducerFunctionType<WidgetState, WidgetAction>,
  View: React.FC<StateWithDispatch<WidgetState, WidgetAction>>
): Widget<WidgetState, WidgetAction> {
  return function Widget(initialState?: WidgetState) {
    const [state, dispatch]: [WidgetState, React.Dispatch<WidgetAction>] =
      useReducer(reducer, initializer(initialState));

    return <View {...state} dispatch={dispatch} />;
  };
}

export function createWidget2<WidgetState, WidgetAction>(
  dispatch: React.Dispatch<WidgetAction>,
  View: React.FC<StateWithDispatch<WidgetState, WidgetAction>>
): Widget<WidgetState, WidgetAction> {
  return function Widget(state: WidgetState) {
    return <View {...state} dispatch={dispatch} />;
  };
}

export function createWidget3<WidgetState, WidgetAction>(
  dispatch: React.Dispatch<WidgetAction>,
  viewMapper: ViewMapper<WidgetState, WidgetAction>
): Widget<WidgetState, WidgetAction> {
  return function Widget(state: WidgetState) {
    const View = viewMapper(state);
    return <View {...state} dispatch={dispatch} />;
  };
}

export function createWidget4<WidgetState, WidgetAction, PartialState>(
  dispatch: React.Dispatch<WidgetAction>,
  valueMapper: (state: WidgetState) => PartialState,
  viewMapper: PartialViewMapper<WidgetState, WidgetAction, PartialState>
): Widget<WidgetState, WidgetAction> {
  return function Widget(state: WidgetState) {
    const partial = valueMapper(state);
    const View = viewMapper(partial);
    return <View {...state} dispatch={dispatch} />;
  };
}

export function when<WidgetState, WidgetAction>(
  dispatch: React.Dispatch<WidgetAction>,
  evaluator: (state: WidgetState) => boolean,
  View: React.FC<StateWithDispatch<WidgetState, WidgetAction>>
): Widget<WidgetState, WidgetAction> {
  return function Widget(state: WidgetState) {
    const result = evaluator(state);
    return result ? <View {...state} dispatch={dispatch} /> : <NullWidget />;
  };
}
export function whenElse<WidgetState, WidgetAction>(
  dispatch: React.Dispatch<WidgetAction>,
  evaluator: (state: WidgetState) => boolean,
  Something: React.FC<StateWithDispatch<WidgetState, WidgetAction>>,
  Nothing: React.FC<StateWithDispatch<WidgetState, WidgetAction>>
): Widget<WidgetState, WidgetAction> {
  return function Widget(state: WidgetState) {
    const result = evaluator(state);
    return result ? (
      <Something {...state} dispatch={dispatch} />
    ) : (
      <Nothing {...state} dispatch={dispatch} />
    );
  };
}

export function patternMatch<WidgetState, WidgetAction>(
  dispatch: React.Dispatch<WidgetAction>,
  cases: Case<WidgetState, WidgetAction>[]
): Widget<WidgetState, WidgetAction> {
  console.log("[whenCase] creating widget");
  return function Widget(state: WidgetState) {
    const Matched = cases.find(([evaluator, view]) => {
      return evaluator(state);
    });
    console.log("[whenCase] ", { state, Matched });
    if (!Matched) {
      return <></>;
    }
    const View = Matched[1];
    return <View {...state} dispatch={dispatch} />;
  };
}

export function whenMap<WidgetState, WidgetAction>(
  dispatch: React.Dispatch<WidgetAction>,
  evaluator: (state: WidgetState) => boolean,
  viewMapper: ViewMapper<WidgetState, WidgetAction>
): Widget<WidgetState, WidgetAction> {
  return function Widget(state: WidgetState) {
    const result = evaluator(state);
    const View = viewMapper(state);
    return result ? <View {...state} dispatch={dispatch} /> : <NullWidget />;
  };
}

export function createConditionalWidget<WidgetState, WidgetAction>(
  dispatch: React.Dispatch<WidgetAction>,
  evaluator: (state: WidgetState) => boolean,
  viewMapper: ViewMapper<WidgetState, WidgetAction>
): Widget<WidgetState, WidgetAction> {
  return function Widget(state: WidgetState) {
    const result = evaluator(state);
    const View = viewMapper(state);
    return result ? <View {...state} dispatch={dispatch} /> : <NullWidget />;
  };
}

export function createLoopingWidget<WidgetState, WidgetAction, PartialState>(
  dispatch: React.Dispatch<WidgetAction>,
  valueMapper: (state: WidgetState) => PartialState[],
  viewMapper: ViewMapper<PartialState, WidgetAction>
): Widget<WidgetState, WidgetAction> {
  return function Widget(state: WidgetState) {
    const result = valueMapper(state);
    return (
      <>
        {result.map((partial) => {
          const View = viewMapper(partial);
          return <View {...partial} dispatch={dispatch} />;
        })}
      </>
    );
  };
}

export function compose<WidgetState, WidgetAction>(
  Widget1: Widget<WidgetState, WidgetAction>,
  Widget2: Widget<WidgetState, WidgetAction>
): Widget<WidgetState, WidgetAction> {
  return function Composite(state: WidgetState) {
    const props = { ...state, dummy: "undefined" };
    return (
      <>
        <Widget1 {...props} />
        <Widget2 {...props} />
      </>
    );
  };
}

export function composeArr<WidgetState, WidgetAction>(
  ...widgets: Widget<WidgetState, WidgetAction>[]
): Widget<WidgetState, WidgetAction> {
  return function Composite(state: WidgetState) {
    const props = { ...state };
    return (
      <>
        {widgets.map((Widget, i) => (
          <Widget key={i} {...props} />
        ))}
      </>
    );
  };
}

export function compose2<WidgetState, WidgetAction>(
  dispatch: React.Dispatch<WidgetAction>,
  Widget1: Widget<WidgetState, WidgetAction>,
  Widget2: Widget<WidgetState, WidgetAction>
): Widget<WidgetState, WidgetAction> {
  return function Widget(state: WidgetState) {
    return (
      <>
        <Widget1 {...state} dispatch={dispatch} />
        <Widget2 {...state} dispatch={dispatch} />
      </>
    );
  };
}

export function composeWith<WidgetState, WidgetAction>(
  composeFunction: WidgetComposeBinary<WidgetState, WidgetAction>,
  widget1: Widget<WidgetState, WidgetAction>,
  widget2: Widget<WidgetState, WidgetAction>
): Widget<WidgetState, WidgetAction> {
  return composeFunction(widget1, widget2);
}

export function composeWithArr<WidgetState, WidgetAction>(
  composeFunction: WidgetComposeArr<WidgetState, WidgetAction>,
  ...widgets: Widget<WidgetState, WidgetAction>[]
): Widget<WidgetState, WidgetAction> {
  return composeFunction(widgets);
}

export function composeWith2<WidgetState, WidgetAction>(
  composeFunction: WidgetComposeDispatchBinary<WidgetState, WidgetAction>,
  dispatch: React.Dispatch<WidgetAction>,
  widget1: Widget<WidgetState, WidgetAction>,
  widget2: Widget<WidgetState, WidgetAction>
): Widget<WidgetState, WidgetAction> {
  return composeFunction(dispatch, widget1, widget2);
}

// Maybe
// Either/or
