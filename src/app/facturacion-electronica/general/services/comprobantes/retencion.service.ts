import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Servidores } from '../servidores';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Comprobante } from '../../models/comprobantes/comprobante';
import { TABLA_MAESTRA_TIPO_COMPROBANTE } from '../../models/documento/tablaMaestra';
import { BasePaginacion } from '../base.paginacion';
import { ArchivoMasiva } from '../../../percepcion-retencion/models/archivoMasiva';
import { ConsultaDocumentoQuery } from '../../models/consultaDocumentoQuery';
import { SpinnerService } from 'app/service/spinner.service';
import { error } from 'util';


@Injectable()
export class RetencionService {
    private url = '/ms-documentos-query/v1/documento/query';
    private url_documento_query = '/documento/query';
    private url_documento = '/documento';

    private urlConsultaDocumentos: string = '/ms-documentos-query/v1/archivosmasivos';
    private consultaDocumentos: string = '/search';
    private filtro: string = '/filtros';
    public dataArchivosMasiva: BehaviorSubject<ArchivoMasiva[]> = new BehaviorSubject<ArchivoMasiva[]>([]);


    constructor(private httpClient: HttpClient,
        private servidores: Servidores,
        public paginacion: BasePaginacion,
        public _spinner: SpinnerService) {
    }

    get(params: HttpParams, url: string = this.url) {
        const that = this;
        this.httpClient.get<ArchivoMasiva[]>(url, {
            params: params
        }).take(1).
            subscribe(
            (data) => {
                that.dataArchivosMasiva.next(data['_embedded']['people']);
                that.paginacion.pagina.next(data['page']['number']);
                that.paginacion.totalItems.next(data['page']['totalElements']);
                that.paginacion.totalPaginas.next(data['page']['totalPages'] - 1);
                if (data['_links']['next']) {
                    that.paginacion.next.next(data['_links']['next']['href']);
                }
                else {
                    that.paginacion.next.next('');
                }
                if (data['_links']['last']) {
                    that.paginacion.last.next(data['_links']['last']['href']);
                }
                else {
                    that.paginacion.last.next('');
                }
                if (data['_links']['first']) {
                    that.paginacion.first.next(data['_links']['first']['href']);
                }
                else {
                    that.paginacion.first.next('');
                }
                if (data['_links']['prev']) {
                    that.paginacion.previous.next(data['_links']['prev']['href']);
                }
                else {
                    that.paginacion.previous.next('');
                }
            }
            );
    }

    /////
    filtroDefecto(
        parametrosInput: ConsultaDocumentoQuery
    ): BehaviorSubject<Comprobante[]> {
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

        let urlDefecto = this.servidores.DOCUQRY + this.url_documento_query;
        //  let urlDefecto = 'http://192.168.70.21:8081/api/fe/ms-documentos-query/v1/documento/query';
        //  let urlDefecto = 'http://35.225.238.222:8081/api/fe/ms-documentos-query/v1/documento/query';
        return this.buscarDefecto(parametros, urlDefecto);
    }

    buscarDefecto(parametros: HttpParams, urlDefecto): BehaviorSubject<Comprobante[]> {
        const comprobantes: BehaviorSubject<Comprobante[]> = new BehaviorSubject<Comprobante[]>([]);
        this._spinner.set(true);
        this.httpClient.get<Comprobante[]>(urlDefecto, {
            params: parametros
        }).map(
            data => {
                const prueba: Comprobante[] = data['content'];
                this._spinner.set(false);
                return prueba;
            },
            error => {
                this._spinner.set(false);
            }
            )
            .subscribe(
            data => {
                comprobantes.next(data);
                this._spinner.set(false);
            },
            error => {
                this._spinner.set(false);
            }
            );
        return comprobantes;
    }
    public buscarPorUuid(uuid: string) {
        const parametros = new HttpParams()
            .set('id', uuid);

        let urlDefecto = this.servidores.DOCUQRY + this.url_documento;
        // 'http://192.168.70.21:8081/api/fe/ms-documentos-query/v1/documento';
        //  let urlDefecto = 'http://35.225.238.222:8081/api/fe/ms-documentos-query/v1/documento/query';
        return this.buscarDefecto(parametros, urlDefecto);
    }
}