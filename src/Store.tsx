import * as React from "react"
import { Dispatch, connect } from "react-redux"
import { AnyAction } from "redux"
import * as ts from "typescript";
import { sformatujNumer,  ustawOknoRozszezone, ustawZwykleOkno } from "./Utils";

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

export enum Funkcja {
	sinus,
	cosinus,
	tangens,
	kwadratowa,
	standard
}

export interface Etap {
	typEtapu: TypEtapu;
	zawartosc: number | Operacja;
}

export class Store {
	public historia: Etap[] = [];
	public aktualnyWynik: number = 0;
	public aktualnaLiczba: string = "";
	public typFunkcji: Funkcja = Funkcja.standard;
	public funkcja: (x: number) => number;
	public zakres: [number, number] = [0, 2 * Math.PI];
	public zakresY: [number, number] = [0,1];
	public wspolczynniki: [number, number, number] = [0,0,0];
	public kwadratowaIndeks: number = 0;
	public autoSkala = false;

}

interface Akcja extends AnyAction {
	akcja: (stan: Store) => Store;
	type: string;
}

export const DodajCyfre = (x: string) => ({
	type: "komenda",
	akcja: (stan: Store): Store => {
		return { ...stan, aktualnaLiczba: stan.aktualnaLiczba + x }
	}
} as Akcja);

export const DodajKropke = () => ({
	type: "komenda",
	akcja: (stan: Store): Store => {
		if (stan.aktualnaLiczba.indexOf(".") == -1)
			return { ...stan, aktualnaLiczba: stan.aktualnaLiczba + "." }
		else
			return stan;
	}
} as Akcja);

export const DodajEtap = (etap: Etap) => ({
	type: "komenda",
	akcja: (stan: Store): Store => {
		let historia = stan.historia;
		let liczba = { typEtapu: TypEtapu.liczba, zawartosc: Number(stan.aktualnaLiczba) } as Etap;
		historia.push(liczba);
		historia.push(etap);
		return { ...stan, historia: historia, aktualnaLiczba: "" };
	}
} as Akcja);

export const Podlicz = () => ({
	type: "komenda",
	akcja: (stan: Store): Store => {
		let historia = stan.historia;
		let liczba = { typEtapu: TypEtapu.liczba, zawartosc: Number(stan.aktualnaLiczba) } as Etap;
		historia.push(liczba);
		const wyrazenie = ts.transpile(historiaNaTekst(historia));
		const podliczone = eval(wyrazenie);
		return { ...stan, historia: [] as Etap[], aktualnaLiczba: String(podliczone) };
	}
} as Akcja);

export const WyczyscWszystko = () => ({
	type: "komenda",
	akcja: (stan: Store): Store => {
		return { ...stan, historia: [] as Etap[], aktualnaLiczba: "", aktualnyWynik: 0 };
	}
} as Akcja);

export const ZmienZnak = () => ({
	type: "komenda",
	akcja: (stan: Store): Store => {
		if (stan.aktualnaLiczba.search("-") == -1)
			return { ...stan, aktualnaLiczba: "-" + stan.aktualnaLiczba }
		else
			return { ...stan, aktualnaLiczba: stan.aktualnaLiczba.replace("-", "") };
	}
} as Akcja);

export const UsunSymbol = () => ({
	type: "komenda",
	akcja: (stan: Store): Store => {
		return { ...stan, aktualnaLiczba: stan.aktualnaLiczba.substr(0, stan.aktualnaLiczba.length - 1) }
	}
} as Akcja);

export const UsunLiczbe = () => ({
	type: "komenda",
	akcja: (stan: Store): Store => {
		return { ...stan, aktualnaLiczba: "" };
	}
} as Akcja);

export const NalozPierwiastek = () => ({
	type: "komenda",
	akcja: (stan: Store): Store => {
		let l = Number(stan.aktualnaLiczba)
		if (isNaN(l)) {
			l = 0;
		}
		if (l > 0) {
			l = Math.sqrt(l);
			return { ...stan, aktualnaLiczba: String(l) }
		}
		return stan;
	}
} as Akcja);


