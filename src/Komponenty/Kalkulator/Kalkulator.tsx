import * as ReactDOM from "react-dom";
import * as React from "react";
import { Dispatch, connect, Provider } from "react-redux"
import { AnyAction, createStore, Action } from "redux"
import { Store, Reducer } from "../../Store"
import * as Akcje from "../../Store";
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

import "./Kalkulator.scss";
import {sformatujNumer} from "../../Utils";

class PasekGorny extends React.Component {
    public render() {
        return (
            <div id="pasek-gorny">
                <Icon iconName='CollapseMenu' className='ikona ikona-lewo' />
                <h2>Standard</h2>
                <Icon iconName='History' className='ikona ikona-prawo' />
            </div>);
    }
}

interface EkranWlasciwosci {
    liczba: string;
    aktualnyWynik: number;
    czyKwadratowa: boolean;
    historia: Akcje.Etap[];
    wspolczynniki: [number, number, number]
}

class _Ekran extends React.Component<EkranWlasciwosci> {
    public render() {
        let { liczba, historia, aktualnyWynik } = this.props;

        if (liczba == "")
            liczba = String(aktualnyWynik);

        let wyswietlenieHistorii = Akcje.historiaNaTekst(historia);
        if (this.props.czyKwadratowa) {
            let a = sformatujNumer(String(this.props.wspolczynniki[0]));
            let b = sformatujNumer(String(this.props.wspolczynniki[1]));
            let c = sformatujNumer(String(this.props.wspolczynniki[2]));
            wyswietlenieHistorii = "y = " + a + "x^2 + " + b + "x + " + c;
        }

        return <div id="ekran">
            <p className="historia">{wyswietlenieHistorii}</p>
            <p className="glowna">{sformatujNumer(liczba)}</p>
        </div>
    }
}

const ekranMapDispatchToProps = (stan: Akcje.Store) => ({
    liczba: stan.aktualnaLiczba,
    aktualnyWynik: stan.aktualnyWynik,
    historia: stan.historia,
    czyKwadratowa: stan.typFunkcji == Akcje.Funkcja.kwadratowa,
    wspolczynniki: stan.wspolczynniki
});

const Ekran = connect(ekranMapDispatchToProps)(_Ekran);

interface PasekPamieciWlasciwosci {
    typFunkcji: Akcje.Funkcja;
    ustawSinus: () => any;
    ustawTangens: () => any;
    ustawStandard: () => any;
    ustawCosinus: () => any;
    ustawKwadratowa: () => any;
    zapiszWspolczynnik: () => any;
}

class _PasekPamieci extends React.Component<PasekPamieciWlasciwosci> {
    public render() {
        return <div id="pasek-pamieci">
            <DefaultButton
                data-automation-id='test'
                disabled={false}
                checked={false}
                text='sin'
                className="przycisk-pamieci"
                onClick={this.props.ustawSinus}
            />
            <DefaultButton
                data-automation-id='test'
                disabled={false}
                checked={false}
                text='cos'
                className="przycisk-pamieci"
                onClick={this.props.ustawCosinus}
            />
            <DefaultButton
                data-automation-id='test'
                disabled={false}
                checked={false}
                text='tg'
                className="przycisk-pamieci"
                onClick={this.props.ustawTangens}
            />
            <DefaultButton
                data-automation-id='test'
                disabled={false}
                checked={false}
                text='std'
                className="przycisk-pamieci"
                onClick={this.props.ustawStandard}
            />
            <DefaultButton
                data-automation-id='test'
                disabled={false}
                checked={false}
                text={this.props.typFunkcji == Akcje.Funkcja.kwadratowa ? "Zapisz" : "Kwadratowa"}
                className="przycisk-pamieci"
                onClick={this.props.typFunkcji == Akcje.Funkcja.kwadratowa ? this.props.zapiszWspolczynnik : this.props.ustawKwadratowa }
            />
        </div>
    }
}

const pasekPamieciMapStateToProps = (state: Store) => ({
    typFunkcji: state.typFunkcji
});

const pasekPamieciMapDispatchToProps = (dispatch: Dispatch) => ({
    ustawSinus: () => dispatch(Akcje.UstawFunkcje(Akcje.Funkcja.sinus)),
    ustawTangens: () => dispatch(Akcje.UstawFunkcje(Akcje.Funkcja.tangens)),
    ustawCosinus: () => dispatch(Akcje.UstawFunkcje(Akcje.Funkcja.cosinus)),
    ustawStandard: () => dispatch(Akcje.UstawFunkcje(Akcje.Funkcja.standard)),
    ustawKwadratowa: () => dispatch(Akcje.UstawFunkcje(Akcje.Funkcja.kwadratowa)),
    zapiszWspolczynnik: () => dispatch(Akcje.ZapiszWspolczynnik())
});

export const PasekPamieci = connect(pasekPamieciMapStateToProps, pasekPamieciMapDispatchToProps)(_PasekPamieci);

