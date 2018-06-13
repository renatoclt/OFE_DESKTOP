import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Servidores} from '../servidores';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {BasePaginacion} from '../base.paginacion';
import {SpinnerService} from '../../../../service/spinner.service';

@Injectable()
export class ReportesService {
  urlReportes: string;
  urlReportesEmisor: string;
  pathReporte: string;
  pathReporteEmisor: string;
  TIPO_ATRIBUTO_REPORTES_DOCUMENTO_POR_EMISOR = 'documentoEmisores';
  TIPO_ATRIBUTO_REPORTES_DOCUMENTO_POR_EMISOR_DETALLE = 'comprobantePagos';

  constructor(private httpClient: HttpClient,
              private servidores: Servidores,
              private _spinnerService: SpinnerService) {
    this.pathReporte = '/reporte';
    this.pathReporteEmisor = '/emisor';
    this.urlReportes = this.servidores.DOCUQRY + this.pathReporte;
    this.urlReportesEmisor = this.servidores.DOCUQRY + this.pathReporteEmisor;
  }

  get<T>(parametros: HttpParams, url: string = this.urlReportes, nombreKeyJson: string = this.TIPO_ATRIBUTO_REPORTES_DOCUMENTO_POR_EMISOR): BehaviorSubject<[BasePaginacion, T[]]> {
    this._spinnerService.set(true);
    const number = Number(url);
    if (number >= 0) {
      parametros = parametros.set('pagina', number.toString());
    } else {
      parametros = parametros.set('pagina', parametros.get('page'));
    }
    parametros = parametros.set('limite', parametros.get('size'));
    parametros = parametros.set('ordenar', parametros.get('sort').split(',')[0]);
    parametros = parametros.delete('page');
    parametros = parametros.delete('size');
    parametros = parametros.delete('sort');
    let nuevaUrl = '';
    if (nombreKeyJson === this.TIPO_ATRIBUTO_REPORTES_DOCUMENTO_POR_EMISOR_DETALLE) {
      nuevaUrl = this.urlReportesEmisor;
    } else {
      if (nombreKeyJson === this.TIPO_ATRIBUTO_REPORTES_DOCUMENTO_POR_EMISOR) {
        nuevaUrl = this.urlReportes;
      }
    }
    const basePaginacion: BasePaginacion = new BasePaginacion();
    const dataRetornar: BehaviorSubject<[BasePaginacion, T[]]> = new BehaviorSubject<[BasePaginacion, T[]]>([basePaginacion, undefined]);
    this.httpClient.get<T[]>(nuevaUrl, {params: parametros})
      .subscribe(
        (data) => {
          this._spinnerService.set(false);
          const totalPaginasAux = data['page']['totalPages'];
          const totalPaginas = totalPaginasAux > 0 ? totalPaginasAux - 1 : 0;
          const paginaActual = data['page']['number'];
          basePaginacion.pagina.next(paginaActual);
          basePaginacion.totalItems.next(data['page']['totalElements']);
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
          dataRetornar.next([basePaginacion, data['_embedded'][nombreKeyJson]]);
        },
        error => {
          this._spinnerService.set(false);
        });
    return dataRetornar;
  }
}
