
type Tuple<Reducer,State,Renderer> = [Reducer,State,Renderer];

type Composer = (parent: Tuple<any,any,any>, children: Tuple<any,any,any>[]) => Tuple<any,any,any>;

type Engine = (t: Tuple<any, any, any>) => void;