import { Injectable } from '@angular/core';
import { LoginService } from 'app/service/login.service';
import { Observable } from 'rxjs/Observable';
import { Servidores } from '../servidores';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BoletaErpDTO, BoletaIdDTO, BoletaErrorDTO, BoletaActualizarDTO } from '../../models/sincronizacion/boletaErpDTO';
import { comprobanteSincronizarDTO } from '../../models/sincronizacion/comprobanteSincronizarDTO';

@Injectable()
export class SincronizacionBoletas {
    private url: string = '';
    private hostLocal: string = this.servidores.HOSTLOCAL ;
    private urlObtenerBoletasLocales: string = '/sincronizacionBoletas';
    private urlEnviarBoleta:string = '/api/boleta';
    private urlActualizarBoleta: string =  '/sincronizacionBoletas/actualizarSincronizacion';
    private urlActualizarBoletaErronea: string = '/sincronizacionBoletas/actualizarSincronizacionErronea';
    private urlActualizarEstadoComprobante: string = '/sincronizacionBoletas/actualizarEstadoComprobante';
    private urlObtenerComprobante: string = '/documento';
    private urlActualizarComprobanteLocal: string = '/sincronizacionBoletas/urlActualizarComprobanteLocal';
    private urlObtenerBoletas: string = '/documento/query';
    private urlSincronizacionBoleta: string = '/sincronizacionBoletas';
    private urlActualizarFecha: string = '/sincronizacionBoletas/actualizarFecha';
    private urlObtenerBoletasBajas: string = '/sincronizacionBoletas/obtenerComunicacionBaja';
    private urlEnviarBoletasBaja: string = '/comunicacionesDeBaja';
    private urlActualizarErrorBoletaBaja: string = '/sincronizacionBoletas/actualizarErrorBaja';
    private urlActualizarBoletaBaja: string = '/sincronizacionBoletas/actualizarBaja'
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

    obtenerBoletasCreadas():Observable<any[]>{
        this.url = this.hostLocal + this.urlObtenerBoletasLocales;
        const parametros = new HttpParams();
        return this.httpClient.get(this.url, {params: parametros  }).map((data: any) => {        
                    //data.map(item =>{ this.convertirSincronizacionLongToDate(item)});
                    return data;
                })
    }

    enviarBoletasCreadas(boleta):Observable<any>{
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
        this.url = this.servidores.DOCUCMD + this.urlEnviarBoleta;
        return this.httpClient.post<BoletaErpDTO>(this.url, boleta , {headers:headers } );
    }

    private convertirSincronizacionLongToDate(item){
        item.fechaEmision = Number(new Date (item.fechaEmision));
        item.boletasAfectadas.map( itemBoleta => {
            itemBoleta.fechaEmision = Number(new Date (itemBoleta.fechaEmision));
        })
    }
    actualizarEstadoSincronizacionBoleta(id):Observable<any>{
        let idBoleta: BoletaIdDTO = new BoletaIdDTO();
        idBoleta.id = id;
        this.url = this.hostLocal + this.urlActualizarBoleta;
        return this.httpClient.post<BoletaIdDTO>(this.url, idBoleta);
    }

    actualizarErrorBoleta(id, error):Observable<any>{
        let boletaError: BoletaErrorDTO = new BoletaErrorDTO();
        boletaError.id = id;
        let errores : string = ''; 
        error.error.errors.forEach(element => {
            errores = errores + element + '. ';
        });
        boletaError.error = errores;
        this.url = this.hostLocal + this.urlActualizarBoletaErronea;
        console.log(boletaError);
        return this.httpClient.post<BoletaErrorDTO>(this.url, boletaError);
    }

    obtenerBoletasPendientes():Observable<any>{
        const parametros = new HttpParams();
        this.url = this.hostLocal + this.urlActualizarEstadoComprobante;
        return this.httpClient.get(this.url, {params: parametros});

    }

