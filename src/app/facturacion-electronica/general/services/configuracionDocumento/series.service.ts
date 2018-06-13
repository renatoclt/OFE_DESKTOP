import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Servidores } from '../servidores';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Serie } from '../../models/configuracionDocumento/serie';
import {TiposService} from '../../utils/tipos.service';
import {BasePaginacion} from '../base.paginacion';
import {SpinnerService} from '../../../../service/spinner.service';
import {SeriesQuery} from '../../../configuracion/models/series-query';
import {SeriesCrear} from '../../../configuracion/models/series-crear';
import {TranslateService} from '@ngx-translate/core';

declare var swal: any;

@Injectable()
export class SeriesService {
//OFFLINE  private url = '/seriess/search/filtros';
  private pathSeries = '/seriess';
  private pathSearch = '/search';
  private pathFiltros = '/filtros';
  private pathFiltroSecundario = '/filtrossecundario';

  private urlFiltro: string;
  private urlFiltroSecundario: string;
  private urlSerieQueries: string;
  private urlSeriess: string;

  TIPO_ATRIBUTO_SERIES: string;


  constructor(private httpClient: HttpClient,
              private _tipos: TiposService,
              private servidores: Servidores,
              private _translateService: TranslateService,
              private _spinnerService: SpinnerService) {
    this.TIPO_ATRIBUTO_SERIES = 'serieQueries';
    this.urlSeriess = this.servidores.ORGAQRY + this.pathSeries;
    this.urlSerieQueries = this.servidores.ORGAQRY + this.pathSeries + this.pathSearch + this.pathFiltros;
    this.urlFiltro = this.servidores.HOSTLOCAL + this.pathSeries + this.pathSearch + this.pathFiltros;
    this.urlFiltroSecundario = this.servidores.HOSTLOCAL + this.pathSeries + this.pathSearch + this.pathFiltroSecundario;
  }

  private buscar(parametros: HttpParams, url: string): BehaviorSubject<Serie[]> {
    const series: BehaviorSubject<Serie[]> = new BehaviorSubject<Serie[]>([]);
    this.httpClient.get(url, {
      params: parametros
    }).subscribe(
      data => {
        series.next(data['_embedded']['serieRedises']);
      }
    );

      return series;
    }

  filtroSeries(
      id_entidad: string,
      id_tipo_comprobante: string,
      id_tipo_serie: string,
  ): BehaviorSubject<any[]> {
      const parametros = new HttpParams()
          .set('id_entidad', id_entidad)
          .set('id_tipo_comprobante', id_tipo_comprobante)
          .set('id_tipo_serie', id_tipo_serie);
      return this.buscar(parametros, this.urlFiltro);
  }

  filtroSecundarioSeries(id_entidad: string,
                         id_tipo_comprobante: string,): BehaviorSubject<any[]> {
    const parametros = new HttpParams()
      .set('id_entidad', id_entidad)
      .set('id_tipo_comprobante', id_tipo_comprobante)
    return this.buscar(parametros, this.urlFiltroSecundario);
  }

  obtenerTodo(): BehaviorSubject<Serie[]> {
      const series: BehaviorSubject<Serie[]> = new BehaviorSubject<Serie[]>([]);
      this.httpClient.get(this.urlFiltro).subscribe(
          data => {
              series.next(data['_embedded']['serieRedises']);
          }
      );

    return series;
  }

  filtrarSeriesPorIdTipoComprobante(listaItems: BehaviorSubject<Serie[]>, idTipoComprobante: string): BehaviorSubject<Serie[]> {
    const listaNuevaItems = new BehaviorSubject<Serie[]>([]);
    listaItems.map(
      items => items.filter(item => {
        let comienzoLetra = '';
        switch (idTipoComprobante) {
          case this._tipos.TIPO_DOCUMENTO_FACTURA:
            comienzoLetra = 'F';
            break;
          case this._tipos.TIPO_DOCUMENTO_BOLETA:
            comienzoLetra = 'B';
            break;
        }
        return item.serie[0] === comienzoLetra;
      })
    ).subscribe(
      data => {
        listaNuevaItems.next(data);
      }
    );
    return listaNuevaItems;
  }

  get<T>(parametros: HttpParams, url: string = this.urlSerieQueries, nombreKeyJson: string = this.TIPO_ATRIBUTO_SERIES): BehaviorSubject<[BasePaginacion, T[]]> {
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
    if (nombreKeyJson === this.TIPO_ATRIBUTO_SERIES) {
      nuevaUrl = this.urlSerieQueries;
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

  crearSerie(serie: SeriesCrear) {
    this._spinnerService.set(true);
    const respuesta = new BehaviorSubject<SeriesQuery>(null);
    this.httpClient.post<SeriesQuery>(this.urlSeriess, JSON.stringify(serie)).subscribe(
      data => {
        this._spinnerService.set(true);
        let accionExitosa = '';
        this._translateService.get('accionExitosa').take(1).subscribe(nombre => accionExitosa = nombre);
        let mensajeCreacionSerie = '';
        this._translateService.get('mensajeCreacionSerie').take(1).subscribe(nombre => mensajeCreacionSerie = nombre);
        let continuar = '';
        this._translateService.get('continuar').take(1).subscribe(nombre => continuar = nombre);
        swal({
          type: 'success',
          title: accionExitosa,
          html:
          '<div class="text-center">' + mensajeCreacionSerie + '</div>',
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: continuar,
          buttonsStyling: false
        });
        respuesta.next(data);
      },
      error => {
        this._spinnerService.set(true);
        let errorSerie = '';
        respuesta.error(error);
        this._translateService.get('errorSerie').take(1).subscribe(nombre => errorSerie = nombre);
        let continuar = '';
        this._translateService.get('continuar').take(1).subscribe(nombre => continuar = nombre);
        swal({
          type: 'error',
          title: errorSerie,
          confirmButtonClass: 'btn btn-danger',
          confirmButtonText: continuar,
          buttonsStyling: false
        });

      }
    );
  }

  actualizarSerie(serie: SeriesQuery) {
    this._spinnerService.set(true);
    const respuesta = new BehaviorSubject<SeriesQuery>(null);
    this.httpClient.post<SeriesQuery>(this.urlSeriess, JSON.stringify(serie)).subscribe(
      data => {
        this._spinnerService.set(true);
        let accionExitosa = '';
        this._translateService.get('accionExitosa').take(1).subscribe(nombre => accionExitosa = nombre);
        let mensajeActualizarSerie = '';
        this._translateService.get('mensajeActualizarSerie').take(1).subscribe(nombre => mensajeActualizarSerie = nombre);
        let continuar = '';
        this._translateService.get('continuar').take(1).subscribe(nombre => continuar = nombre);
        respuesta.next(data);
        swal({
          type: 'success',
          title: accionExitosa,
          html:
          '<div class="text-center">' + mensajeActualizarSerie + '</div>',
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: continuar,
          buttonsStyling: false
        });
      },
      error => {
        this._spinnerService.set(true);
        respuesta.error(error);
        let errorSerie = '';
        this._translateService.get('errorSerie').take(1).subscribe(nombre => errorSerie = nombre);
        let continuar = '';
        this._translateService.get('continuar').take(1).subscribe(nombre => continuar = nombre);
        swal({
          type: 'error',
          title: errorSerie,
          confirmButtonClass: 'btn btn-danger',
          confirmButtonText: continuar,
          buttonsStyling: false
        });

      }
    );
    return respuesta;
  }
}
