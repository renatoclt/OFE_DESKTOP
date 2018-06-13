import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Servidores} from '../../general/services/servidores';
import {ArchivoMasiva, ArchivoMasivaEntrada} from '../models/archivoMasiva';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {BasePaginacion} from '../../general/services/base.paginacion';
import {SpinnerService} from "../../../service/spinner.service";
import {errorObject} from "rxjs/util/errorObject";
import {TranslateService} from '@ngx-translate/core';
declare var $, swal: any;

@Injectable()
export class ArchivoMasivaService {
  public urlCmd: string = '/retenciones-masivas';
  public urlQry: string  = '/archivosmasivos/search/filtros';
  public urlQryDetalleMasivo: string = '/detallearchivosmasivos/search/filtros';

  public TIPO_ATRIBUTO_DOCUMENTO_MASIVO: string = 'documentoMasivoes';
  public TIPO_ATRIBUTO_DETALLE_DOCUMENTO_MASIVO: string = 'detalleMasivoes';

  constructor( private httpClient: HttpClient,
               private servidores: Servidores,
               private _spinner: SpinnerService,
               private _translateService: TranslateService) {
    this.urlCmd = this.servidores.DOCUCMD + this.urlCmd;
    this.urlQry = this.servidores.DOCUQRY + this.urlQry;
    this.urlQryDetalleMasivo = this.servidores.DOCUQRY + this.urlQryDetalleMasivo;
  }

  crearArchivoMasiva(archivoMasivaEntrada: ArchivoMasivaEntrada): BehaviorSubject<boolean> {
    let mensaje: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    this._spinner.set(true);

    this.httpClient.post<ArchivoMasiva>(this.urlCmd, archivoMasivaEntrada).subscribe(
      data => {
        this._spinner.set(false);
        let tituloCargaExitosaMasivas = '';
        this._translateService.get('tituloCargaExitosaMasivas').take(1).subscribe(data => tituloCargaExitosaMasivas = data);
        let tituloCargaConErroresMasivas = '';
        this._translateService.get('tituloCargaConErroresMasivas').take(1).subscribe(data => tituloCargaConErroresMasivas = data);
        let mensajeCargarExitosaMasivas = '';
        this._translateService.get('mensajeCargarExitosaMasivas').take(1).subscribe(data => mensajeCargarExitosaMasivas = data);
        let mensajeCargarConErroresMasivas = '';
        this._translateService.get('mensajeCargarConErroresMasivas').take(1).subscribe(data => mensajeCargarConErroresMasivas = data);
        let siText = '';
        this._translateService.get('continuar').take(1).subscribe(data => siText = data);
        if (data) {
          if (data.ticket === '-') {
            swal({
              title: tituloCargaConErroresMasivas,
              text: mensajeCargarConErroresMasivas,
              type: 'warning',
              confirmButtonClass: 'btn btn-success',
              confirmButtonText: siText,
              buttonsStyling: false,
            });
          } else {
            swal({
              title: tituloCargaExitosaMasivas,
              text: mensajeCargarExitosaMasivas,
              type: 'success',
              confirmButtonClass: 'btn btn-success',
              confirmButtonText: siText,
              buttonsStyling: false,
            });
          }
          mensaje.next(true);
        }
      },
      error => {
        this._spinner.set(false);
        mensaje.next(false);
        swal({
          type: 'error',
          title: 'No se pudo subir el archivo. Inténtelo en otro momento.',
          confirmButtonClass: 'btn btn-danger',
          confirmButtonText: 'CONTINUAR',
          buttonsStyling: false
        });
      }
    );
    return mensaje;
  }

  /*get<T>(params: HttpParams, url: string = this.urlQry, nombreKeyJson: string = this.TIPO_ATRIBUTO_DOCUMENTO_MASIVO): BehaviorSubject<[BasePaginacion, T[]]> {
    const that = this;
    const basePaginacion: BasePaginacion = new BasePaginacion();
    const dataRetornar: BehaviorSubject<[BasePaginacion, T[]]> = new BehaviorSubject<[BasePaginacion, T[]]>([basePaginacion, []]);
    this.httpClient.get<T[]>(url, {
      params: params
    }).take(1).
    subscribe(
      (data) => {
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
        if (data['_links']['first']){
          basePaginacion.first.next(data['_links']['first']['href']);
        } else {
          basePaginacion.first.next('');
        }
        if (data['_links']['prev']) {
          basePaginacion.previous.next(data['_links']['prev']['href']);
        } else {
          basePaginacion.previous.next('');
        }
        dataRetornar.next([basePaginacion, data['_embedded'][nombreKeyJson]]);
      }
    );
    return dataRetornar;
  }*/

  get<T>(parametros: HttpParams, url: string = this.urlQry, nombreKeyJson: string = this.TIPO_ATRIBUTO_DOCUMENTO_MASIVO): BehaviorSubject<[BasePaginacion, T[]]> {
    const that = this;
    this._spinner.set(true);
    const number = Number(url);
    if (number >= 0 ) {
      parametros = parametros.set('page', number.toString());
    }
    let nuevaUrl = this.urlQryDetalleMasivo;
    if ( nombreKeyJson === this.TIPO_ATRIBUTO_DOCUMENTO_MASIVO) {
      nuevaUrl = this.urlQry;
    }
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
      },
      error => {
        this._spinner.set(false);
      }
    );
    return dataRetornar;
  }

}
