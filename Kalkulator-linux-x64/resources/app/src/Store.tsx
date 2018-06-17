import * as React from "react"
import { Dispatch, connect } from "react-redux"
import { AnyAction } from "redux"
import * as ts from "typescript";

export enum TypEtapu {
	liczba,
	operacja
};

export enum Operacja {
	dodawanie,
	odejmowanie,
	mnozenie,
	dzielenie
};

export interface Etap {
	typEtapu: TypEtapu;
	zawartosc: number | Operacja;
}

export class Store {
	public historia: Etap[] = [];
	public aktualnyWynik: number = 0;
	public aktualnaLiczba: string = "";

}

interface Action extends AnyAction {
	type: string;
	content: any;
}

export const TypDodajCyfre = "DODAJ_CYFRE";
export const DodajCyfre = (x: string) => ({ type: TypDodajCyfre, content: x } as Action);
export const TypDodajKropke = "DODAJ_KROPKE";
export const DodajKropke = () => ({ type: TypDodajKropke, content: "" } as Action);
export const TypDodajEtap = "DODAJ_ETAP";
export const DodajEtap = (etap: Etap) => ({ type: TypDodajEtap, content: etap } as Action);
export const TypPodlicz = "PODLICZ";
export const Podlicz = () => ({ type: TypPodlicz, content: "" } as Action);
export const TypWyczyscWszystko = "WYCZYSC_WSZYSTKO";
export const WyczyscWszystko = () => ({ type: TypWyczyscWszystko, content: "" } as Action);
export const TypZmienZnak = "ZMIEN_ZNAK";
export const ZmienZnak = () => ({ type: TypZmienZnak, content: "" } as Action);
export const TypUsunSymbol = "USUN_SYMBOL";
export const UsunSymbol = () => ({ type: TypUsunSymbol, content: "" } as Action);
export const TypUsunLiczbe = "USUN_LICZBE";
export const UsunLiczbe = () => ({ type: TypUsunLiczbe, content: "" } as Action);
export const TypNalozPierwiastek = "NALOZ_PIERWIASTEK";
export const NalozPierwiastek = () => ({ type: TypNalozPierwiastek, content: "" } as Action);
export const TypNalozKwadrat = "NALOZ_KWADRAT";
export const NalozKwadrat = () => ({ type: TypNalozKwadrat, content: "" } as Action);
export const TypNalozInwersje = "NALOZ_INWERSJE";
export const NalozInwersje = () => ({ type: TypNalozInwersje, content: "" } as Action);
export const TypPodzielNa100 = "PODZIEL_NA_100";
export const PodzielNa100 = () => ({ type: TypPodzielNa100, content: "" } as Action);


export let historiaNaTekst = (historia: Etap[]) => (historia as any).reduce((stan: string, etap: Etap, i: any, p: any) => {
	if (etap.typEtapu == TypEtapu.liczba) {
		stan += String(etap.zawartosc as number) + " ";
	} else {
		switch (etap.zawartosc as Operacja) {
			case Operacja.dodawanie:
				stan += "+ ";
				break;
			case Operacja.odejmowanie:
				stan += "- ";
				break;
			case Operacja.mnozenie:
				stan += "* ";
				break;
			case Operacja.dzielenie:
				stan += "/ ";
				break;
			default:
				break;
		}
	}

	return stan;
}, "");

export const Reducer = (state: Store = new Store(), action: Action) => {

	let historia: Etap[];
	let liczba: Etap;

	switch (action.type) {
		case TypDodajCyfre:
			return { ...state, aktualnaLiczba: state.aktualnaLiczba + (action.content as string) }
		case TypDodajKropke:
			if (state.aktualnaLiczba.indexOf(".") == -1)
				return { ...state, aktualnaLiczba: state.aktualnaLiczba + "." }
			break;
		case TypDodajEtap:
			historia = state.historia;
			liczba = { typEtapu: TypEtapu.liczba, zawartosc: Number(state.aktualnaLiczba) } as Etap;
			historia.push(liczba);
			historia.push(action.content as Etap);
			return { ...state, historia: historia, aktualnaLiczba: "" };
		case TypPodlicz:
			historia = state.historia;
			liczba = { typEtapu: TypEtapu.liczba, zawartosc: Number(state.aktualnaLiczba) } as Etap;
			historia.push(liczba);
			const wyrazenie = ts.transpile(historiaNaTekst(historia));
			const podliczone = eval(wyrazenie);
			return { ...state, historia: [] as Etap[], aktualnaLiczba: String(podliczone) };
		case TypWyczyscWszystko:
			return { ...state, historia: [] as Etap[], aktualnaLiczba: "", aktualnyWynik: 0 };
		case TypZmienZnak:
			if (state.aktualnaLiczba.search("-") == -1)
				return { ...state, aktualnaLiczba: "-" + state.aktualnaLiczba }
			else
				return { ...state, aktualnaLiczba: state.aktualnaLiczba.replace("-", "") };
		case TypUsunSymbol:
			return { ...state, aktualnaLiczba: state.aktualnaLiczba.substr(0, state.aktualnaLiczba.length - 1) }
		case TypUsunLiczbe:
			return { ...state, aktualnaLiczba: "" };
		case TypNalozPierwiastek:
			let l = Number(state.aktualnaLiczba)
			if (isNaN(l)) {
				l = 0;
			}
			if (l > 0) {
				l = Math.sqrt(l);
				return { ...state, aktualnaLiczba: String(l) }
			}
			break;
		case TypNalozKwadrat:
			let lk = Number(state.aktualnaLiczba)
			if (isNaN(lk)) {
				lk = 0;
			}
			lk = Math.pow(lk, 2);
			return { ...state, aktualnaLiczba: String(lk) }
		case TypNalozInwersje:
			let li = Number(state.aktualnaLiczba)
			if (isNaN(li)) {
				li = 0;
			}
			if (li != 0) {
				li = 1 / li;
				return { ...state, aktualnaLiczba: String(li) }
			}
			break;
		case TypPodzielNa100:
			let lp = Number(state.aktualnaLiczba)
			if (isNaN(lp)) {
				lp = 0;
			}
			lp = lp / 100;
			return { ...state, aktualnaLiczba: String(lp) }
		default:
			return state;
	}
	return state;
}

