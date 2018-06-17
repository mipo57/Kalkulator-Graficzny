import * as ReactDOM from "react-dom";
import * as React from "react";
import {Dispatch, connect, Provider} from "react-redux"
import {AnyAction, createStore} from "redux"
import { Store, Reducer} from "./Store"
import { Kalkulator } from "./Komponenty/Kalkulator/Kalkulator";
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import {PoleGraficzne } from "./Komponenty/PoleGraficzne/PoleGraficzne";
import { Widok } from "./Komponenty/Widok/Widok";

initializeIcons(/* optional base url */);

const store = createStore(Reducer)


ReactDOM.render(<Provider store={store}><Widok/></Provider>, document.getElementById("app"));

