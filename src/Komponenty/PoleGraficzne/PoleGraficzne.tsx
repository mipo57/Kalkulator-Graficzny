import * as ReactDOM from "react-dom";
import * as React from "react";
import { Dispatch, connect, Provider } from "react-redux"
import { AnyAction, createStore, Action } from "redux"
import { Store, Reducer } from "../../Store"
import * as Akcje from "../../Store";
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import * as _ from "lodash"

import "./PoleGraficzne.scss";
import {sformatujNumer} from "../../Utils";

let zakres = (poczatek: number, koniec: number, iloscPunktow: number) => {
    return Array.from(Array(iloscPunktow).keys()).map( x => (koniec - poczatek) / (iloscPunktow-1) * x + poczatek );
}

let formatujNumerOsi = (x: number) => {
    let wynik = Math.round(x * 100) / 100;

    return String(wynik);
}

class Wykres {
    private MARGINESY = {
        gora: 40,
        prawo: 40,
        dol: 40,
        lewo: 80
    };

    private plotnoDOM: HTMLCanvasElement;
    private szerokosc: number;
    private wysokosc: number;
    private plotno: CanvasRenderingContext2D;
    private zakresX: [number, number];
    private zakresY: [number, number];
    private funkcja: (x: number) => number;
    private wartosc_maks: number;
    private wartosc_min: number;
    private xs_funkcji: number[];
    private ys_funkcji: number[];
    
    public ustawZakresX(poczatek: number, koniec: number) {
        this.zakresX = [poczatek, koniec];
    }

    public ustawZakresY(poczatek: number, koniec: number) {
        this.zakresY = [poczatek, koniec];
    }

    public ustawFunkcje(f: (x: number) => number, ustawZakresY = false) {
        if (this.wysokosc <= 0 || this.szerokosc <= 0)
            return; 
            
        this.funkcja = f;

        let argumenty = zakres(this.zakresX[0], this.zakresX[1], this.szerokosc);
        let wartosci = argumenty.map( this.funkcja )
        let wartosc_najwieksza = wartosci.reduce( (p, c, i, a) => Math.max(p, c));
        let wartosc_najmniejsza = wartosci.reduce( (p, c, i, a) => Math.min(p, c));

        if (ustawZakresY)
            this.zakresY = [wartosc_najmniejsza, wartosc_najwieksza];

        this.xs_funkcji = argumenty.map( x => this.pozycjaX(x));
        this.ys_funkcji = wartosci.map( x => this.pozycjaY(x));
    }

    public zauktualizujRozmiary() {
        this.szerokosc = this.plotnoDOM.clientWidth;
        this.wysokosc = this.plotnoDOM.clientHeight;
        this.plotnoDOM.setAttribute("width", String(this.szerokosc) + "px");
        this.plotnoDOM.setAttribute("height", String(this.wysokosc) + "px");
        this.plotno = this.plotnoDOM.getContext("2d");
    }

    public pozycjaX(x: number) {
        return this.MARGINESY.lewo + this.szerokoscRobocza() / (this.zakresX[1] - this.zakresX[0]) * (x - this.zakresX[0]);
    }

    public pozycjaY(y: number) {
        return this.wysokosc - (this.MARGINESY.dol + this.wysokoscRobocza() / (this.zakresY[1] - this.zakresY[0]) * (y - this.zakresY[0]));
    }

    public wysokoscRobocza() {
        return this.wysokosc - this.MARGINESY.gora - this.MARGINESY.dol;
    }

    public szerokoscRobocza() {
        return this.szerokosc - this.MARGINESY.lewo - this.MARGINESY.prawo;
    }

    public narysujFunkcje(): void {
        if (this.wysokosc <= 0 || this.szerokosc <= 0)
            return; 

        this.plotno.beginPath();
        this.plotno.moveTo(this.xs_funkcji[0], this.ys_funkcji[0]);
        _.zip(this.xs_funkcji, this.ys_funkcji).map( (wspolrzedne, i) => {
            if (wspolrzedne[1] > this.MARGINESY.gora && wspolrzedne[1] < this.wysokosc - this.MARGINESY.dol)
                this.plotno.lineTo(wspolrzedne[0], wspolrzedne[1]);
            else
                this.plotno.moveTo(wspolrzedne[0], wspolrzedne[1]);
        });
        this.plotno.stroke(); 
    }

