import { Injectable } from '@angular/core';
import { LoginService } from 'app/service/login.service';
import { Observable } from 'rxjs/Observable';
import { Servidores } from '../servidores';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { PercepcionErpDTO, PercepcionIdDTO, PercepcionErrorDTO, PercepcionActualizarDTO } from '../../models/sincronizacion/percepcionErpDTO';
import { comprobanteSincronizarDTO } from '../../models/sincronizacion/comprobanteSincronizarDTO';

@Injectable()
export class SincronizacionPercepciones {
    private url: string = '';
    private hostLocal: string = this.servidores.HOSTLOCAL ;
    private urlObtenerPercepcionesLocales: string = '/sincronizacionPercepcion';
    private urlEnviarPercepcion:string = '/api/percepcion';
    private urlActualizarPercepcion: string =  '/sincronizacionPercepcion/actualizarSincronizacion';
    private urlActualizarPercepcionErronea: string = '/sincronizacionPercepcion/actualizarSincronizacionErronea';
    private urlActualizarEstadoComprobante: string = '/sincronizacionPercepcion/actualizarEstadoComprobante';
    private urlObtenerComprobante: string = '/documento';
    private urlActualizarComprobanteLocal: string = '/sincronizacionPercepcion/urlActualizarComprobanteLocal';
    private urlObtenerPercepciones: string = '/documento/query';
    private urlSincronizacionPercepcion: string = '/sincronizacionPercepcion';
    private urlActualizarFecha: string = '/sincronizacionPercepcion/actualizarFecha';
    private urlObtenerPercepcionesBajas: string = '/sincronizacionPercepcion/obtenerComunicacionBaja';
    private urlEnviarPercepcionesBaja: string = '/comunicacionesDeBaja';
    private urlActualizarErrorPercepcionBaja: string = '/sincronizacionPercepcion/actualizarErrorBaja';
    private urlActualizarPercepcionBaja: string = '/sincronizacionPercepcion/actualizarBaja'
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

    obtenerPercepcionesCreadas():Observable<any[]>{
        this.url = this.hostLocal + this.urlObtenerPercepcionesLocales;
        const parametros = new HttpParams();
        return this.httpClient.get(this.url, {params: parametros }).map((data: any) => {    
                    console.log(data);    
                    //data.map(item =>{ this.convertirSincronizacionLongToDate(item)});
                    return data;
                })
    }

