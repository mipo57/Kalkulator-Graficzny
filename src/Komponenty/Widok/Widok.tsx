import * as ReactDOM from "react-dom";
import * as React from "react";
import { Dispatch, connect, Provider } from "react-redux"
import { AnyAction, createStore, Action } from "redux"
import { Store, Reducer } from "../../Store"
import * as Akcje from "../../Store";
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import * as _ from "lodash"
import { Kalkulator } from "../Kalkulator/Kalkulator"
import { PoleGraficzne } from "../PoleGraficzne/PoleGraficzne"

import "./Widok.scss";
import {sformatujNumer} from "../../Utils";

export class Widok extends React.Component {
    public render() {
        return (
            <div className="widok">
                <Kalkulator/>
                <PoleGraficzne/>
            </div>
        )
    }
}