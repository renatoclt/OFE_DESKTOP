import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Anulacion} from '../models/anulacion';

import {TipoDocumento} from '../models/tipo_documento';
import {Series} from '../models/series';
import 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class ResumenBajasService {

  private urlTipoDocumento = 'https://facturacion-b26e0.firebaseio.com/tipo-documentos.json';
  private urlSeries =  'https://facturacion-b26e0.firebaseio.com/series.json';

  private urlAnulacion =  'https://facturacion-b26e0.firebaseio.com/anulacion.json';


  anulaciones: Anulacion[];
  tipoDocumentos: TipoDocumento[];
  series: Series[];

  anulacionChanged: BehaviorSubject<Anulacion[]> = new BehaviorSubject<Anulacion[]>([]);
  serieChanged: BehaviorSubject<Series[]> = new BehaviorSubject<Series[]>([]);
  tipoDocumentoChanged: BehaviorSubject<TipoDocumento[]> = new BehaviorSubject<TipoDocumento[]>([]);


  constructor(private httpClient: HttpClient) {
    this.getAllanulacion();
    this.getTipoDocumento();
    this.getSerie();
  }

  addanulacion(anulacion: Anulacion) {
    if (this.anulaciones == null ) {
      anulacion.id = 0;
      this.anulaciones = [anulacion];
    }
    else  {
      anulacion.id = this.anulaciones.length + 1;
      this.anulaciones.push(anulacion);
    }
    this.anulacionChanged.next(this.anulaciones.slice());
   //  const fer = new HttpHeaders().set('Ocp-Apim-Subscription-Key', '07a12d074c714f62ab037bb2f88e30d3' );
    this.httpClient.put<Anulacion>(this.urlAnulacion, this.anulaciones , {
      observe: 'body',
      responseType: 'json',
      // headers: fer
    }).subscribe();

  }

  updateanulacion(anulacion: Anulacion) {
    this.anulaciones[this.anulaciones.findIndex(elementoAnulacion =>  elementoAnulacion.id === anulacion.id)] = anulacion;
    this.anulacionChanged.next(this.anulaciones.slice());
    this.httpClient.put(this.urlAnulacion, this.anulaciones, {
      observe: 'body',
      responseType: 'json'
    }).subscribe();
  }


   deleteanulacion(id: number) {
      this.anulaciones.splice(this.anulaciones.findIndex(itemAnulacion =>  itemAnulacion.id === id, 1), 1);
      this.anulacionChanged.next(this.anulaciones.slice());
      this.httpClient.put(this.urlAnulacion, this.anulaciones, {
        observe: 'body',
        responseType: 'json'
      }).subscribe();
    }


  getAllanulacion() {
    this.httpClient.get<Anulacion[]>(this.urlAnulacion).
    subscribe(
      (anulaciones) => {
        this.anulaciones = anulaciones;
        if (this.anulaciones)
          this.anulacionChanged.next(this.anulaciones.slice());
      }
    );
  }

  getAnulacion(id: number) {
    return this.anulaciones[this.anulaciones.findIndex(itemAnulacion =>  itemAnulacion.id === id)];
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