    enviarPercepcionesCreadas(percepcion):Observable<any>{
        const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
        const org_id = usuario.org_id;
        let headers =  new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Accept', 'application/json')
                                        .set('origen_datos', 'PEB2M')
                                        .set("Authorization", 'Bearer ' + localStorage.getItem('access_token'))
                                        .set("tipo_empresa", localStorage.getItem('tipo_empresa'))
                                        .set("org_id",  org_id)
                                        .set("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
        const parametros = new HttpParams();
        this.url = this.servidores.DOCUCMD + this.urlEnviarPercepcion;
        return this.httpClient.post<PercepcionErpDTO>(this.url, percepcion , {headers:headers } );
    }

    private convertirSincronizacionLongToDate(item){
        item.fechaEmision = Number(new Date (item.fechaEmision));
        item.facturasAfectadas.map( itemFactura => {
            itemFactura.fechaEmision = Number(new Date (itemFactura.fechaEmision));
        })
    }
    actualizarEstadoSincronizacionPercepcion(id):Observable<any>{
        let idPercepcion: PercepcionIdDTO = new PercepcionIdDTO();
        idPercepcion.id = id;
        this.url = this.hostLocal + this.urlActualizarPercepcion;
        return this.httpClient.post<PercepcionIdDTO>(this.url, idPercepcion);
    }

    actualizarErrorPercepcion(id, error):Observable<any>{
        let percepcionError: PercepcionErrorDTO = new PercepcionErrorDTO();
        percepcionError.id = id;
        let errores : string = ''; 
        error.error.errors.forEach(element => {
            errores = errores + element + '. ';
        });
        percepcionError.error = errores;
        this.url = this.hostLocal + this.urlActualizarPercepcionErronea;
        console.log(percepcionError);
        return this.httpClient.post<PercepcionErrorDTO>(this.url, percepcionError);
    }

    obtenerPercepcionesPendientes():Observable<any>{
        const parametros = new HttpParams();
        this.url = this.hostLocal + this.urlActualizarEstadoComprobante;
        return this.httpClient.get(this.url, {params: parametros});

    }

    obtenerPercepcion(id):Observable<any>{
        const parametroGetDocumento = new HttpParams().set('id', id);
        this.url = this.servidores.DOCUQRY + this.urlObtenerComprobante;
        return this.httpClient.get(this.url,{ params: parametroGetDocumento })
    }

    guardarPercepcionPendientes(documento):Observable<any>{
        let facturaActualizar: PercepcionActualizarDTO = new PercepcionActualizarDTO();
        facturaActualizar.id = documento.inIdcomprobantepago;
        facturaActualizar.chEstadocomprobantepago = documento.chEstadocomprobantepago;
        facturaActualizar.chEstadocomprobantepagocomp = documento.chEstadocomprobantepagocomp;
        facturaActualizar.eventos = documento.eventos;
        this.url = this.hostLocal + this.urlActualizarComprobanteLocal;
        return this.httpClient.post<PercepcionActualizarDTO>(this.url, facturaActualizar);
    }

    descargarPercepciones(fecha):Observable<any>{
        var parts = fecha.split("-");
        let fechaDe = Number(new Date(new Date(parts[2], parts[1] - 1, parts[0])));
        const fechaAl = Number(new Date());
        const parametrosR = new HttpParams().set('idEntidadEmisora',localStorage.getItem('id_entidad'))
                    .set('tipoComprobanteTabla','10007')
                    .set('tipoComprobanteRegistro','40')
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
        this.url = this.servidores.DOCUQRY + this.urlObtenerPercepciones;
        return this.httpClient.get(this.url,{ params: parametrosR });
    }

    descargarPercepcionesPagina(pagina, fecha):Observable<any>{
        var parts = fecha.split("-");
        let fechaDe = Number(new Date(new Date(parts[2], parts[1] - 1, parts[0])));
        const fechaAl = Number(new Date());
        let parametrosFinal = new HttpParams().set('idEntidadEmisora',localStorage.getItem('id_entidad'))
                                                            .set('tipoComprobanteTabla','10007')
                                                            .set('tipoComprobanteRegistro','40')
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
        this.url = this.servidores.DOCUQRY + this.urlObtenerPercepciones;
        return this.httpClient.get(this.url,{ params: parametrosFinal });
    }

    guardarPercepcionDescargada(retencion):Observable<any>{
        this.url = this.hostLocal + this.urlSincronizacionPercepcion;
        return this.httpClient.post<comprobanteSincronizarDTO>(this.url, retencion);
    }

    actualizarFechaDescarga(fecha):Observable<any>{
        this.url = this.hostLocal + this.urlActualizarFecha;
        return this.httpClient.post<any>(this.url, {'fecha': fecha});
    }

    obtenerPercepcionBajas():Observable<any>{
        this.url = this.hostLocal + this.urlObtenerPercepcionesBajas;
        const parametros = new HttpParams();
        return this.httpClient.get<any>(this.url,{ params: parametros });
    }

    enviarPercepcionBaja(retencionBaja):Observable<any>{
        const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
        const org_id = usuario.org_id;
        let headers =  new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Accept', 'application/json')
                                        .set('origen_datos', 'PEB2M')
                                        .set("Authorization", 'Bearer ' + localStorage.getItem('access_token'))
                                        .set("tipo_empresa", localStorage.getItem('tipo_empresa'))
                                        .set("org_id",  org_id)
                                        .set("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
        const parametros = new HttpParams();
        this.url = this.servidores.DOCUCMD + this.urlEnviarPercepcionesBaja;
        return this.httpClient.post<any>(this.url, retencionBaja , {headers:headers } );
    }

    actualizarErrorPercepcionBaja(_id):Observable<any>{
        this.url = this.hostLocal + this.urlActualizarErrorPercepcionBaja;
        let headers =  new HttpHeaders();
        return this.httpClient.post<any>(this.url, {id: _id}, {headers:headers });
    }

    actualizarPercepcionBaja(_id,numeroDocumento):Observable<any>{
        this.url = this.hostLocal + this.urlActualizarPercepcionBaja;
        return this.httpClient.post<any>(this.url, {id: _id, numeroDocumento: numeroDocumento});
    }

}