interface KlawiaturaWlasciwosci {
    dodajCyfre: (cyfra: string) => any;
    dodajKropke: () => any;
    dodajEtap: (etap: Akcje.Etap) => any;
    podlicz: () => any;
    zmienZnak: () => any;
    wyczyscWszystko: () => any;
    usunSymbol: () => any;
    usunLiczbe: () => any;
    nalozPierwiastek: () => any;
    nalozKwadrat: () => any;
    nalozInwersje: () => any;
    podzielNa100: () => any;
}

class _Klawiatura extends React.Component<KlawiaturaWlasciwosci> {
    public render() {
        const { dodajCyfre, dodajEtap, dodajKropke, podlicz, wyczyscWszystko, zmienZnak, usunLiczbe, usunSymbol, nalozPierwiastek, nalozInwersje, nalozKwadrat, podzielNa100 } = this.props;

        const rzedy = [
            [
                {
                    ikona: "%",
                    akcja: () => podzielNa100()
                },
                {
                    ikona: "√",
                    akcja: () => nalozPierwiastek()
                },
                {
                    ikona: "x²",
                    akcja: () => nalozKwadrat()
                },
                {
                    ikona: "1/x",
                    akcja: () => nalozInwersje()
                },
            ],
            [
                {
                    ikona: "CE",
                    akcja: () => wyczyscWszystko()
                },
                {
                    ikona: "C",
                    akcja: () => usunLiczbe()
                },
                {
                    ikona: "⌫",
                    akcja: () => usunSymbol()
                },
                {
                    ikona: "/",
                    akcja: () => dodajEtap({ typEtapu: Akcje.TypEtapu.operacja, zawartosc: Akcje.Operacja.dzielenie })
                },
            ],
            [
                {
                    ikona: "7",
                    akcja: () => dodajCyfre("7")
                },
                {
                    ikona: "8",
                    akcja: () => dodajCyfre("8")
                },
                {
                    ikona: "9",
                    akcja: () => dodajCyfre("9")
                },
                {
                    ikona: "X",
                    akcja: () => dodajEtap({ typEtapu: Akcje.TypEtapu.operacja, zawartosc: Akcje.Operacja.mnozenie })
                },
            ],
            [
                {
                    ikona: "4",
                    akcja: () => dodajCyfre("4")
                },
                {
                    ikona: "5",
                    akcja: () => dodajCyfre("5")
                },
                {
                    ikona: "6",
                    akcja: () => dodajCyfre("6")
                },
                {
                    ikona: "-",
                    akcja: () => dodajEtap({ typEtapu: Akcje.TypEtapu.operacja, zawartosc: Akcje.Operacja.odejmowanie })
                },
            ],
            [
                {
                    ikona: "1",
                    akcja: () => dodajCyfre("1")
                },
                {
                    ikona: "2",
                    akcja: () => dodajCyfre("2")
                },
                {
                    ikona: "3",
                    akcja: () => dodajCyfre("3")
                },
                {
                    ikona: "+",
                    akcja: () => dodajEtap({ typEtapu: Akcje.TypEtapu.operacja, zawartosc: Akcje.Operacja.dodawanie })
                },
            ],
            [
                {
                    ikona: "±",
                    akcja: () => zmienZnak()
                },
                {
                    ikona: "0",
                    akcja: () => dodajCyfre("0")
                },
                {
                    ikona: ".",
                    akcja: () => dodajKropke()
                },
                {
                    ikona: "=",
                    akcja: () => podlicz()
                },
            ],
        ];

        const rendery = rzedy.map(rzad => <div className="rzad">{rzad.map(przycisk => <DefaultButton
            disabled={false}
            checked={false}
            onClick={przycisk.akcja}
            text={przycisk.ikona}
            className="przycisk-klawiatury"
        />)}</div>)

        return <div id="klawiatura">
            {rendery}
        </div>
    }
}

let mapDispatchToProps = (dispatch: Dispatch) => ({
    dodajCyfre: (cyfra: string) => dispatch(Akcje.DodajCyfre(cyfra)),
    dodajKropke: () => dispatch(Akcje.DodajKropke()),
    dodajEtap: (etap: Akcje.Etap) => dispatch(Akcje.DodajEtap(etap)),
    podlicz: () => dispatch(Akcje.Podlicz()),
    zmienZnak: () => dispatch(Akcje.ZmienZnak()),
    wyczyscWszystko: () => dispatch(Akcje.WyczyscWszystko()),
    usunSymbol: () => dispatch(Akcje.UsunSymbol()),
    usunLiczbe: () => dispatch(Akcje.UsunLiczbe()),
    nalozPierwiastek: () => dispatch(Akcje.NalozPierwiastek()),
    nalozKwadrat: () => dispatch(Akcje.NalozKwadrat()),
    nalozInwersje: () => dispatch(Akcje.NalozInwersje()),
    podzielNa100: () => dispatch(Akcje.PodzielNa100()),
});

let mapStateToProps = (state: Akcje.Store) => ({

});

export const Klawiatura = connect(mapStateToProps, mapDispatchToProps)(_Klawiatura);

export class Kalkulator extends React.Component {
    public render() {
        return <div id="kalkulator">
            <PasekGorny />
            <Ekran />
            <PasekPamieci />
            <Klawiatura />
        </div>
    }
}