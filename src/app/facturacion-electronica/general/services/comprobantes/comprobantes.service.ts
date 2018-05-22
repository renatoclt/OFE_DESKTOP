import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Servidores} from '../servidores';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Comprobante} from '../../models/comprobantes/comprobante';
import {TABLA_MAESTRA_TIPO_COMPROBANTE} from '../../models/documento/tablaMaestra';
import {BasePaginacion} from '../base.paginacion';
import {ArchivoMasiva} from '../../../percepcion-retencion/models/archivoMasiva';
import {ConsultaDocumentoQuery} from '../../models/consultaDocumentoQuery';
import {SpinnerService} from 'app/service/spinner.service';
import {Observable} from 'rxjs/Observable';
import {DocumentoQuery} from '../../models/comprobantes';
import {UtilsService} from '../../utils/utils.service';
import {TranslateService} from '@ngx-translate/core';

declare var swal: any;

@Injectable()
export class ComprobantesService {
  public loading = false;
  public urlConsultaReferencias = '/referencias/search/comprobanteID';
  public urlConsultaQuery = '';
  private url_documento_query = '/documento/query';
  private url_documento = '/documento';

  private urlConsultaDocumentos = '/archivosmasivos';
  private consultaDocumentos = '/search';
  private filtro = '/filtros';
  public dataArchivosMasiva: BehaviorSubject<ArchivoMasiva[]> = new BehaviorSubject<ArchivoMasiva[]>([]);

  public TIPO_ATRIBUTO_COMPROBANTES_QUERY = 'content';

  public TIPO_CONSULTA_RETENCION = 'consultaRetenciones';

  constructor(private httpClient: HttpClient,
              private servidores: Servidores,
              public paginacion: BasePaginacion,
              private _translateService: TranslateService,
              private _spinner: SpinnerService,
              private _utilsService: UtilsService) {
    this.urlConsultaDocumentos = this.servidores.DOCUQRY + this.urlConsultaDocumentos + this.consultaDocumentos + this.filtro;
    //this.url_documento_query = this.servidores.DOCUQRY + this.url_documento_query;
    this.url_documento_query =  this.servidores.HOSTLOCAL+'/documento/query';
    this.urlConsultaReferencias = this.servidores.DOCUQRY + this.urlConsultaReferencias;
  }

  obtenerUrlDocumentoQuery() {
    return this.url_documento_query;
  }

