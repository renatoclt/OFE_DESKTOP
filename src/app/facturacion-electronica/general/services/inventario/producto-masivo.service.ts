import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {SpinnerService} from '../../../../service/spinner.service';
import {ArchivoMasiva, ArchivoMasivaEntrada} from '../../../percepcion-retencion/models/archivoMasiva';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TranslateService} from '@ngx-translate/core';
import {BasePaginacion} from '../base.paginacion';
import {Servidores} from '../servidores';

declare var swal: any;
@Injectable()
export class ProductoMasivoService {
  private pathProductoMasivoCmd: string;
  private urlProductoMasivoCmd: string;
  private pathProductoMasivoQry: string;
  private _urlProductoMasivoQry: string;

  get urlProductoMasivoQry(): string {
    return this._urlProductoMasivoQry;
  }

  public TIPO_ATRIBUTO_DOCUMENTO_MASIVO_QRY: string;
  public TIPO_ATRIBUTO_DETALLE_DOCUMENTO_MASIVO_QRY: string;

  constructor( private httpClient: HttpClient,
               private _servidores: Servidores,
               private _translateService: TranslateService,
               private _spinner: SpinnerService) {
    this.inicializarVariables();
  }

  inicializarVariables() {
    this.pathProductoMasivoCmd = '/productoMasivo';
    this.urlProductoMasivoCmd = this._servidores.INVECMD + this.pathProductoMasivoCmd;
    this.TIPO_ATRIBUTO_DOCUMENTO_MASIVO_QRY = 'documentoMasivoes';
    this.TIPO_ATRIBUTO_DETALLE_DOCUMENTO_MASIVO_QRY = 'detalleMasivoes';
    this.pathProductoMasivoQry = '/archivosmasivos/search/filtros';
    this._urlProductoMasivoQry = this._servidores.DOCUQRY + this.pathProductoMasivoQry;
  }

  cargarProductoMasivo(productoMasivo: ArchivoMasivaEntrada) {
    const mensaje: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    this._spinner.set(true);
    this.httpClient.post<ArchivoMasiva>(this.urlProductoMasivoCmd, productoMasivo).subscribe(
      dataProdcutoMasivo => {
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
        this._translateService.get('si').take(1).subscribe(data => siText = data);
        if (dataProdcutoMasivo) {
          if (dataProdcutoMasivo.ticket === '-') {
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
        let errorCargarProductoMasivo = '';
        this._translateService.get('errorCargarProductoMasivo').take(1).subscribe(data => errorCargarProductoMasivo = data);
        swal({
          type: 'error',
          title: errorCargarProductoMasivo,
          confirmButtonClass: 'btn btn-danger',
          buttonsStyling: false
        });
        mensaje.next(false);
      }
    );
    return mensaje;
  }

  get<T>(
    parametros: HttpParams, url: string = this._urlProductoMasivoQry, nombreKeyJson: string = this.TIPO_ATRIBUTO_DOCUMENTO_MASIVO_QRY
  ): BehaviorSubject<[BasePaginacion, T[]]> {
    this._spinner.set(true);
    const number = Number(url);
    if (number >= 0 ) {
      parametros = parametros.set('page', number.toString());
    }
    let nuevaUrl = this._urlProductoMasivoQry;
    if ( nombreKeyJson === this.TIPO_ATRIBUTO_DOCUMENTO_MASIVO_QRY) {
      nuevaUrl = this._urlProductoMasivoQry;
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