    obtenerBoleta(id):Observable<any>{
        const parametroGetDocumento = new HttpParams().set('id', id);
        this.url = this.servidores.DOCUQRY + this.urlObtenerComprobante;
        return this.httpClient.get(this.url,{ params: parametroGetDocumento , headers: this.getCabezera() })
    }

    guardarBoletaPendientes(documento):Observable<any>{
        let boletaActualizar: BoletaActualizarDTO = new BoletaActualizarDTO();
        boletaActualizar.id = documento.inIdcomprobantepago;
        boletaActualizar.chEstadocomprobantepago = documento.chEstadocomprobantepago;
        boletaActualizar.chEstadocomprobantepagocomp = documento.chEstadocomprobantepagocomp;
        boletaActualizar.eventos = documento.eventos;
        this.url = this.hostLocal + this.urlActualizarComprobanteLocal;
        return this.httpClient.post<BoletaActualizarDTO>(this.url, boletaActualizar);
    }

    descargarBoletas(fecha):Observable<any>{
        console.log(fecha);
        var parts = fecha.split("-");
        let fechaDe = Number(new Date(new Date(parts[2], parts[1] - 1, parts[0])));
        console.log(fechaDe);
        const fechaAl = Number(new Date());
        const parametrosR = new HttpParams().set('idEntidadEmisora',localStorage.getItem('id_entidad'))
                    .set('tipoComprobanteTabla','10007')
                    .set('tipoComprobanteRegistro','03')
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
        this.url = this.servidores.DOCUQRY + this.urlObtenerBoletas;
        return this.httpClient.get(this.url,{ params: parametrosR , headers: this.getCabezera() });
    }

    descargarBoletasPagina(pagina, fecha):Observable<any>{
        var parts = fecha.split("-");
        let fechaDe = Number(new Date(new Date(parts[2], parts[1] - 1, parts[0])));
        const fechaAl = Number(new Date());
        let parametrosFinal = new HttpParams().set('idEntidadEmisora',localStorage.getItem('id_entidad'))
                                                            .set('tipoComprobanteTabla','10007')
                                                            .set('tipoComprobanteRegistro','03')
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
        this.url = this.servidores.DOCUQRY + this.urlObtenerBoletas;
        return this.httpClient.get(this.url,{ params: parametrosFinal , headers: this.getCabezera() });
    }

    guardarBoletaDescargada(boleta):Observable<any>{
        this.url = this.hostLocal + this.urlSincronizacionBoleta;
        return this.httpClient.post<comprobanteSincronizarDTO>(this.url, boleta);
    }

    actualizarFechaDescarga(fecha):Observable<any>{
        this.url = this.hostLocal + this.urlActualizarFecha;
        return this.httpClient.post<any>(this.url, {'fecha': fecha});
    }

    obtenerBoletaBajas():Observable<any>{
        this.url = this.hostLocal + this.urlObtenerBoletasBajas;
        const parametros = new HttpParams();
        return this.httpClient.get<any>(this.url,{ params: parametros });
    }

    enviarBoletaBaja(boletaBaja):Observable<any>{
        const parametros = new HttpParams();
        this.url = this.servidores.DOCUCMD + this.urlEnviarBoletasBaja;
        return this.httpClient.post<any>(this.url, boletaBaja , {headers:this.getCabezera() } );
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

    actualizarErrorBoletaBaja(_id):Observable<any>{
        this.url = this.hostLocal + this.urlActualizarErrorBoletaBaja;
        let headers =  new HttpHeaders();
        return this.httpClient.post<any>(this.url, {id: _id}, {headers:headers });
    }

    actualizarBoletaBaja(_id,numeroDocumento):Observable<any>{
        this.url = this.hostLocal + this.urlActualizarBoletaBaja;
        return this.httpClient.post<any>(this.url, {id: _id, numeroDocumento: numeroDocumento});
    }

}