  get<T>(parametros: HttpParams, url: string = this.url_documento_query, nombreKeyJson: string = this.TIPO_ATRIBUTO_COMPROBANTES_QUERY): BehaviorSubject<[BasePaginacion, T[]]> {
    this._spinner.set(true);
    const that = this;
    const number = Number(url);
    if (number >= 0) {
      parametros = parametros.set('nroPagina', number.toString());
    } else {
      parametros = parametros.set('nroPagina', parametros.get('page'));
    }
    parametros = parametros.set('regXPagina', parametros.get('size'));
    // parametros = parametros.set('ordenar', parametros.get('sort').split(',')[0]);
    parametros = parametros.delete('page');
    parametros = parametros.delete('size');
    parametros = parametros.delete('sort');
    const basePaginacion: BasePaginacion = new BasePaginacion();
    const dataRetornar: BehaviorSubject<[BasePaginacion, T[]]> = new BehaviorSubject<[BasePaginacion, T[]]>([basePaginacion, undefined]);
    this.httpClient.get<T[]>(this.url_documento_query, {params: parametros}).take(1)
      .map(
        data => {
          // data['tsFechaemision'] = new Date(data['tsFechaemision']);
          data[nombreKeyJson].map(
            (item) => {
              item['tsFechaemision'] = that._utilsService.obtenerFecha(item['tsFechaemision']);
              item['deDctomonto'] = Number(item['deDctomonto']).toFixed(2);
              item['deTotalcomprobantepago'] = Number(item['deTotalcomprobantepago']).toFixed(2);
              if (item['tsParamFechabaja'] === null) {
                item['tsParamFechabaja'] = '-';
              }
            }
          );
          return data;
        },
      ).subscribe(
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

  buscar(parametros: HttpParams): BehaviorSubject<Comprobante[]> {
    const comprobantes: BehaviorSubject<Comprobante[]> = new BehaviorSubject<Comprobante[]>([]);
    this.httpClient.get<Comprobante[]>(this.url_documento_query, {
      params: parametros
    }).map(
      data => {
        const prueba: Comprobante[] = data['content'];
        return prueba;
      }
    )
      .subscribe(
        data => {
          comprobantes.next(data);
        }
      );
    return comprobantes;
  }

  buscarParaAutoComplete(numeroComprobante: string, palabraABuscar: string): Observable<Comprobante[]> {
    const parametros = new HttpParams()
      .set('idEntidadEmisora', localStorage.getItem('id_entidad'))
      .set('tipoComprobanteTabla', TABLA_MAESTRA_TIPO_COMPROBANTE.toString())
      .set('tipoComprobanteRegistro', numeroComprobante)
      .set('fechaEmisionDel', '')
      .set('fechaEmisionAl', '')
      .set('ticketBaja', '')
      .set('nroPagina', '0')
      .set('regXPagina', '10')
      .set('ordenar', 'inIdcomprobantepago')
      .set('tipoDocumento', '')
      .set('correlativoInicial', '')
      .set('correlativoFinal', '')
      .set('fechaBajaDel', '')
      .set('fechaBajaAl', '')
      .set('nroDocumento', '')
      .set('nroSerie', '')
      .set('estado', '')
      .set('ticket', '')
      .set('seriecorrelativo', palabraABuscar)
      .set('ticketResumen', '')
      .set('anticipo', 'N');
    return this.httpClient.get<Comprobante[]>(this.url_documento_query, {
      params: parametros
    }).map(
      data => {
        const prueba: Comprobante[] = data['content'];
        return prueba;
      }
    );
  }

  buscarPorTipoComprobanteSerieCorrelativo(tipoComprobante: string, serie: string, correlativo: string): BehaviorSubject<Comprobante> {
    const parametros = new HttpParams()
      .set('idEntidadEmisora', localStorage.getItem('id_entidad'))
      .set('tipoComprobanteTabla', TABLA_MAESTRA_TIPO_COMPROBANTE.toString())
      .set('tipoComprobanteRegistro', tipoComprobante)
      .set('fechaEmisionDel', '')
      .set('fechaEmisionAl', '')
      .set('ticketBaja', '')
      .set('nroPagina', '0')
      .set('regXPagina', '10')
      .set('ordenar', 'inIdcomprobantepago')
      .set('tipoDocumento', '')
      .set('correlativoInicial', correlativo)
      .set('correlativoFinal', '')
      .set('fechaBajaDel', '')
      .set('fechaBajaAl', '')
      .set('nroDocumento', '')
      .set('nroSerie', serie)
      .set('estado', '')
      .set('ticket', '')
      .set('seriecorrelativo', '')
      .set('ticketResumen', '')
      .set('anticipo', 'N');
    const respuesta = new BehaviorSubject<Comprobante>(null);
    this._spinner.set(true);
    this.httpClient.get<Comprobante>(this.url_documento_query, {
      params: parametros
    }).map(
      data => {
        const prueba: Comprobante = data['content'][0];
        return prueba;
      }
    ).subscribe(
      data => {
        this._spinner.set(false);
        if (!data) {
          let continuarText = '';
          this._translateService.get('continuar').take(1).subscribe(item => continuarText = item);
          let comprobanteNoEncontrado = '';
          this._translateService.get('comprobanteNoEncontrado').take(1).subscribe(item => comprobanteNoEncontrado = item);
          swal({
            type: 'error',
            title: comprobanteNoEncontrado,
            confirmButtonText: continuarText,
            confirmButtonClass: 'btn btn-danger',
            buttonsStyling: false
          });
        }
        respuesta.next(data);
      },
      error => {
        this._spinner.set(false);
        respuesta.next(null);
      }
    );
    return respuesta;
  }

  filtroxdefecto(tipoComprobanteRegistro: string,
                 fechadel: string,
                 fechaal: string,
                 nropagina: string,
                 regxpagina: string,
                 ordenar: string): BehaviorSubject<Comprobante[]> {
    const parametros = new HttpParams()
      .set('tipoComprobanteTabla', TABLA_MAESTRA_TIPO_COMPROBANTE.toString())
      .set('tipoComprobanteRegistro', tipoComprobanteRegistro)
      .set('fechaEmisionDel', fechadel)
      .set('fechaEmisionAl', fechaal)
      .set('nroPagina', nropagina)
      .set('regXPagina', regxpagina)
      .set('ordenar', ordenar);
    return this.buscar(parametros);
  }

  filtroxSerie_CorrelativoInicio_Fin(tipoComprobanteRegistro: string,
                                     fechadel: string,
                                     fechaal: string,
                                     nropagina: string,
                                     regxpagina: string,
                                     ordenar: string,
                                     correlativoinicial: string,
                                     correlativofinal: string,
                                     serie: string): BehaviorSubject<Comprobante[]> {
    const parametros = new HttpParams()
      .set('tipoComprobanteTabla', TABLA_MAESTRA_TIPO_COMPROBANTE.toString())
      .set('tipoComprobanteRegistro', tipoComprobanteRegistro)
      .set('fechaEmisionDel', fechadel)
      .set('fechaEmisionAl', fechaal)
      .set('nroPagina', nropagina)
      .set('regXPagina', regxpagina)
      .set('ordenar', ordenar)
      .set('correlativoInicial', correlativoinicial)
      .set('correlativoFinal', correlativofinal)
      .set('nroSerie', serie);
    return this.buscar(parametros);
  }

  filtroxSerie_CorrelativoInicio(tipoComprobanteRegistro: string,
                                 fechadel: string,
                                 fechaal: string,
                                 nropagina: string,
                                 regxpagina: string,
                                 ordenar: string,
                                 correlativoinicial: string,
                                 serie: string): BehaviorSubject<Comprobante[]> {
    const parametros = new HttpParams()
      .set('tipoComprobanteTabla', TABLA_MAESTRA_TIPO_COMPROBANTE.toString())
      .set('tipoComprobanteRegistro', tipoComprobanteRegistro)
      .set('fechaEmisionDel', fechadel)
      .set('fechaEmisionAl', fechaal)
      .set('nroPagina', nropagina)
      .set('regXPagina', regxpagina)
      .set('ordenar', ordenar)
      .set('nroSerie', serie)
      .set('correlativoInicial', correlativoinicial);

    return this.buscar(parametros);
  }

  filtroxSerie_Estado(tipoComprobanteRegistro: string,
                      fechadel: string,
                      fechaal: string,
                      nropagina: string,
                      regxpagina: string,
                      ordenar: string,
                      serie: string,
                      estado: string): BehaviorSubject<Comprobante[]> {
    const parametros = new HttpParams()
      .set('tipoComprobanteTabla', TABLA_MAESTRA_TIPO_COMPROBANTE.toString())
      .set('tipoComprobanteRegistro', tipoComprobanteRegistro)
      .set('fechaEmisionDel', fechadel)
      .set('fechaEmisionAl', fechaal)
      .set('nroPagina', nropagina)
      .set('regXPagina', regxpagina)
      .set('ordenar', ordenar)
      .set('nroSerie', serie)
      .set('estado', estado);
    return this.buscar(parametros);
  }

  filtroxEstado(tipoComprobanteRegistro: string,
                fechadel: string,
                fechaal: string,
                nropagina: string,
                regxpagina: string,
                ordenar: string,
                estado: string): BehaviorSubject<Comprobante[]> {
    const parametros = new HttpParams()
      .set('tipoComprobanteTabla', TABLA_MAESTRA_TIPO_COMPROBANTE.toString())
      .set('tipoComprobanteRegistro', tipoComprobanteRegistro)
      .set('fechaEmisionDel', fechadel)
      .set('fechaEmisionAl', fechaal)
      .set('nroPagina', nropagina)
      .set('regXPagina', regxpagina)
      .set('ordenar', ordenar)
      .set('estado', estado);
    return this.buscar(parametros);
  }

  filtroxSerie(tipoComprobanteRegistro: string,
               fechadel: string,
               fechaal: string,
               nropagina: string,
               regxpagina: string,
               ordenar: string,
               numeroSerie: string): BehaviorSubject<Comprobante[]> {
    const parametros = new HttpParams()
      .set('tipoComprobanteTabla', TABLA_MAESTRA_TIPO_COMPROBANTE.toString())
      .set('tipoComprobanteRegistro', tipoComprobanteRegistro)
      .set('fechaEmisionDel', fechadel)
      .set('fechaEmisionAl', fechaal)
      .set('nroPagina', nropagina)
      .set('regXPagina', regxpagina)
      .set('ordenar', ordenar)
      .set('nroSerie', numeroSerie);
    return this.buscar(parametros);
  }

  filtroxSerie_Estado_CorrelativoInicio_Fin(tipoComprobanteRegistro: string,
                                            fechadel: string,
                                            fechaal: string,
                                            nropagina: string,
                                            regxpagina: string,
                                            ordenar: string,
                                            correlativoinicial: string,
                                            correlativofinal: string,
                                            serie: string,
                                            estado: string): BehaviorSubject<Comprobante[]> {
    const parametros = new HttpParams()
      .set('tipoComprobanteTabla', TABLA_MAESTRA_TIPO_COMPROBANTE.toString())
      .set('tipoComprobanteRegistro', tipoComprobanteRegistro)
      .set('fechaEmisionDel', fechadel)
      .set('fechaEmisionAl', fechaal)
      .set('nroPagina', nropagina)
      .set('regXPagina', regxpagina)
      .set('ordenar', ordenar)
      .set('correlativoInicial', correlativoinicial)
      .set('correlativoFinal', correlativofinal)
      .set('nroSerie', serie)
      .set('estado', estado);
    return this.buscar(parametros);
  }

  /////
  filtroDefecto(parametrosInput: ConsultaDocumentoQuery): BehaviorSubject<Comprobante[]> {
    const parametros = new HttpParams()
      .set('tipoComprobanteTabla', parametrosInput.tipoComprobanteTabla)
      .set('tipoComprobanteRegistro', parametrosInput.tipoComprobanteRegistro)
      .set('fechaEmisionDel', parametrosInput.fechaDel)
      .set('fechaEmisionAl', parametrosInput.fechaAl)
      .set('tipoDocumento', parametrosInput.tipoDocumento)
      .set('nroDocumento', parametrosInput.numeroDocumento)
      .set('ticket', parametrosInput.ticket)
      .set('estado', parametrosInput.estado)
      .set('nroSerie', parametrosInput.serie)
      .set('correlativoInicial', parametrosInput.correlativoInicial)
      .set('correlativoFinal', parametrosInput.correlativoFinal)
      .set('nroPagina', parametrosInput.numeroPagina)
      .set('regXPagina', parametrosInput.registroPorPagina)
      .set('ordenar', parametrosInput.ordenar)
      .set('fechaBajaDel', '')
      .set('fechaBajaAl', '')
    ;
    console.log('PARAMETROS SERVICIO');
    console.log(parametros);

    const urlDefecto = this.servidores.DOCUQRY + this.url_documento_query;
    //  let urlDefecto = 'http://192.168.70.21:8081/api/fe/ms-documentos-query/v1/documento/query';
    //  let urlDefecto = 'http://35.225.238.222:8081/api/fe/ms-documentos-query/v1/documento/query';
    return this.buscarDefecto(parametros, urlDefecto);
  }

  buscarDefecto(parametros: HttpParams, urlDefecto): BehaviorSubject<Comprobante[]> {
    const comprobantes: BehaviorSubject<Comprobante[]> = new BehaviorSubject<Comprobante[]>([]);
    this.httpClient.get<Comprobante[]>(urlDefecto, {
      params: parametros
    })
      .subscribe(
        data => {
          comprobantes.next(data);
        }
      );
    return comprobantes;
  }

  public buscarPorUuid(uuid: string): BehaviorSubject<DocumentoQuery> {
    const parametros = new HttpParams()
      .set('id', uuid);
    const urlDefecto = this.servidores.DOCUQRY + this.url_documento;
    const comprobantes: BehaviorSubject<DocumentoQuery> = new BehaviorSubject<DocumentoQuery>(null);
    this.httpClient.get<DocumentoQuery>(urlDefecto, {
      params: parametros
    })
      .subscribe(
        data => {
          comprobantes.next(data);
        }, error => {
          comprobantes.error(error);
        }
      );
    return comprobantes;
  }

  public visualizar (uuid: string): BehaviorSubject<Comprobante> {
    const urlDefecto = this.servidores.HOSTLOCAL + '/documento?id=' + uuid;
    const datas: BehaviorSubject<Comprobante> = new BehaviorSubject<Comprobante>(null);
      this._spinner.set(true);
    this.httpClient.get<Comprobante>(urlDefecto)
      .subscribe(
        (data) => {
          this._spinner.set(false);
          datas.next(data);
        },
        error => {
          this._spinner.set(false);
        }
      );
    return datas;
  }
}