    public narysujOsie() {
        if (this.wysokosc <= 0 || this.szerokosc <= 0)
            return; 

        let poczatek_x = this.MARGINESY.lewo;
        let poczatek_y = this.wysokosc - this.MARGINESY.dol;
        let koniec_x = this.szerokosc - this.MARGINESY.prawo;
        let koniec_y = this.MARGINESY.gora;
        // OSIE
        this.plotno.beginPath();
        this.plotno.moveTo(poczatek_x, poczatek_y);
        this.plotno.lineTo(poczatek_x, koniec_y);
        this.plotno.moveTo(poczatek_x, poczatek_y);
        this.plotno.lineTo(koniec_x, poczatek_y);
        this.plotno.stroke();

        // PODPISY
        this.plotno.fillStyle="rgba(0,0,0,0.7)";
        let ilosc_y = 10;
        zakres(this.zakresY[0], this.zakresY[1], ilosc_y).map( (v, i) => {
            const tekst = formatujNumerOsi(v);

            let y = this.wysokoscRobocza() / (ilosc_y - 1) * (ilosc_y - i - 1) + this.MARGINESY.gora;  
            let x = this.MARGINESY.lewo - this.plotno.measureText(tekst).width - 8;
            this.plotno.fillText(tekst, x, y);
        });
        let ilosc_x = 10;
        zakres(this.zakresX[0], this.zakresX[1], ilosc_x).map( (v, i) => {
            const tekst = formatujNumerOsi(v);
            let x = this.MARGINESY.lewo + this.szerokoscRobocza() / (ilosc_x - 1) * i;  
            let y = this.wysokosc - this.MARGINESY.dol + 12;
            this.plotno.fillText(tekst, x, y);
        });
        this.plotno.fillStyle="rgba(0,0,0,1)"
    }

    public zaznaczPunkt(x: number, y: number) {
        if (this.wysokosc <= 0 || this.szerokosc <= 0)
            return; 

        // Punkt
        this.plotno.beginPath();
        this.plotno.arc(this.pozycjaX(x), this.pozycjaY(y), 3, 0, 2 * Math.PI, false);
        this.plotno.fillStyle = 'black';
        this.plotno.fill();
        this.plotno.lineWidth = 1;
        this.plotno.strokeStyle = 'black';
        this.plotno.stroke();

        // Rzutowania
        this.plotno.beginPath();
        this.plotno.setLineDash([5, 15]);
        this.plotno.moveTo(this.pozycjaX(x), this.pozycjaY(y));
        this.plotno.lineTo(this.pozycjaX(x), this.wysokosc - this.MARGINESY.dol);
        this.plotno.moveTo(this.pozycjaX(x), this.pozycjaY(y));
        this.plotno.lineTo(this.MARGINESY.lewo, this.pozycjaY(y));
        this.plotno.stroke();
        this.plotno.setLineDash([])

        // Podpisy
        this.plotno.font = "bold 1.3rem " + this.plotno.font.split(' ')[-1];
        this.plotno.fillText(formatujNumerOsi(y), this.MARGINESY.lewo + 10, this.pozycjaY(y) - 10)
        this.plotno.fillText(formatujNumerOsi(x), this.pozycjaX(x) + 10, this.wysokosc - this.MARGINESY.dol - 10)
        this.plotno.font = "1rem " + this.plotno.font.split(' ')[-1];;
    }

    constructor(id: string) {
        this.plotnoDOM = document.getElementById("pole-graficzne") as HTMLCanvasElement;
        this.zauktualizujRozmiary();
    }
}

interface Wlasciwosci {
    zakresX: [number, number];
    zakresY: [number, number];
    typFunkcji: Akcje.Funkcja;
    funkcja: (x: number) => number;
    wartosc: number;
    autoSkala: boolean;
}

class _PoleGraficzne extends React.Component<Wlasciwosci> {
    public render() {
        return <canvas id="pole-graficzne"></canvas>
    }

    private narysujWykres() {

        if (this.props.typFunkcji != Akcje.Funkcja.standard) {
            const funkcja = this.props.funkcja;
            let wykres = new Wykres("pole-graficzne");
            wykres.ustawZakresX(this.props.wartosc - Math.PI, this.props.wartosc + Math.PI);
            wykres.ustawZakresY(this.props.zakresY[0], this.props.zakresY[1]);
            wykres.ustawFunkcje(funkcja, this.props.autoSkala);
            wykres.narysujOsie();
            wykres.narysujFunkcje();
            wykres.zaznaczPunkt(this.props.wartosc, funkcja(this.props.wartosc));
        }
    }

    public componentDidMount() {
        this.narysujWykres();
        window.addEventListener("resize", () => {
            this.narysujWykres();
        });
    }

    public componentDidUpdate() {
        this.narysujWykres();
    }
}

const mapStateToProps = (stan: Store) => ({
    wartosc: Number(stan.aktualnaLiczba),
    typFunkcji: stan.typFunkcji,
    funkcja: stan.funkcja,
    zakresX: stan.zakres,
    zakresY: stan.zakresY,
    autoSkala: stan.autoSkala
});

export const PoleGraficzne = connect(mapStateToProps)(_PoleGraficzne);