import { Injectable } from '@angular/core';
import { Serie } from '../models/serie';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { Moneda } from '../models/moneda';

@Injectable()

export class ComprobanteFacturaService {
    // urls
    private urlSeries = 'https://facturacion-cb377.firebaseio.com/serie.json';
    private urlMoneda = 'https://facturacion-cb377.firebaseio.com/moneda.json';
    
    // modelos
    public series: Serie[];
    public monedas: Moneda[];

    // Observadores
    public seriesChanged: BehaviorSubject<Serie[]> = new BehaviorSubject<Serie[]>([]);
    public monedasChanged: BehaviorSubject<Moneda[]> = new BehaviorSubject<Moneda[]>([]);

    constructor( private _httpClient: HttpClient ) {
        this.getSeries();
        this.getMonedas();
    }

    public getSeries() {
        this.getTipos(this.urlSeries).subscribe(
            ( data: any[] ) => {
                this.series = data;
                this.seriesChanged.next(data.slice());
            }
        );
    }
    public getMonedas() {
        this.getTipos(this.urlMoneda).subscribe(
            ( data: any[] ) => {
                this.monedas = data;
                this.monedasChanged.next(data.slice());
            }
        );
    }

    getTipos(url: string) {
        return this._httpClient.get<any[]>(url, {
            observe: 'body',
            responseType: 'json'
        }).
        map(
            (tipos) => {
                return tipos;
            }
        );
    }
}
