import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Servidores } from '../../general/services/servidores';
import { ArchivoMasiva, ArchivoMasivaEntrada } from '../models/archivoMasiva';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BasePaginacion } from '../../general/services/base.paginacion';
import {SpinnerService} from "../../../service/spinner.service";

@Injectable()
export class PercepcionRetencionReferenciasService {
    public urlQry: string = '/referencias/search/comprobanteID';

    public TIPO_ATRIBUTO_DOCUMENTO_MASIVO: string = 'documentoMasivoes';
    public TIPO_ATRIBUTO_DETALLE_DOCUMENTO_MASIVO: string = 'detalleMasivoes';
    public TIPO_ATRIBUTO_REFERENCIAS: string = 'tDocReferenciEntities';

    constructor(private httpClient: HttpClient,
                private servidores: Servidores,
                private _spinner: SpinnerService) {
        this.urlQry = this.servidores.DOCUQRY + this.urlQry;
    }

    /*public get<T>(params: HttpParams, url: string = this.urlQry,
        nombreKeyJson: string = this.TIPO_ATRIBUTO_REFERENCIAS): BehaviorSubject<[BasePaginacion, T[]]> {
        const that = this;
        const basePaginacion: BasePaginacion = new BasePaginacion();
        const dataRetornar: BehaviorSubject<[BasePaginacion, T[]]> = new BehaviorSubject<[BasePaginacion, T[]]>([basePaginacion, []]);
        this.httpClient.get<T[]>(url, {
            params: params
        }).take(1)
            .map(
                data => {
                    // data['tsFechaemision'] = new Date(data['tsFechaemision']);
                    data['_embedded'][nombreKeyJson].map(
                    (item) => {
                        item['nuTotImpAux'] = Number(item['nuTotImpAux']).toFixed(2);

                    }
                    );

                    return data;
                }
            )
            .subscribe(
            (data) => {
                console.log(data);
                basePaginacion.pagina.next(data['page']['number']);
                basePaginacion.totalItems.next(data['page']['totalElements']);
                basePaginacion.totalPaginas.next(data['page']['totalPages'] - 1);
                if (data['_links']['next']) {
                    basePaginacion.next.next(data['_links']['next']['href']);
                } else {
                    basePaginacion.next.next('');
                }
                if (data['_links']['last']) {
                    basePaginacion.last.next(data['_links']['last']['href']);
                } else {
                    basePaginacion.last.next('');
                }
                if (data['_links']['first']) {
                    basePaginacion.first.next(data['_links']['first']['href']);
                } else {
                    basePaginacion.first.next('');
                }
                if (data['_links']['prev']) {
                    basePaginacion.previous.next(data['_links']['prev']['href']);
                } else {
                    basePaginacion.previous.next('');
                }
                console.log(data['_embedded'][nombreKeyJson]);
                dataRetornar.next([basePaginacion, data['_embedded'][nombreKeyJson]]);
            }
            );
        return dataRetornar;
    }*/

  get<T>(parametros: HttpParams, url: string = this.urlQry, nombreKeyJson: string = this.TIPO_ATRIBUTO_REFERENCIAS): BehaviorSubject<[BasePaginacion, T[]]> {
    const that = this;
    this._spinner.set(true);
    const number = Number(url);
    if (number >= 0 ) {
      parametros = parametros.set('page', number.toString());
    }
    const nuevaUrl = this.urlQry;

    const basePaginacion: BasePaginacion = new BasePaginacion();
    const dataRetornar: BehaviorSubject<[BasePaginacion, T[]]> = new BehaviorSubject<[BasePaginacion, T[]]>([basePaginacion, []]);
    this.httpClient.get<T[]>( nuevaUrl, {
      params: parametros
    }).take(1).
    subscribe(
      (data) => {
        this._spinner.set(false);
        const totalPaginas = data['page']['totalPages'] - 1;
        const paginaActual = data['page']['number'];

        basePaginacion.pagina.next( paginaActual );
        basePaginacion.totalItems.next(data['page']['totalElements']);
        basePaginacion.totalPaginas.next(totalPaginas);

        if ( (paginaActual + 1) <= totalPaginas) {
          basePaginacion.next.next((paginaActual + 1).toString());
        } else {
          basePaginacion.next.next('');
        }
        basePaginacion.last.next((totalPaginas).toString());
        basePaginacion.first.next('0');
        if ( (paginaActual - 1) >= 0) {
          basePaginacion.previous.next((paginaActual - 1).toString());
        } else {
          basePaginacion.previous.next('');
        }
        dataRetornar.next([basePaginacion, data['_embedded'][nombreKeyJson]]);
      }
    );
    return dataRetornar;
  }

}
