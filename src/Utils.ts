import {remote} from "electron";

export function sformatujNumer(numer: string): string {
    const czyDodacKropke = numer.substr(numer.length - 1) == ".";

    let num = Number(numer);
    
    if (isNaN(num))
        return "Błąd";

    if (num == 0)
        return "0" + (czyDodacKropke ? "." : "");

    const wykladnik = Math.floor(Math.log10(Math.abs(num)));
    let sformatowanyNumer = "";

    if (Math.abs(wykladnik) < 3) {
        num = Math.round(1e3 * num) / 1e3;
        sformatowanyNumer = String(num);
    } else {
        num = num / Math.pow(10, wykladnik);
        num = Math.round(1e2 * num) / 1e2;

        if (isNaN(num))
            return "Błąd";

        sformatowanyNumer = String(num) + "e" + String(wykladnik);
    }

    sformatowanyNumer += czyDodacKropke ? "." : "";
    
    return sformatowanyNumer;
}

const height = 500;
const width = Math.round(height * 235 / 400);

export function ustawZwykleOkno() {
    remote.getCurrentWindow().setSize(width, height, false);
}

export function ustawOknoRozszezone() {
    remote.getCurrentWindow().setSize(width + height, height, false);
}