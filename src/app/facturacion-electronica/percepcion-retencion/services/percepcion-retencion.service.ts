import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TipoDocumento} from '../models/tipo_documento';
import {Series} from '../models/series';
import 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Tipodocretenpercep} from '../models/tipodocretenpercep';

@Injectable()
export class PercepcionRetencionService {

  private urlTipoDocumento = 'https://facturacion-b26e0.firebaseio.com/tipo-documentos.json';
  private urlSeries =  'https://facturacion-b26e0.firebaseio.com/series.json';
  private urlComprobantes =  'https://facturacion-b26e0.firebaseio.com/comprobantes.json';
  private urlAnulacion =  'https://facturacion-b26e0.firebaseio.com/anulacion.json';
  private urlTdocRP = 'https://facturacion-b26e0.firebaseio.com/tipo_documento_rp.json';

  tipoDocumentos: TipoDocumento[];
  series: Series[];
  tipodocrp: Tipodocretenpercep[];

  serieChanged: BehaviorSubject<Series[]> = new BehaviorSubject<Series[]>([]);
  tipoDocumentoChanged: BehaviorSubject<TipoDocumento[]> = new BehaviorSubject<TipoDocumento[]>([]);
  tipodocuRPChanged: BehaviorSubject<Tipodocretenpercep[]> = new BehaviorSubject<Tipodocretenpercep[]>([]);

  constructor(private httpClient: HttpClient) {
    this.getTipoDocumento();
    this.getSerie();
    this.getTipoDocRP();
  }
  getSerie() {
    this.getTipos(this.urlSeries).
    subscribe(
      (tipos: any[]) => {
        this.series = tipos;
        this.serieChanged.next(tipos.slice());
      }
    );

  }
  getTipoDocRP() {
    this.getTipos(this.urlTdocRP).
    subscribe(
      (tipos: any[]) => {
        this.tipodocrp = tipos;
        this.tipoDocumentoChanged.next(tipos.slice());
      }
    );

  }
  getTipoDocumento() {
    this.getTipos(this.urlTipoDocumento).
    subscribe(
      (tipos: any[]) => {
        this.tipoDocumentos = tipos;
        this.tipoDocumentoChanged.next(tipos.slice());
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
