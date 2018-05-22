import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Series } from '../models/models';
import { UnidadMedida } from '../models/unidadMedida';
import { TipoPrecioVenta } from '../models/tipoPrecioVenta';
import { CalculoIsc } from '../models/calculoIsc';
import { Igv } from '../models/igv';

@Injectable()
export class ComprobanteProductosService {

    private urlUnidadMedida = 'https://facturacion-cb377.firebaseio.com/unidadMedida.json';
    private urlTipoPrecioVenta = 'https://facturacion-cb377.firebaseio.com/tipoPrecioVentaUnitario.json';
    public urlCalculoIsc = 'https://facturacion-cb377.firebaseio.com/isc.json';
    public urlIgv = 'https://facturacion-cb377.firebaseio.com/igv.json';

    public unidadMedida: UnidadMedida[];
    public tipoPrecioVenta: TipoPrecioVenta[];
    public calculoIsc: CalculoIsc[];
    public igv: Igv[];

    public unidadMedidaChanged: BehaviorSubject<UnidadMedida[]> = new BehaviorSubject<UnidadMedida[]>([]);
    public tipoPrecioVentaChanged: BehaviorSubject<TipoPrecioVenta[]> = new BehaviorSubject<TipoPrecioVenta[]>([]);
    public calculoIscChanged: BehaviorSubject<CalculoIsc[]> = new BehaviorSubject<CalculoIsc[]>([]);
    public igvChanged: BehaviorSubject<Igv[]> = new BehaviorSubject<Igv[]>([]);


    constructor(private httpClient: HttpClient) {
        this.getUnidadMedida();
        this.getTipoPrecioVenta();
        this.getCalculoIsc();
        this.getIgv();
    }
    public getUnidadMedida() {
        this.getTipos(this.urlUnidadMedida).
        subscribe(
            (data: any[]) => {
                this.unidadMedida = data;
                this.unidadMedidaChanged.next(data.slice());
            }
        );
    }
    public getTipoPrecioVenta() {
      this.getTipos( this.urlTipoPrecioVenta ).
      subscribe(
          (data: any[]) => {
              this.tipoPrecioVenta = data;
              this.tipoPrecioVentaChanged.next( data.slice() );
          }
      );
    }
    public getCalculoIsc() {
      this.getTipos( this.urlCalculoIsc )
      .subscribe(
        ( data: CalculoIsc[] ) => {
          this.calculoIsc = data;
          this.calculoIscChanged.next( data.slice() );
        }
      );
    }
    public getIgv() {
      this.getTipos( this.urlIgv )
      .subscribe(
        ( data: Igv[] ) => {
          this.igv = data;
          this.igvChanged.next( data.slice() );
        }
      );
    }
    getTipos(url: string) {
        return this.httpClient.get<any[]>(url, {
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
