import { Injectable } from '@angular/core';
import { LoginService } from 'app/service/login.service';
import { Observable } from 'rxjs/Observable';
import { Servidores } from '../servidores';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { FacturaErpDTO, FacturaIdDTO, FacturaErrorDTO, FacturaActualizarDTO } from '../../models/sincronizacion/facturaErpDTO';
import { comprobanteSincronizarDTO } from '../../models/sincronizacion/comprobanteSincronizarDTO';

@Injectable()
export class SincronizacionFacturas {
    private url: string = '';
    private hostLocal: string = this.servidores.HOSTLOCAL ;
    private urlObtenerFacturasLocales: string = '/sincronizacionFacturas';
    private urlEnviarFactura:string = '/api/factura';
    private urlActualizarFactura: string =  '/sincronizacionFacturas/actualizarSincronizacion';
    private urlActualizarFacturaErronea: string = '/sincronizacionFacturas/actualizarSincronizacionErronea';
    private urlActualizarEstadoComprobante: string = '/sincronizacionFacturas/actualizarEstadoComprobante';
    private urlObtenerComprobante: string = '/documento';
    private urlActualizarComprobanteLocal: string = '/sincronizacionFacturas/urlActualizarComprobanteLocal';
    private urlObtenerFacturas: string = '/documento/query';
    private urlSincronizacionFactura: string = '/sincronizacionFacturas';
    private urlActualizarFecha: string = '/sincronizacionFacturas/actualizarFecha';
    private urlObtenerFacturasBajas: string = '/sincronizacionFacturas/obtenerComunicacionBaja';
    private urlEnviarFacturasBaja: string = '/comunicacionesDeBaja';
    private urlActualizarErrorFacturaBaja: string = '/sincronizacionFacturas/actualizarErrorBaja';
    private urlActualizarFacturaBaja: string = '/sincronizacionFacturas/actualizarBaja'
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

    obtenerFacturasCreadas():Observable<any[]>{
        this.url = this.hostLocal + this.urlObtenerFacturasLocales;
        const parametros = new HttpParams();
        return this.httpClient.get(this.url, {params: parametros  }).map((data: any) => {        
                    // data.map(item =>{ this.convertirSincronizacionLongToDate(item)});
                    return data;
                })
    }

    enviarFacturasCreadas(factura):Observable<any>{
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
        this.url = this.servidores.DOCUCMD + this.urlEnviarFactura;
        return this.httpClient.post<FacturaErpDTO>(this.url, factura , {headers: this.getCabezera() } );
    }

    private convertirSincronizacionLongToDate(item){
        item.fechaEmision = Number(new Date (item.fechaEmision));
        item.facturasAfectadas.map( itemFactura => {
            itemFactura.fechaEmision = Number(new Date (itemFactura.fechaEmision));
        })
    }
    actualizarEstadoSincronizacionFactura(id):Observable<any>{
        let idFactura: FacturaIdDTO = new FacturaIdDTO();
        idFactura.id = id;
        this.url = this.hostLocal + this.urlActualizarFactura;
        return this.httpClient.post<FacturaIdDTO>(this.url, idFactura);
    }

    actualizarErrorFactura(id, error):Observable<any>{
        let facturaError: FacturaErrorDTO = new FacturaErrorDTO();
        facturaError.id = id;
        let errores : string = ''; 
        error.error.errors.forEach(element => {
            errores = errores + element + '. ';
        });
        facturaError.error = errores;
        this.url = this.hostLocal + this.urlActualizarFacturaErronea;
        console.log(facturaError);
        return this.httpClient.post<FacturaErrorDTO>(this.url, facturaError);
    }

    obtenerFacturasPendientes():Observable<any>{
        const parametros = new HttpParams();
        this.url = this.hostLocal + this.urlActualizarEstadoComprobante;
        return this.httpClient.get(this.url, {params: parametros });

    }


    obtenerFactura(id):Observable<any>{
        const parametroGetDocumento = new HttpParams().set('id', id);
        this.url = this.servidores.DOCUQRY + this.urlObtenerComprobante;
        return this.httpClient.get(this.url,{ params: parametroGetDocumento , headers: this.getCabezera() })
    }

    guardarFacturaPendientes(documento):Observable<any>{
        let facturaActualizar: FacturaActualizarDTO = new FacturaActualizarDTO();
        facturaActualizar.id = documento.inIdcomprobantepago;
        facturaActualizar.chEstadocomprobantepago = documento.chEstadocomprobantepago;
        facturaActualizar.chEstadocomprobantepagocomp = documento.chEstadocomprobantepagocomp;
        facturaActualizar.eventos = documento.eventos;
        this.url = this.hostLocal + this.urlActualizarComprobanteLocal;
        return this.httpClient.post<FacturaActualizarDTO>(this.url, facturaActualizar);
    }

    descargarFacturas(fecha):Observable<any>{
        var parts = fecha.split("-");
        let fechaDe = Number(new Date(new Date(parts[2], parts[1] - 1, parts[0])));
        console.log("fechaDe" + fechaDe.toString());
        const fechaAl = Number(new Date());
        const parametrosR = new HttpParams().set('idEntidadEmisora',localStorage.getItem('id_entidad'))
                    .set('tipoComprobanteTabla','10007')
                    .set('tipoComprobanteRegistro','01')
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
        this.url = this.servidores.DOCUQRY + this.urlObtenerFacturas;
        return this.httpClient.get(this.url,{ params: parametrosR, headers: this.getCabezera() });
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

    descargarFacturasPagina(pagina, fecha):Observable<any>{
        var parts = fecha.split("-");
        let fechaDe = Number(new Date(new Date(parts[2], parts[1] - 1, parts[0])));
        const fechaAl = Number(new Date());
        let parametrosFinal = new HttpParams().set('idEntidadEmisora',localStorage.getItem('id_entidad'))
                                                            .set('tipoComprobanteTabla','10007')
                                                            .set('tipoComprobanteRegistro','01')
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
        this.url = this.servidores.DOCUQRY + this.urlObtenerFacturas;
        return this.httpClient.get(this.url,{ params: parametrosFinal, headers: this.getCabezera() });
    }

    guardarFacturaDescargada(factura):Observable<any>{
        this.url = this.hostLocal + this.urlSincronizacionFactura;
        return this.httpClient.post<comprobanteSincronizarDTO>(this.url, factura);
    }

    actualizarFechaDescarga(fecha):Observable<any>{
        this.url = this.hostLocal + this.urlActualizarFecha;
        return this.httpClient.post<any>(this.url, {'fecha': fecha});
    }

    obtenerFacturaBajas():Observable<any>{
        this.url = this.hostLocal + this.urlObtenerFacturasBajas;
        const parametros = new HttpParams();
        return this.httpClient.get<any>(this.url,{ params: parametros });
    }

    enviarFacturaBaja(facturaBaja):Observable<any>{
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
        this.url = this.servidores.DOCUCMD + this.urlEnviarFacturasBaja;
        return this.httpClient.post<any>(this.url, facturaBaja , {headers: this.getCabezera() } );
    }

    actualizarErrorFacturaBaja(_id):Observable<any>{
        this.url = this.hostLocal + this.urlActualizarErrorFacturaBaja;
        let headers =  new HttpHeaders();
        return this.httpClient.post<any>(this.url, {id: _id}, {headers:headers });
    }

    actualizarFacturaBaja(_id,numeroDocumento):Observable<any>{
        this.url = this.hostLocal + this.urlActualizarFacturaBaja;
        return this.httpClient.post<any>(this.url, {id: _id, numeroDocumento: numeroDocumento});
    }

}