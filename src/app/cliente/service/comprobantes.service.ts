import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Timestamp} from 'rxjs/Rx';
import {error} from 'util';
import {Observable} from 'rxjs/Observable';
import {discardPeriodicTasks} from '@angular/core/testing';
import { BasePaginacion } from 'app/facturacion-electronica/general/services/base.paginacion';
import { Servidores } from 'app/facturacion-electronica/general/services/servidores';
import { SpinnerService } from 'app/cliente/service/spinner.service';
import { OCP_APIM_SUBSCRIPTION_KEY } from 'app/utils/app.constants';
import { RequestOptions } from '@angular/http';


@Injectable()
export class ComprobantesClienteService {
  public loading = false;
  public urlConsultaReferencias = '/referencias/search/comprobanteID';
  public urlConsultaQueryCliente = '/documento/queryinicio';
  private url_documento_query = '/documento/query';
  private url_documento = '/documento';

  private urlConsultaDocumentos = '/archivosmasivos';
  private consultaDocumentos = '/search';
  private filtro = '/filtros';

  public TIPO_ATRIBUTO_COMPROBANTES_QUERY = 'content';

  public TIPO_CONSULTA_RETENCION = 'consultaRetenciones';

  constructor(private httpClient: HttpClient,
              private servidores: Servidores,
              public paginacion: BasePaginacion,
              private _spinner: SpinnerService) {
    this.urlConsultaDocumentos = this.servidores.DOCUQRY + this.urlConsultaDocumentos + this.consultaDocumentos + this.filtro;
    this.url_documento_query = this.servidores.DOCUQRY + this.url_documento_query;
    this.urlConsultaQueryCliente = this.servidores.DOCUQRY + this.urlConsultaQueryCliente;
    this.urlConsultaReferencias = this.servidores.DOCUQRY + this.urlConsultaReferencias;
  }

  obtenerUrlDocumentoQuery() {
    return this.url_documento_query;
  }

  obtenerFecha(actualTimestamp: string): string {
    const dateConvertido = new Date(actualTimestamp);
    const dia = dateConvertido.getDate();
    const mes = dateConvertido.getMonth() + 1;
    const anio = dateConvertido.getFullYear();
    return anio + '-' + this.ponerCeros(mes, 2) + mes + '-' + this.ponerCeros(dia, 2) + dia;
  }

  ponerCeros(numero: number, cantidadZeros: number) {
    return '0'.repeat(cantidadZeros - numero.toString().length);
  }

  get<T>(parametros: HttpParams, url: string = this.urlConsultaQueryCliente,
    nombreKeyJson: string = this.TIPO_ATRIBUTO_COMPROBANTES_QUERY): BehaviorSubject<[BasePaginacion, T[]]> {

    // let headers = new HttpHeaders();
    // headers.append("Ocp-Apim-Subscription-Key", OCP_APIM_SUBSCRIPTION_KEY);
    // headers.append("Content-Type",'application/json');

    this._spinner.set(true);
    const that = this;
    const number = Number(url);
    if (number >= 0) {
      parametros = parametros.set('nroPagina', number.toString());
    } else {
      parametros = parametros.set('nroPagina', parametros.get('page'));
    }
    parametros = parametros.set('regXPagina', parametros.get('size'));
    parametros = parametros.delete('page');
    parametros = parametros.delete('size');
    parametros = parametros.delete('sort');
    const basePaginacion: BasePaginacion = new BasePaginacion();
    const dataRetornar: BehaviorSubject<[BasePaginacion, T[]]> = new BehaviorSubject<[BasePaginacion, T[]]>([basePaginacion, undefined]);
    this.httpClient.get<T[]>(this.urlConsultaQueryCliente, { 
      //headers: headers,
      params: parametros}
      ).take(1)
      .map(
        data => {
          // data['tsFechaemision'] = new Date(data['tsFechaemision']);
          data[nombreKeyJson].map(
            (item) => {
              item['tsFechaemision'] = that.obtenerFecha(item['tsFechaemision']);
              item['dePagomontopagado'] = Number(item['dePagomontopagado']).toFixed(2);
              item['deTotalcomprobantepago'] = Number(item['deTotalcomprobantepago']).toFixed(2);
              item['deDctomonto'] = Number(item['deDctomonto']).toFixed(2);
              if (item['tsParamFechabaja'] === null) {
                item['tsParamFechabaja'] = '-';
              }
            }
          );
          return data;
        },
      )
      .subscribe(
        (data) => {
          this._spinner.set(false);
          const totalPaginas = data['totalPages'] - 1;
          const paginaActual = data['number'];
          basePaginacion.pagina.next(paginaActual);
          basePaginacion.totalItems.next(data['totalElements']);
          basePaginacion.totalPaginas.next(totalPaginas);
          if ((paginaActual + 1) <= totalPaginas) {
            basePaginacion.next.next((paginaActual + 1).toString());
          } else {
            basePaginacion.next.next('');
          }
          basePaginacion.last.next((totalPaginas).toString());
          basePaginacion.first.next('0');
          if ((paginaActual - 1) >= 0) {
            basePaginacion.previous.next((paginaActual - 1).toString());
          } else {
            basePaginacion.previous.next('');
          }
          dataRetornar.next([basePaginacion, data[nombreKeyJson]]);
        },
        error => {
          this._spinner.set(false);
        });
    return dataRetornar;
  }

}
