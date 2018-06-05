import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable, Observer } from 'rxjs/Rx';
import { Sincronizacion } from '../../models/sincronizacion/sincronizacion';
import { PersistenceService, StorageType } from 'angular-persistence';
import { BasePaginacion } from '../base.paginacion';
import { SpinnerService } from 'app/service/spinner.service';
import { Servidores } from '../servidores';
import { RetencionErpDTO, RetencionIdDTO, RetencionErrorDTO, RetencionActualizarDTO } from '../../models/sincronizacion/retencionErpDTO';
import { Headers, Http, RequestMethod, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { comprobanteSincronizarDTO } from '../../models/sincronizacion/comprobanteSincronizarDTO';
import { Factura } from '../../../comprobantes/modelos/factura';
import { LoginService } from 'app/service/login.service';
import { retencionesService } from '../../../../service/retencionesservice';

declare var swal: any;
@Injectable()
export class SincronizacionService {
    private urlObjeto: string;
    private cabeceraObjeto: string;
    private bitacoraSincronizado: string;
    public sincronizacion: string = '/sincronizacion/filtros';
    public objetoRetencion: string = "20";
    public urlSincronizacion: string = '/sincronizacionRetencion';
    public urlSincronizacionFactura: string = '/sincronizacionFacturas';
    public urlSincronizacionPercepcion: string = '/sincronizacionPercepcion';
    public urlSincronizacionBoleta: string = '/sincronizacionBoletas';
    public urlActualizarRetencion: string = '/sincronizacionRetencion/actualizarSincronizacion';
    public urlActualizarRetencionErronea: string = '/sincronizacionRetencion/actualizarSincronizacionErronea';
    public enviarSincronizacion: string = '/api/retencion';
    public urlObtenerRetenciones: string = '/documento/query';
    public urlEnviarPercepcion: string = '/api/percepcion';
    public urlEnviarBoleta: string = '/api/boleta';
    public urlActualizarComprobanteLocal: string = '/sincronizacionRetencion/actualizarComprobanteLocal';
    public urlActualizarEstadoComprobante: string = '/sincronizacionRetencion/actualizarEstadoComprobante';
    public urlActualizarEstadoComprobantePercepcion: string = '/sincronizacionPercepcion/actualizarEstadoComprobante';
    public urlActualizarEstadoComprobanteFactura: string = '/sincronizacionFacturas/actualizarEstadoComprobante';
    public urlActualizarEstadoComprobanteBoleta: string = '/sincronizacionBoletas/actualizarEstadoComprobante'
    public urlEnviarRetencion: string;
    public urlSincronizacionRetentecion: string;
    public url: string = '';
    public urlEnviarFactura: string = '/api/factura';
    public urlObtenerComprobante: string = '/documento';
    
    public urlMac = 'http://localhost:3000/v1/sincronizacion/consultarMac';
    constructor(private httpClient: HttpClient, private persistenceService: PersistenceService,
        private spinner: SpinnerService, private servidores: Servidores, private loginService: LoginService) {
        this.sincronizacion = this.servidores.HOSTLOCAL + this.sincronizacion;
        this.url = this.servidores.HOSTLOCAL + this.urlSincronizacion;
        this.urlEnviarRetencion = this.servidores.DOCUCMD + this.enviarSincronizacion;
        this.urlObtenerRetenciones = this.servidores.DOCUQRY + this.urlObtenerRetenciones;
        this.urlActualizarEstadoComprobante = this.servidores.HOSTLOCAL + this.urlActualizarEstadoComprobante;
        this.urlActualizarEstadoComprobantePercepcion = this.servidores.HOSTLOCAL + this.urlActualizarEstadoComprobantePercepcion;
        this.urlActualizarEstadoComprobanteFactura = this.servidores.HOSTLOCAL + this.urlActualizarEstadoComprobanteFactura;
        this.urlObtenerComprobante = this.servidores.DOCUQRY + this.urlObtenerComprobante;
        this.urlSincronizacionRetentecion = this.servidores.HOSTLOCAL + this.urlSincronizacion;
        this.urlActualizarRetencion = this.servidores.HOSTLOCAL  + this.urlActualizarRetencion;
        this.urlActualizarRetencionErronea = this.servidores.HOSTLOCAL + this.urlActualizarRetencionErronea;
        this.urlActualizarComprobanteLocal = this.servidores.HOSTLOCAL + this.urlActualizarComprobanteLocal;

    }

    obtenerMac(): BehaviorSubject<string> {
        let mac: BehaviorSubject<string> = new BehaviorSubject<string>(null);
        this.httpClient.get(this.urlMac,
            {responseType: 'text'}).subscribe(
            (data) => {
                mac.next(data);
            },
            error => {
                mac.next('ERROR');
            }
        );
        return mac;
    }

    get<T>(parametros: HttpParams, url: string = this.urlObjeto, nombreKeyJson: string = this.cabeceraObjeto): BehaviorSubject<[BasePaginacion, T[]]> {
        const that = this;
        //this.spinner.set(true);
        const number = Number(url);
        if (number >= 0) {
            parametros = parametros.set('pagina', number.toString())
                .set('limite', "10");
        } else {
            this.urlObjeto = url;
        }
        const basePaginacion: BasePaginacion = new BasePaginacion();
        const dataRetornar: BehaviorSubject<[BasePaginacion, T[]]> = new BehaviorSubject<[BasePaginacion, T[]]>([basePaginacion, []]);
        this.httpClient.get<T[]>(this.urlObjeto, {
            params: parametros
        }).map((item)=>{
            if(item.hasOwnProperty('_embedded')){
                if(item['_embedded'].hasOwnProperty('retenciones')){
                    item['_embedded']['retenciones'].map((retencion =>{
                        nombreKeyJson = 'retenciones'
                        if(retencion.generado == 1){
                            retencion.generado = 'OnLine';
                        }else{
                            retencion.generado = 'OffLine'
                        }
                        if(retencion.estadoSincronizado == 1){
                            retencion.estadoSincronizado = 'Sincronizado';
                        }else{
                            retencion.estadoSincronizado = 'No Sincronizado';
                        }
                    }));  
                }
                if(item['_embedded'].hasOwnProperty('percepciones')){
                    nombreKeyJson = 'percepciones'
                    item['_embedded']['percepciones'].map((percepcion =>{
                        if(percepcion.generado == 1){
                            percepcion.generado = 'OnLine';
                        }else{
                            percepcion.generado = 'OffLine'
                        }
                        if(percepcion.estadoSincronizado == 1){
                            percepcion.estadoSincronizado = 'Sincronizado';
                        }else{
                            percepcion.estadoSincronizado = 'No Sincronizado';
                        }
                    }));  
                }
                if(item['_embedded'].hasOwnProperty('facturas')){
                    console.log('facturass');
                    nombreKeyJson = 'facturas'
                    item['_embedded']['facturas'].map((percepcion =>{
                        if(percepcion.generado == 1){
                            percepcion.generado = 'OnLine';
                        }else{
                            percepcion.generado = 'OffLine'
                        }
                        if(percepcion.estadoSincronizado == 1){
                            percepcion.estadoSincronizado = 'Sincronizado';
                        }else{
                            percepcion.estadoSincronizado = 'No Sincronizado';
                        }
                    }));  
                }
                if(item['_embedded'].hasOwnProperty('boletas')){
                    nombreKeyJson = 'boletas'
                    item['_embedded']['boletas'].map((percepcion =>{
                        if(percepcion.generado == 1){
                            percepcion.generado = 'OnLine';
                        }else{
                            percepcion.generado = 'OffLine'
                        }
                        if(percepcion.estadoSincronizado == 1){
                            percepcion.estadoSincronizado = 'Sincronizado';
                        }else{
                            percepcion.estadoSincronizado = 'No Sincronizado';
                        }
                    }));  
                }
            }
            
            return item;
        }).take(1).
            subscribe(
            (data) => {
                this.spinner.set(false);
                const totalPaginas = data['page']['totalPages'] - 1;
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
            }
        );
        return dataRetornar;
    }

    setBitacoraSincronizado(bitacoraSincronizado: string) {
        this.bitacoraSincronizado = bitacoraSincronizado;
        this.persistenceService.remove('bitacora', StorageType.LOCAL);
        this.persistenceService.set('bitacora', this.bitacoraSincronizado, { type: StorageType.LOCAL, timeout: 3600000 });
        if (this.bitacoraSincronizado == this.objetoRetencion) {
            this.urlObjeto = "http://localhost:3000/v1/retenciones";
            this.cabeceraObjeto = "retenciones";
        }
        this.persistenceService.remove('urlObjeto', StorageType.LOCAL);
        this.persistenceService.set('urlObjeto', this.urlObjeto, { type: StorageType.LOCAL, timeout: 3600000 });
        this.persistenceService.remove('cabeceraObjeto', StorageType.LOCAL);
        this.persistenceService.set('cabeceraObjeto', this.cabeceraObjeto, { type: StorageType.LOCAL, timeout: 3600000 });
    }
    
    getBitacoraSincronizado(): string {
        this.bitacoraSincronizado = this.persistenceService.get('bitacora', StorageType.LOCAL);
        return this.bitacoraSincronizado;
    }

    getUrlObjeto(): string {
        this.urlObjeto = this.persistenceService.get('urlObjeto', StorageType.LOCAL);
        return this.urlObjeto;
    }

    buscarPorIdioma(idioma: number): BehaviorSubject<any[]> {
        let sincronizaciones: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
        const parametros = new HttpParams().set('idioma', idioma.toString());
        this.httpClient.get(this.sincronizacion, {
            params: parametros
        }).map(
            data => {
                const sincronizacion: any[] = data['_embedded'];
                return sincronizacion;
            }).subscribe(data => { 
                sincronizaciones.next(data);
            });
        return sincronizaciones;
    }
    actualizarSincronizacion(id: any): BehaviorSubject<any[]>{
        let retencion: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
        let retencionIdDTO: RetencionIdDTO;
        retencionIdDTO.id = id;
        this.httpClient.post<RetencionIdDTO>(this.urlActualizarRetencion, retencionIdDTO ).subscribe();
        return retencion;
    }
    sincronizarBoletas():BehaviorSubject<any[]>{
        this.spinner.set(true);
        this.tokenNuevo().subscribe(
            response => {
                console.log(response);
                localStorage.setItem('access_token', response.access_token);
                var expireDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                expireDate.setDate(expireDate.getDate()+1);
                localStorage.setItem('expires', expireDate.getTime().toString());
                localStorage.setItem('expires_in', response.expires_in);
                this.spinner.set(true);
                let boletas: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
                const parametros = new HttpParams();
                this.url = this.servidores.HOSTLOCAL + this.urlSincronizacionBoleta;
                this.httpClient.get(this.url, {params: parametros}).subscribe(
                    (data) => {
                        data.forEach(boleta => {
                            this.enviarBoletaSincronizacion(boleta);
                        });
                    },
                    error =>{

                    },
                    () => {
                        this.spinner.set(false);
                    }
                );
            },
            error =>{
                console.log(error);
                this.spinner.set(false);
                swal({
                    text: "No esta conectado a internet.",
                    type: 'error',
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-error",
                    confirmButtonText: 'CONTINUAR',
                });
            },
            () => {
                this.actualizarEstadoBoletas();
                this.spinner.set(false);
            }
        );
        return null;
    }
    enviarBoletaSincronizacion(boleta){
        this.validarToken();
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
        this.httpClient.post<RetencionErpDTO>(this.url, boleta , {headers:headers } ).subscribe( 
            (rpta) =>{
                this.actualizarEstadoRetencion(boleta.idComprobanteOffline);
            },
            error =>{
                this.actualizarErrorRetencion(boleta.idComprobanteOffline, error);
            },
            () =>{
                console.log('completado');
            })
    }
    sincronizarFacturas():BehaviorSubject<any[]>{
        this.spinner.set(true);
        this.tokenNuevo().subscribe(
            response => {
                console.log(response);
                localStorage.setItem('access_token', response.access_token);
                var expireDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                expireDate.setDate(expireDate.getDate()+1);
                localStorage.setItem('expires', expireDate.getTime().toString());
                localStorage.setItem('expires_in', response.expires_in);
                this.spinner.set(true);
                let facturas: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
                const parametros = new HttpParams();
                this.url = this.servidores.HOSTLOCAL + this.urlSincronizacionFactura;
                this.httpClient.get(this.url, {params: parametros}).subscribe(
                    data => {
                        if(data.length > 0){
                            data.forEach(factura => {
                                this.enviarFacturaSincronizacion(factura);
                            });

                        }
                    },
                    error =>{
                        
                    },
                    () => {
                        this.spinner.set(false);
                    }
                );
        },
        error =>{
            console.log(error);
                    this.spinner.set(false);
                    swal({
                        text: "No esta conectado a internet.",
                        type: 'error',
                        buttonsStyling: false,
                        confirmButtonClass: "btn btn-error",
                        confirmButtonText: 'CONTINUAR',
                    });
        },
        ()=>{
            this.actualizarEstadoFactura();
            this.spinner.set(false);  
        })
        return null;
    }
    
    enviarFacturaSincronizacion(factura){
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
        this.httpClient.post<RetencionErpDTO>(this.url, factura , {headers:headers } ).subscribe( 
            (rpta) =>{
                this.actualizarEstadoSincronizacionRetencion(factura.idComprobanteOffline);
            },
            error =>{
                console.log('ingresee', factura)
                this.actualizarErrorRetencion(factura.idComprobanteOffline, error);
            },
            () =>{
                console.log('completado');
            })
    }
    actualizarEstadoFactura(){
        const parametros = new HttpParams();
        this.httpClient.get(this.urlActualizarEstadoComprobanteFactura, {params: parametros}).subscribe(
            (data) => {
                data.forEach(element => {
                    const parametroGetDocumento = new HttpParams().set('id', element.id);
                    this.httpClient.get(this.urlObtenerComprobante,{ params: parametroGetDocumento }).subscribe( documento =>{
                        console.log('*******************************************');
                        console.log(documento);
                        let facturaActualizar: RetencionActualizarDTO = new RetencionActualizarDTO();
                        facturaActualizar.id = documento.inIdcomprobantepago;
                        facturaActualizar.chEstadocomprobantepago = documento.chEstadocomprobantepago;
                        facturaActualizar.chEstadocomprobantepagocomp = documento.chEstadocomprobantepagocomp;
                        facturaActualizar.eventos = documento.eventos;
                        this.httpClient.post<RetencionActualizarDTO>(this.urlActualizarComprobanteLocal, facturaActualizar).subscribe();
                    });
                });
            },
            (error) => {},
            () => {
                //this.descargarRetenciones();
                this.spinner.set(false);
            }
        );
    }
    actualizarEstadoBoletas(){
        const parametros = new HttpParams();
        this.httpClient.get(this.urlActualizarEstadoComprobanteBoleta, {params: parametros}).subscribe(
            (data) => {
                data.forEach(element => {
                    const parametroGetDocumento = new HttpParams().set('id', element.id);
                    this.httpClient.get(this.urlObtenerComprobante,{ params: parametroGetDocumento }).subscribe( documento =>{
                        console.log('*******************************************');
                        console.log(documento);
                        let boletaActualizar: RetencionActualizarDTO = new RetencionActualizarDTO();
                        boletaActualizar.id = documento.inIdcomprobantepago;
                        boletaActualizar.chEstadocomprobantepago = documento.chEstadocomprobantepago;
                        boletaActualizar.chEstadocomprobantepagocomp = documento.chEstadocomprobantepagocomp;
                        boletaActualizar.eventos = documento.eventos;
                        this.httpClient.post<RetencionActualizarDTO>(this.urlActualizarComprobanteLocal, boletaActualizar).subscribe();
                    });
                });
            },
            (error) => {},
            () => {
                //this.descargarRetenciones();
                this.spinner.set(false);
            }
        );
    }
    sincronizarPercepcion():BehaviorSubject<any[]>{
        this.spinner.set(true);
        this.tokenNuevo().subscribe(
            response => {
                console.log(response);
                localStorage.setItem('access_token', response.access_token);
                var expireDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                expireDate.setDate(expireDate.getDate()+1);
                localStorage.setItem('expires', expireDate.getTime().toString());
                localStorage.setItem('expires_in', response.expires_in);
                let percepciones: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
                const parametros = new HttpParams();
                this.url = this.servidores.HOSTLOCAL + this.urlSincronizacionPercepcion;
                this.httpClient.get(this.url, {params: parametros}).subscribe(
                    data => {
                        if(data.length > 0){
                            data.forEach(percepcion => {
                                this.enviarPercepcionSincronizacion(percepcion);
                            });
                        }
                    },
                    error =>{},
                    () => {
                        this.spinner.set(false);
                    }
                );   
            },
            error =>{
                console.log(error);
                this.spinner.set(false);
                swal({
                    text: "No esta conectado a internet.",
                    type: 'error',
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-error",
                    confirmButtonText: 'CONTINUAR',
                });
            },
            () => {
                this.actualizarEstadoPercepcion();
                this.spinner.set(false);
            }
        );
        return null;
    }
    actualizarEstadoPercepcion(){
        const parametros = new HttpParams();
        this.httpClient.get(this.urlActualizarEstadoComprobantePercepcion, {params: parametros}).subscribe(
            (data) => {
                data.forEach(element => {
                    const parametroGetDocumento = new HttpParams().set('id', element.id);
                    this.httpClient.get(this.urlObtenerComprobante,{ params: parametroGetDocumento }).subscribe( documento =>{
                        let PercepcionActualizar: RetencionActualizarDTO = new RetencionActualizarDTO();
                        PercepcionActualizar.id = documento.inIdcomprobantepago;
                        PercepcionActualizar.chEstadocomprobantepago = documento.chEstadocomprobantepago;
                        PercepcionActualizar.chEstadocomprobantepagocomp = documento.chEstadocomprobantepagocomp;
                        PercepcionActualizar.eventos = documento.eventos;
                        this.httpClient.post<RetencionActualizarDTO>(this.urlActualizarComprobanteLocal, PercepcionActualizar).subscribe();
                    });
                });
            },
            (error) => {},
            () => {
                //this.descargarRetenciones();
                this.spinner.set(false);
            }
        );
    }
    enviarPercepcionSincronizacion(percepcion){
        this.validarToken();
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
        this.httpClient.post<RetencionErpDTO>(this.url, percepcion , {headers:headers } ).subscribe( 
            (rpta) =>{
                this.actualizarEstadoSincronizacionRetencion(percepcion.idComprobanteOffline);
            },
            error =>{
                this.actualizarErrorRetencion(percepcion.idComprobanteOffline, error);
            },
            () =>{
                console.log('completado');
            })
    }
    listarPercepcionesNuevas():Observable<any[]>{
    }
   
    
    enviarRetencionSincronizacion(retencion):BehaviorSubject<any[]>{
        console.log('aun no aparece error');
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
        console.log(this.urlEnviarRetencion);
        this.httpClient.post<RetencionErpDTO>(this.urlEnviarRetencion, retencion , {headers:headers } ).subscribe( 
            (rpta) =>{
                this.actualizarEstadoSincronizacionRetencion(retencion.idComprobanteOffline);
            },
            error =>{
                this.actualizarErrorRetencion(retencion.idComprobanteOffline, error);
            },
            () =>{
                console.log('completado');
            });
        return null;

    }
    actualizarEstadoRetencion(id:any){
        const parametrosComprobante = new HttpParams().set('id', id);
        this.httpClient.get(this.urlObtenerComprobante,{ params: parametrosComprobante }).subscribe( data =>{
                                let retencionActualizar: RetencionActualizarDTO = new RetencionActualizarDTO();
                                retencionActualizar.id = data.inIdcomprobantepago;
                                retencionActualizar.chEstadocomprobantepago = data.chEstadocomprobantepago;
                                retencionActualizar.chEstadocomprobantepagocomp = data.chEstadocomprobantepagocomp;
                                retencionActualizar.eventos = data.eventos;
                                this.httpClient.post<RetencionActualizarDTO>(this.urlActualizarComprobanteLocal, retencionActualizar).subscribe();
                            });
    }

    actualizarEstadoSincronizacionRetencion(id){
        let idRetencion: RetencionIdDTO = new RetencionIdDTO();
        idRetencion.id = id;
        return this.httpClient.post<RetencionIdDTO>(this.urlActualizarRetencion, idRetencion).subscribe();
    }

    actualizarErrorRetencion(id:any, error:any){
        let retencionError: RetencionErrorDTO = new RetencionErrorDTO();
        retencionError.id = id;
        let errores : string = ''; 
        error.error.errors.forEach(element => {
            errores = errores + element + '. ';
        });
        retencionError.error = errores;
        console.log(retencionError);
        this.httpClient.post<RetencionErrorDTO>(this.urlActualizarRetencionErronea, retencionError).subscribe();
    }
    validarToken(){

    }
    convertirSincronizacionLongToDate(item){
        item.fechaEmision = Number(new Date (item.fechaEmision));
        item.facturasAfectadas.map( itemFactura => {
            itemFactura.fechaEmision = Number(new Date (itemFactura.fechaEmision));
        })
    }
    // sincronizarRetencion():BehaviorSubject<any[]>{
    //         data.forEach(retencion => {
    //             this.httpClient.post<RetencionErpDTO>(this.urlEnviarRetencion, retencion , {headers:headers } ).subscribe( (rpta) =>{
    //                 const parametrosComprobante = new HttpParams().set('id', rpta.id)
    //                 console.log('correcto');
    //                 this.httpClient.get(this.urlObtenerComprobante,{ params: parametrosComprobante }).subscribe( data =>{
    //                     let retencionActualizar: RetencionActualizarDTO = new RetencionActualizarDTO();
    //                     retencionActualizar.id = data.inIdcomprobantepago;
    //                     retencionActualizar.chEstadocomprobantepago = data.chEstadocomprobantepago;
    //                     retencionActualizar.chEstadocomprobantepagocomp = data.chEstadocomprobantepagocomp;
    //                     retencionActualizar.eventos = data.eventos;
    //                     this.httpClient.post<RetencionActualizarDTO>(this.urlActualizarComprobanteLocal, retencionActualizar).subscribe();
    //                 });
    //                 let idRetencion: RetencionIdDTO = new RetencionIdDTO();
    //                 idRetencion.id = rpta.id;
    //                 this.httpClient.post<RetencionIdDTO>(this.urlActualizarRetencion, idRetencion).subscribe();
    //                 //console.log(this.urlObtenerComprobante);
    //             },
    //             (error) => {
    
    //                 }
    //             );
    //             if(retencion.next == null){
    //                 console.log('ultimo elemento');
    //             }
    //         });

            // const fechaDe = 1488430800000;
            // const fechaAl = 1520053199059;
            // const parametrosR = new HttpParams().set('idEntidadEmisora',localStorage.getItem('id_entidad'))
            //             .set('tipoComprobanteTabla','10007')
            //             .set('tipoComprobanteRegistro','20')
            //             .set('fechaEmisionDel', fechaDe.toString())
            //             .set('fechaEmisionAl', fechaAl.toString())
            //             .set('tipoDocumento','')
            //             .set('nroDocumento','')
            //             .set('ticket','')
            //             .set('estado','')
            //             .set('nroSerie','')
            //             .set('correlativoInicial','')
            //             .set('correlativoFinal','')
            //             .set('nroPagina','0')
            //             .set('regXPagina','10')
            //             .set('ordenar','tsFechaemision')
            //             .set('fechaBajaAl','')
            //             .set('fechaBajaDel','')
            //             .set('ticketBaja','')
            //             .set('seriecorrelativo','')
            //             .set('ticketResumen','')
            //             .set('anticipo','N');
            // this.httpClient.get(this.urlObtenerRetenciones,{ params: parametrosR }).subscribe((retencionesInfo) =>{
            //     if(retencionesInfo.totalElements){
            //         for(let i=0; i * 20 < retencionesInfo.totalElements; i++){
            //             let parametrosFinal = new HttpParams().set('idEntidadEmisora',localStorage.getItem('id_entidad'))
            //                                                 .set('tipoComprobanteTabla','10007')
            //                                                 .set('tipoComprobanteRegistro','20')
            //                                                 .set('fechaEmisionDel', fechaDe.toString())
            //                                                 .set('fechaEmisionAl', fechaAl.toString())
            //                                                 .set('tipoDocumento','')
            //                                                 .set('nroDocumento','')
            //                                                 .set('ticket','')
            //                                                 .set('estado','')
            //                                                 .set('nroSerie','')
            //                                                 .set('correlativoInicial','')
            //                                                 .set('correlativoFinal','')
            //                                                 .set('nroPagina',i.toString())
            //                                                 .set('regXPagina', '20')
            //                                                 .set('ordenar','tsFechaemision')
            //                                                 .set('fechaBajaAl','')
            //                                                 .set('fechaBajaDel','')
            //                                                 .set('ticketBaja','')
            //                                                 .set('seriecorrelativo','')
            //                                                 .set('ticketResumen','')
            //                                                 .set('anticipo','N'); 
            //             this.httpClient.get(this.urlObtenerRetenciones,{ params: parametrosFinal }).subscribe( (retencionesCompletas) =>{
            //                 retencionesCompletas.content.forEach(element => {
            //                     console.log(element);    
            //                     this.httpClient.post<comprobanteSincronizarDTO>(this.urlSincronizacionRetentecion, element).subscribe();
            //                 });
            //             });  
            //         }
            //     }           
            // });
    //     });
    //     return retenciones;
    // }
    
    
    actualizarComprobanteLocal(data):Observable<any>{
        console.log('actualizarComprobante');
        let actualizacion: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]); 
        let retencionActualizar: RetencionActualizarDTO = new RetencionActualizarDTO();
        retencionActualizar.id = data.inIdcomprobantepago;
        retencionActualizar.chEstadocomprobantepago = data.chEstadocomprobantepago;
        retencionActualizar.chEstadocomprobantepagocomp = data.chEstadocomprobantepagocomp;
        retencionActualizar.eventos = data.eventos;
        this.httpClient.post<RetencionActualizarDTO>(this.urlActualizarComprobanteLocal, retencionActualizar).subscribe(
            data =>{
                console.log('actualizarComprobanteLocal');
            }
        );
        return actualizacion;
    }
    descargarRetenciones(){
        const fechaDe = Number(new Date('03/15/2018'));
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
        this.httpClient.get(this.urlObtenerRetenciones,{ params: parametrosR }).subscribe(
            (retencionesInfo) => {
                if(retencionesInfo.totalElements){
                    for(let i=0; i * 20 < retencionesInfo.totalElements; i++){
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
                                                        .set('nroPagina',i.toString())
                                                        .set('regXPagina', '20')
                                                        .set('ordenar','tsFechaemision')
                                                        .set('fechaBajaAl','')
                                                        .set('fechaBajaDel','')
                                                        .set('ticketBaja','')
                                                        .set('seriecorrelativo','')
                                                        .set('ticketResumen','')
                                                        .set('anticipo','N'); 
                        this.httpClient.get(this.urlObtenerRetenciones,{ params: parametrosFinal }).subscribe( 
                            (retencionesCompletas) => {
                                retencionesCompletas.content.forEach(element => {
                                    this.httpClient.post<comprobanteSincronizarDTO>(this.urlSincronizacionRetentecion, element).subscribe();
                                });
                            });  
                    }
                }
            },
            (error) => {},
            () => {
                this.spinner.set(false);
            }
        );
    }


    sincronizarRetencion():BehaviorSubject<any[]>{
        this.spinner.set(true);
        let retenciones: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);  
        this.tokenNuevo().subscribe(
            response => {
                localStorage.setItem('access_token', response.access_token);
                var expireDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                expireDate.setDate(expireDate.getDate()+1);
                localStorage.setItem('expires', expireDate.getTime().toString());
                localStorage.setItem('expires_in', response.expires_in);
                this.listarRetencionesNuevas().subscribe(
                    data => {
                        if (data != null){
                            data.forEach( retencion => {
                                this.enviarRetencionSincronizacion(retencion);
                            })
                        }
                    },
                    error =>{
                        console.log('error');
                        
                    },
                    () => {
                        this.actualizarEstadoComprobantes().subscribe();
                    });
            },
            error =>{
                console.log(error);
                this.spinner.set(false);
                swal({
                    text: "No esta conectado a internet.",
                    type: 'error',
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-error",
                    confirmButtonText: 'CONTINUAR',
                });
            },
            () => {
                this.spinner.set(false);
            }
        );        
        return retenciones;
    }

    actualizarEstadoComprobantes():Observable<any[]>{
        const parametros = new HttpParams();
        let actualizarEstadoComprobante: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]); 
        this.httpClient.get(this.urlActualizarEstadoComprobante, {params: parametros}).subscribe(
            (data) => {
                if (data != null)
                {
                    data.forEach(async element => {
                        await this.obtenerComprobantes(element.id).toPromise();
                    });
                }
            },
            (error) => {},
            () => {
                console.log('actualizar estado comprobante');
                //this.descargarRetenciones();
            }
        );
        return actualizarEstadoComprobante;
    }

    obtenerComprobantes(id):Observable<any[]>{
        let documento: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]); 
        const parametroGetDocumento = new HttpParams().set('id', id);
        this.httpClient.get(this.urlObtenerComprobante,{ params: parametroGetDocumento }).subscribe( data =>{
                console.log('*****************entro?**************************');
                console.log(data);
                //this.actualizarComprobanteLocal(data).subscribe();
            },
            error =>{
                console.log(error);
            },
            () => {
                console.log("finaliz");
            });
        return documento;
    }

    tokenNuevo():Observable<any[]>{ 
        return this.loginService.login(localStorage.getItem('username'), localStorage.getItem('passwordActual'));
    }

    guardarRetencionesNuevas():Observable<any[]>{

    }

    obtenerRetencionesNuevas():Observable<any[]>{
        this.spinner.set(true);
        let retenciones: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);  
        this.tokenNuevo().subscribe(
            response => {
                localStorage.setItem('access_token', response.access_token);
                var expireDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                expireDate.setDate(expireDate.getDate()+1);
                localStorage.setItem('expires', expireDate.getTime().toString());
                localStorage.setItem('expires_in', response.expires_in);
                let retenciones: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);    
                const parametros = new HttpParams();
                this.url = this.servidores.HOSTLOCAL + this.urlSincronizacion;
                return this.httpClient.get(this.url, {params: parametros  }).map((data: any) => {        
                            data.map(item =>{ this.convertirSincronizacionLongToDate(item)});
                            return data;
                        })
            },
            error =>{
                console.log(error);
                this.spinner.set(false);
                swal({
                    text: "No esta conectado a internet.",
                    type: 'error',
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-error",
                    confirmButtonText: 'CONTINUAR',
                });
            },
            () => {
                this.spinner.set(false);
            }
        );        
        return retenciones;
    }
}
