import { Injectable } from '@angular/core';
import { LoginService } from 'app/service/login.service';
import { Observable } from 'rxjs/Observable';
import { Servidores } from '../servidores';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { RetencionErpDTO, RetencionIdDTO, RetencionErrorDTO, RetencionActualizarDTO } from '../../models/sincronizacion/retencionErpDTO';
import { comprobanteSincronizarDTO } from '../../models/sincronizacion/comprobanteSincronizarDTO';

@Injectable()
export class SincronizacionRetenciones {
    private url: string = '';
    private hostLocal: string = this.servidores.HOSTLOCAL ;
    private urlObtenerRetencionesLocales: string = '/sincronizacionRetencion';
    private urlEnviarRetencion:string = '/api/retencion';
    private urlActualizarRetencion: string =  '/sincronizacionRetencion/actualizarSincronizacion';
    private urlActualizarRetencionErronea: string = '/sincronizacionRetencion/actualizarSincronizacionErronea';
    private urlActualizarEstadoComprobante: string = '/sincronizacionRetencion/actualizarEstadoComprobante';
    private urlObtenerComprobante: string = '/documento';
    private urlActualizarComprobanteLocal: string = '/sincronizacionRetencion/urlActualizarComprobanteLocal';
    private urlObtenerRetenciones: string = '/documento/query';
    private urlSincronizacionRetentecion: string = '/sincronizacionRetencion';
    private urlActualizarFecha: string = '/sincronizacionRetencion/actualizarFecha';
    private urlObtenerRetencionesBajas: string = '/sincronizacionRetencion/obtenerComunicacionBaja';
    private urlEnviarRetencionesBaja: string = '/comunicacionesDeBaja';
    private urlActualizarErrorRetencionBaja: string = '/sincronizacionRetencion/actualizarErrorBaja';
    private urlActualizarRetencionBaja: string = '/sincronizacionRetencion/actualizarBaja'
    constructor(private loginService: LoginService, private servidores: Servidores,private httpClient: HttpClient){
    }

    tokenNuevo():Observable<any[]>{ 
        return this.loginService.login(localStorage.getItem('username'), localStorage.getItem('passwordActual'));
    }

    actualizarToken(response){
        localStorage.setItem('access_token', response.access_token);
        var expireDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        expireDate.setDate(expireDate.getDate()+1);
        localStorage.setItem('expires', expireDate.getTime().toString());
        localStorage.setItem('expires_in', response.expires_in);
    }

    obtenerRetencionesCreadas():Observable<any[]>{
        this.url = this.hostLocal + this.urlObtenerRetencionesLocales;
        const parametros = new HttpParams();
        return this.httpClient.get(this.url, {params: parametros  }).map((data: any) => {        
                    data.map(item =>{ this.convertirSincronizacionLongToDate(item)});
                    return data;
                })
    }

    enviarRetencionesCreadas(retencion):Observable<any>{
        const parametros = new HttpParams();
        this.url = this.servidores.DOCUCMD + this.urlEnviarRetencion;
        return this.httpClient.post<RetencionErpDTO>(this.url, retencion , {headers:this.getCabezera() } );
    }


    public getCabezera(): HttpHeaders{
        const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
        const access_token = localStorage.getItem('access_token');
        const token_type = 'Bearer';
        const ocp_apim_subscription_key = localStorage.getItem('Ocp_Apim_Subscription_Key');
        const origen_datos = 'PEB2M';
        const tipo_empresa = usuario.tipo_empresa;
        const org_id = usuario.org_id;
        let headers = new HttpHeaders()
                        .set("Authorization", token_type + ' ' + access_token)
                        .set("Content-Type", 'application/json')
                        .set('Accept', 'application/json')
                        .set('Ocp-Apim-Subscription-Key', '07a12d074c714f62ab037bb2f88e30d3')
                        .set('origen_datos', 'PEB2M')
                        .set('tipo_empresa', tipo_empresa)
                        .set('org_id', org_id);
        return headers;
    }

    private convertirSincronizacionLongToDate(item){
        item.fechaEmision = Number(new Date (item.fechaEmision));
        item.facturasAfectadas.map( itemFactura => {
            itemFactura.fechaEmision = Number(new Date (itemFactura.fechaEmision));
        })
    }
    actualizarEstadoSincronizacionRetencion(id):Observable<any>{
        let idRetencion: RetencionIdDTO = new RetencionIdDTO();
        idRetencion.id = id;
        this.url = this.hostLocal + this.urlActualizarRetencion;
        return this.httpClient.post<RetencionIdDTO>(this.url, idRetencion);
    }

    actualizarErrorRetencion(id, error):Observable<any>{
        let retencionError: RetencionErrorDTO = new RetencionErrorDTO();
        retencionError.id = id;
        let errores : string = ''; 
        error.error.errors.forEach(element => {
            errores = errores + element + '. ';
        });
        retencionError.error = errores;
        this.url = this.hostLocal + this.urlActualizarRetencionErronea;
        console.log(retencionError);
        return this.httpClient.post<RetencionErrorDTO>(this.url, retencionError);
    }

    obtenerRetencionesPendientes():Observable<any>{
        const parametros = new HttpParams();
        this.url = this.hostLocal + this.urlActualizarEstadoComprobante;
        return this.httpClient.get(this.url, {params: parametros});
    }