export const NalozKwadrat = () => ({
	type: "komenda",
	akcja: (stan: Store): Store => {
		let lk = Number(stan.aktualnaLiczba)
		if (isNaN(lk)) {
			lk = 0;
		}
		lk = Math.pow(lk, 2);
		return { ...stan, aktualnaLiczba: String(lk) }
	}
} as Akcja);


export const NalozInwersje = () => ({
	type: "komenda",
	akcja: (stan: Store): Store => {
		let li = Number(stan.aktualnaLiczba)
		if (isNaN(li)) {
			li = 0;
		}
		if (li != 0) {
			li = 1 / li;
			return { ...stan, aktualnaLiczba: String(li) }
		}
		return stan;
	}
} as Akcja);

export const PodzielNa100 = () => ({
	type: "komenda",
	akcja: (stan: Store): Store => {
		let lp = Number(stan.aktualnaLiczba)
		if (isNaN(lp)) {
			lp = 0;
		}
		lp = lp / 100;
		return { ...stan, aktualnaLiczba: String(lp) }
	}
} as Akcja);

export const UstawFunkcje = (typFunkcji: Funkcja) => ({
	type: "komenda",
	akcja: (stan: Store): Store => {
		if (typFunkcji == Funkcja.standard) {
			ustawZwykleOkno();
		} else {
			console.log("Ustawiam rozszerzone");
			ustawOknoRozszezone();
		}

		switch(typFunkcji) {
			case Funkcja.cosinus:
				return {...stan, funkcja: Math.cos, typFunkcji: typFunkcji, zakresY: [-1, 1], autoSkala: false};
			case Funkcja.sinus:
				return {...stan, funkcja: Math.sin, typFunkcji: typFunkcji, zakresY: [-1, 1], autoSkala: false};
			case Funkcja.tangens:
				return {...stan, funkcja: Math.tan, typFunkcji: typFunkcji, zakresY: [-50, 50], autoSkala: false};
			case Funkcja.standard:
				return {...stan, funkcja: (x: number) => 1, typFunkcji: typFunkcji, zakresY: [0, 1], autoSkala: false};
			case Funkcja.kwadratowa:
				const funkcja = (x: number) => (stan.wspolczynniki[0] * x * x + stan.wspolczynniki[1] * x + stan.wspolczynniki[2]);
				return {...stan, funkcja: funkcja, typFunkcji: typFunkcji, zakresY: [0, 1], autoSkala: true};
		}

		return { ...stan, typFunkcji: typFunkcji};
	}
} as Akcja);

export const ZapiszWspolczynnik = () => ({
	type: "komenda",
	akcja: (stan: Store): Store => {
		console.log(stan.aktualnaLiczba);
		let wspolczynniki = stan.wspolczynniki;
		wspolczynniki[stan.kwadratowaIndeks] = Number(stan.aktualnaLiczba);
		let indeks = (stan.kwadratowaIndeks + 1) % 3;
		const funkcja = (x: number) => (stan.wspolczynniki[0] * x * x + stan.wspolczynniki[1] * x + stan.wspolczynniki[2]);
		return {...stan, kwadratowaIndeks: indeks, wspolczynniki: [...wspolczynniki], funkcja: funkcja} as Store
	}
} as Akcja);

export const historiaNaTekst = (historia: Etap[]) => (historia as any).reduce((stan: string, etap: Etap, i: any, p: any) => {
	if (etap.typEtapu == TypEtapu.liczba) {
		stan += String(sformatujNumer(String(etap.zawartosc as number))) + " ";
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



export const Reducer = (state: Store = new Store(), action: Akcja) => {
	if (action.type == "komenda") {
		return action.akcja(state);
	}
	else
		return state;
}