    obtenerRetencion(id):Observable<any>{
        const parametroGetDocumento = new HttpParams().set('id', id);
        this.url = this.servidores.DOCUQRY + this.urlObtenerComprobante;
        return this.httpClient.get(this.url,{ params: parametroGetDocumento, responseType: "text/plain" , headers: this.getCabezera() })
    }

    guardarRetencionPendientes(documento):Observable<any>{
        let facturaActualizar: RetencionActualizarDTO = new RetencionActualizarDTO();
        facturaActualizar.id = documento.inIdcomprobantepago;
        facturaActualizar.chEstadocomprobantepago = documento.chEstadocomprobantepago;
        facturaActualizar.chEstadocomprobantepagocomp = documento.chEstadocomprobantepagocomp;
        facturaActualizar.eventos = documento.eventos;
        this.url = this.hostLocal + this.urlActualizarComprobanteLocal;
        return this.httpClient.post<RetencionActualizarDTO>(this.url, facturaActualizar);
    }

    descargarRetenciones(fecha):Observable<any>{
        console.log(fecha);
        var parts = fecha.split("/");
        let fechaDe = Number(new Date(new Date(parts[2], parts[1] - 1, parts[0])));
        console.log(fechaDe);
        const fechaAl = Number(new Date());
        const parametrosR = new HttpParams().set('idEntidadEmisora',localStorage.getItem('id_entidad'))
                    .set('tipoComprobanteTabla','10007')
                    .set('tipoComprobanteRegistro','20')
                    .set('fechaEmisionDel', fechaDe.toString())
                    .set('fechaEmisionAl', fechaAl.toString())
                    .set('tipoDocumento','')
                    .set('nroDocumento','')
                    .set('ticket','')
                    .set('estado','')
                    .set('nroSerie','')
                    .set('correlativoInicial','')
                    .set('correlativoFinal','')
                    .set('nroPagina','0')
                    .set('regXPagina','10')
                    .set('ordenar','tsFechaemision')
                    .set('fechaBajaAl','')
                    .set('fechaBajaDel','')
                    .set('ticketBaja','')
                    .set('seriecorrelativo','')
                    .set('ticketResumen','')
                    .set('anticipo','N');
        this.url = this.servidores.DOCUQRY + this.urlObtenerRetenciones;
        return this.httpClient.get(this.url,{ params: parametrosR , headers: this.getCabezera()});
    }

    descargarRetencionesPagina(pagina, fecha):Observable<any>{
        var parts = fecha.split("/");
        let fechaDe = Number(new Date(new Date(parts[2], parts[1] - 1, parts[0])));
        const fechaAl = Number(new Date());
        let parametrosFinal = new HttpParams().set('idEntidadEmisora',localStorage.getItem('id_entidad'))
                                                            .set('tipoComprobanteTabla','10007')
                                                            .set('tipoComprobanteRegistro','20')
                                                            .set('fechaEmisionDel', fechaDe.toString())
                                                            .set('fechaEmisionAl', fechaAl.toString())
                                                            .set('tipoDocumento','')
                                                            .set('nroDocumento','')
                                                            .set('ticket','')
                                                            .set('estado','')
                                                            .set('nroSerie','')
                                                            .set('correlativoInicial','')
                                                            .set('correlativoFinal','')
                                                            .set('nroPagina',pagina.toString())
                                                            .set('regXPagina', '10')
                                                            .set('ordenar','tsFechaemision')
                                                            .set('fechaBajaAl','')
                                                            .set('fechaBajaDel','')
                                                            .set('ticketBaja','')
                                                            .set('seriecorrelativo','')
                                                            .set('ticketResumen','')
                                                            .set('anticipo','N'); 
        this.url = this.servidores.DOCUQRY + this.urlObtenerRetenciones;
        return this.httpClient.get(this.url,{ params: parametrosFinal , headers: this.getCabezera()});
    }

    guardarRetencionDescargada(retencion):Observable<any>{
        this.url = this.hostLocal + this.urlSincronizacionRetentecion;
        return this.httpClient.post<comprobanteSincronizarDTO>(this.url, retencion);
    }

    actualizarFechaDescarga(fecha):Observable<any>{
        this.url = this.hostLocal + this.urlActualizarFecha;
        return this.httpClient.post<any>(this.url, {'fecha': fecha});
    }

    obtenerRetencionBajas():Observable<any>{
        this.url = this.hostLocal + this.urlObtenerRetencionesBajas;
        const parametros = new HttpParams();
        return this.httpClient.get<any>(this.url,{ params: parametros });
    }

    enviarRetencionBaja(retencionBaja):Observable<any>{
        const parametros = new HttpParams();
        this.url = this.servidores.DOCUCMD + this.urlEnviarRetencionesBaja;
        return this.httpClient.post<any>(this.url, retencionBaja , {headers: this.getCabezera() } );
    }

    actualizarErrorRetencionBaja(_id):Observable<any>{
        this.url = this.hostLocal + this.urlActualizarErrorRetencionBaja;
        let headers =  new HttpHeaders();
        return this.httpClient.post<any>(this.url, {id: _id}, {headers:headers });
    }

    actualizarRetencionBaja(_id,numeroDocumento):Observable<any>{
        this.url = this.hostLocal + this.urlActualizarRetencionBaja;
        return this.httpClient.post<any>(this.url, {id: _id, numeroDocumento: numeroDocumento});
    }

}