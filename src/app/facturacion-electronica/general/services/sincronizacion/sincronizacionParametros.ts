import { Injectable } from '@angular/core';
import { LoginService } from 'app/service/login.service';
import { Observable } from 'rxjs/Observable';
import { Servidores } from '../servidores';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { PercepcionErpDTO, PercepcionIdDTO, PercepcionErrorDTO, PercepcionActualizarDTO } from '../../models/sincronizacion/percepcionErpDTO';
import { comprobanteSincronizarDTO } from '../../models/sincronizacion/comprobanteSincronizarDTO';
import { BehaviorSubject } from 'rxjs';
import { DtoIdioma } from '../../../../model/dtoIdioma';
import { DtoEvento } from '../../../../model/dtoEvento';
import { DtoMaestra } from '../../../../model/dtoMaestra';
import { DtoParametroEntidad } from '../../../../model/dtoParametroEntidad';
import { DtoTipoEntidad } from '../../../../model/dtoTipoEntidad';
import { DtoQueryEstado } from '../../../../model/dtoQueryEstado';
import { DtoEntidad } from '../../../../model/dtoEntidad';
import { DtoDocumentoAzure } from '../../../../model/dtoDocumentoAzure';
import { DtoSeries } from '../../../../model/DtoSeries';
import { DtoQueryParametro } from '../../../../model/dtoQueryParametro';
import { DtoQueryTipoPrecioVenta } from '../../../../model/dtoQueryTipoPrecioVenta';
import { DtoQueryTipoAfectacionIgv } from '../../../../model/dtoQueryTipoAfectacionIgv';
import { DtoQueryTipoCalcIsc } from '../../../../model/dtoQueryTipoCalcIsc';
import { DtoConcepto } from '../../../../model/dtoConcepto';
import { DtoUsuarioEbiz } from '../../../../model/dtoUsuarioEbiz';

@Injectable()
export class SincronizacionParametros {
    private url: string = '';
    private hostLocal: string = this.servidores.HOSTLOCAL ;
    public idiomaDTO: DtoIdioma[] = [];
    public eventoDTO: DtoEvento[] = [];
    public maestraDTO: DtoMaestra = new DtoMaestra();
    public paremetroEntidadDTO: DtoParametroEntidad[] = [];
    public tipoEntidadDTO: DtoTipoEntidad[] = [];
    public queryEstadoDTO: DtoQueryEstado[] = [];
    public entidadDTO: DtoEntidad = new DtoEntidad();
    public serieDTO: DtoSeries[] = [];
    public queryParametrosDto: DtoQueryParametro[] = [];
    public queryTipoPrecioVentaDto: DtoQueryTipoPrecioVenta[] = [];
    public queryTipoAfectacionIgv: DtoQueryTipoAfectacionIgv[] = [];
    public queryTipoCalculoIsc: DtoQueryTipoCalcIsc[] = [];
    public conceptos: DtoConcepto[] = [];
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

    public eliminarIdioma(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/idiomaEliminar';
        const salida = new BehaviorSubject<any>(null);    
        return this.httpClient.post<any>(url, {});    
    }

    public guardarIdioma():  Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/idioma';
        this.idiomaDTO = [{id:'1', descripcion:'ES', descripcionCorta: 'Español'},
                            {id:'2', descripcion:'EN', descripcionCorta: 'Ingles'}];
        const salida = new BehaviorSubject<any>(null);    
        return this.httpClient.post<DtoIdioma[]>(url, this.idiomaDTO);    
    }

    public guardarIdiomaQuery() :  Observable<any>{
        let url = this.servidores.HOSTLOCAL +  '/sincronizacion/queryIdioma';
        this.idiomaDTO = [{id:'1', descripcion:'ES', descripcionCorta: 'Español'},
                        {id:'2', descripcion:'EN', descripcionCorta: 'Ingles'}];
        return this.httpClient.post<DtoIdioma[]>(url, this.idiomaDTO);
    }

    public eliminarIdiomaQuery(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/idiomaEliminarQuery';
        const salida = new BehaviorSubject<any>(null);    
        return this.httpClient.post<any>(url, {});    
    }

    public guardarEvento(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/evento';
        const salida = new BehaviorSubject<any>(null);
        this.eventoDTO =  [{id: '10', idioma:'1', descripcion:'Almacenado' },
                                        {id:'20', idioma:'1', descripcion:'Rechazado' },
                                        {id:'30', idioma:'1', descripcion:'Pdf Generado' },
                                        {id:'40', idioma:'1', descripcion:'Notificacion enviada' },
                                        {id:'50', idioma:'1', descripcion:'UBL Generado' },
                                        {id:'60', idioma:'1', descripcion:'CDR Generado' },
                                        {id:'70', idioma:'1', descripcion:'Respuesta conector' }];
        return this.httpClient.post<DtoEvento[]>(url, this.eventoDTO);
    }

    public eliminarEvento(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/eventoEliminar';
        const salida = new BehaviorSubject<any>(null);    
        return this.httpClient.post<any>(url, {});    
    }

    public eliminarMaestra(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/maestraEliminar';
        const salida = new BehaviorSubject<any>(null);    
        return this.httpClient.post<any>(url, {});    
    }

    public obtenerMaestra(): Observable<any>{
        let url = this.servidores.PARMQRY + '/maestra';
        const parametros = new HttpParams();
        return this.httpClient.get(url, { params: parametros });
    }
    public guardarMaestra(data): Observable<any>{
        let listaMaestra: DtoMaestra[] = [];
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/maestra';
        data._embedded.maestraRedises.forEach(element => {
            this.maestraDTO = new DtoMaestra();
            this.maestraDTO.organizacion = element.organizacion;
            this.maestraDTO.tabla = element.tabla;
            this.maestraDTO.codigo = element.codigo;
            this.maestraDTO.descripcionCorta = element.descripcionCorta;
            this.maestraDTO.descripcionLarga = element.descripcionLarga;
            this.maestraDTO.descripcionLargaIngles = element.descripcionLargaIngles;
            this.maestraDTO.iso = element.iso;
            this.maestraDTO.habilitado = element.habilitado;
            this.maestraDTO.idMaestra = element.idMaestra;
            listaMaestra.push(this.maestraDTO)
        });
        return this.httpClient.post<DtoMaestra[]>(url, listaMaestra);
    }

    public guardarParemetroEntidad(): Observable<any>{
        this.paremetroEntidadDTO = [{id:'1', descripcion:'Pais'},
                                    {id:'2', descripcion:'Tipos de documentos de identidad'},
                                    {id:'3', descripcion:'Ubigeo'},
                                    {id:'4', descripcion:'Clave SOL'},
                                    {id:'5', descripcion:'Certificado Digital'},
                                    {id:'6', descripcion:'Logo'},
                                    {id:'7', descripcion:'Plantilla Factura'},
                                    {id:'8', descripcion:'Plantilla Boleta'},
                                    {id:'9', descripcion:'Plantilla Nota Credito'},
                                    {id:'10', descripcion:'Plantilla Nota Debito'},
                                    {id:'11', descripcion:'Plantilla Guia Remision'},
                                    {id:'12', descripcion:'Plantilla Retencion'},
                                    {id:'13', descripcion:'Plantilla Percepcion'},
                                    {id:'14', descripcion:'Recibir Notificaciones'}];
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/parametroEntidad'
        return this.httpClient.post<DtoParametroEntidad[]>(url, this.paremetroEntidadDTO);
    }
    

    public eliminarParametrosEntidad(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/paremetroEntidadEliminar';
        const salida = new BehaviorSubject<any>(null);    
        return this.httpClient.post<any>(url, {});    
    }


    public guardarTipoEntidad(): Observable<any>{
        let fecha = new Date();
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/tipoEntidad';
        this.tipoEntidadDTO = [{id:'1', descripcion:'Emisor', usuarioCreacion: 'Offline', usuarioModificacion: 'Offline', fechaCreacion: fecha.toString() , fechaModificacion: fecha.toString(), estado: ''},
                               {id:'2', descripcion:'Receptor', usuarioCreacion: 'Offline', usuarioModificacion: 'Offline', fechaCreacion: fecha.toString() , fechaModificacion: fecha.toString(), estado: ''}];
        return this.httpClient.post<DtoTipoEntidad[]>(url, this.tipoEntidadDTO);
    }

    public eliminarTipoEntidad(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/eliminarTipoEntidad';
        const salida = new BehaviorSubject<any>(null);    
        return this.httpClient.post<any>(url, {});    
    }

    public eliminarQueryEstado(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/eliminarQueryEstado';
        const salida = new BehaviorSubject<any>(null);    
        return this.httpClient.post<any>(url, {});    
    }

    public guardarQueryEstado(): Observable<any>{
        let fecha = new Date();
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/queryEstado';
        this.queryEstadoDTO = [{id:'1', idioma:'1', descripcion: 'Pendiente de Envio',abreviatura: 'Pendiente' },
                               {id:'2', idioma:'1', descripcion: 'Bloqueado',abreviatura: 'Bloqueado'},
                               {id:'3', idioma:'1', descripcion: 'Autorizado',abreviatura: 'Autorizado'},
                               {id:'4', idioma:'1', descripcion: 'Autorizado con Observaciones',abreviatura: 'Autorizado con Obs.'},
                               {id:'5', idioma:'1', descripcion: 'Rechazado',abreviatura: 'Rechazado'},
                               {id:'6', idioma:'1', descripcion: 'Dado de Baja',abreviatura: 'Baja'},
                               {id:'99', idioma:'1', descripcion: 'Error',abreviatura: 'Error'}];
        return this.httpClient.post<DtoQueryEstado[]>(url, this.queryEstadoDTO);
    }
    

    public obtenerEntidad(): Observable<any>{
        const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
        const access_token = localStorage.getItem('access_token');
        const token_type = 'Bearer';
        const ocp_apim_subscription_key = localStorage.getItem('Ocp_Apim_Subscription_Key');
        const origen_datos = 'PEB2M';
        const tipo_empresa = usuario.tipo_empresa;
        const org_id = usuario.org_id;
        const parametros = new HttpParams();
        let url = this.servidores.ORGAQRY + '/organizaciones/' + org_id ;
        let headers = new HttpHeaders()
                        .set("Authorization", token_type + ' ' + access_token)
                        .set("Content-Type", 'application/json')
                        .set('Accept', 'application/json')
                        .set('Ocp-Apim-Subscription-Key', '07a12d074c714f62ab037bb2f88e30d3')
                        .set('origen_datos', 'PEB2M')
                        .set('tipo_empresa', tipo_empresa)
                        .set('org_id', org_id);
        return this.httpClient.get(url, { params: parametros , headers: headers });
    }
    
    public guardarEntidad(data: any): Observable<any>{
        this.entidadDTO.id = data.id;
        this.entidadDTO.documento = data.documento;
        this.entidadDTO.denominacion = data.denominacion;
        this.entidadDTO.nombreComercial = data.nombreComercial;
        this.entidadDTO.direccion = data.direccionFiscal;
        this.entidadDTO.correo = data.correoElectronico;
        this.entidadDTO.logo = data.logo;
        this.entidadDTO.pais = data.pais;
        this.entidadDTO.ubigeo = data.ubigeo;
        this.entidadDTO.tipoDocumento = data.tipoDocumento ;
        this.entidadDTO.idTipoDocumento = data.idTipoDocumento;
        this.entidadDTO.idEbiz = data.idEbiz;
        this.entidadDTO.usuarioCreacion = data.usuarioCreacion;
        this.entidadDTO.usuarioModificacion = data.usuarioModificacion;
        this.entidadDTO.fechaCreacion = data.fechaCreacion;
        this.entidadDTO.fechaModificacion = data.fechaModificacion;
        this.entidadDTO.estado = data.estado;
        let url = this.servidores.HOSTLOCAL +  '/sincronizacion/entidad';
        return this.httpClient.post<DtoEntidad>(url, this.entidadDTO);
    }

    public eliminarEntidad(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/entidadEliminar';
        const salida = new BehaviorSubject<any>(null);    
        return this.httpClient.post<any>(url, {});    
    }

    public eliminarDocumentoAzure(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/eliminarDocumentosAzure';
        const salida = new BehaviorSubject<any>(null);
        return this.httpClient.post<any>(url,{});
    }
    
    
    public eliminarSerie(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/eliminarSerie';
        const salida = new BehaviorSubject<any>(null);
        return this.httpClient.post<any>(url,{});
    }

    public eliminarParametro(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/eliminarParametro';
        const salida = new BehaviorSubject<any>(null);
        return this.httpClient.post<any>(url,{});
    }

    public obtenerParametros(): Observable<any>{
        let url = this.servidores.PARMQRY + '/parametros';
        const parametros = new HttpParams();
        return this.httpClient.get(url, { params: parametros  });
    }

    public guardarParametro(data): Observable<any>{
        this.queryParametrosDto = []
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/parametros';
        data._embedded.parametroRedises.forEach(element => {
            let parameto = new DtoQueryParametro();
            parameto = element;
            this.queryParametrosDto.push(parameto);
        });
        return this.httpClient.post<DtoQueryParametro[]>(url, this.queryParametrosDto);
    }


    public guardarSerie(data): Observable<any>{
        this.serieDTO = [];
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/querySerie';
        data._embedded.serieRedises.forEach(element => {
            let serie : DtoSeries = new DtoSeries();
            serie.correlativo = element.correlativo;
            serie.idTipoSerie = element.idTipoSerie;
            serie.direccion = element.direccion;
            serie.estado = "";
            serie.idEntidad = element.idEntidad;
            serie.idSerie = element.idSerie;
            serie.idTipoComprobante = element.idTipoComprobante;
            serie.serie = element.serie;
            serie.idUbigeo = element.idUbigeo ,
            serie.codigoUbigeo = element.codigoUbigeo ;
            this.serieDTO.push(serie);
        });
        return this.httpClient.post<DtoSeries[]>(url, this.serieDTO );
    }

    public guardarDocumentoAzure(id, idEntidad, tipoComprobante ,logoEbiz, logoEmpresa, plantilla): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/documentoAzure';
        const parametros = new HttpParams();
        let documentoAzure = new DtoDocumentoAzure();
        documentoAzure.id = id;
        documentoAzure.idEntidad = idEntidad;
        documentoAzure.logoEbiz = logoEbiz;
        documentoAzure.logoEntidad = logoEmpresa;
        documentoAzure.plantillaPdf = plantilla;
        documentoAzure.tipoComprobante = tipoComprobante;
        this.httpClient.post<DtoDocumentoAzure>(url, documentoAzure).subscribe();
        return new Observable();
    }
    public obtenerAzure(nombre): Observable<any>{
        let url = this.servidores.FILEQRY + "/archivos/search?nombre_archivo="+nombre;
        const parametros = new HttpParams();
        let salida = new Observable<any>();
        return this.httpClient.get(url, { params: parametros, responseType: "text/plain" });
    }

    public obtenerSerie(): Observable<any>{
        let url = this.servidores.PARMQRY + '/seriess';
        const parametros = new HttpParams();
        return this.httpClient.get(url, { params: parametros  });
    }

    public obtenerTipoPrecioVenta(): Observable<any>{
        let url = this.servidores.PARMQRY + '/tipoprecioventa';
        const parametros = new HttpParams();
        return this.httpClient.get(url, {params: parametros});
    }

    public guardarTipoPrecioVenta(data): Observable<any>{
        this.queryTipoPrecioVentaDto = []
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/tipoprecioventa';
        data._embedded.tipoPrecioVentaRedises.forEach(element => {
            let tipoPrecioVenta = new DtoQueryTipoPrecioVenta();
            tipoPrecioVenta = element;
            this.queryTipoPrecioVentaDto.push(tipoPrecioVenta);
        });
        return this.httpClient.post<DtoQueryTipoPrecioVenta[]>(url, this.queryTipoPrecioVentaDto);
    }


    public obtenerTipoAfectacionIgv(): Observable<any>{
        let url = this.servidores.PARMQRY + '/tipoafectacionigv';
        const parametros = new HttpParams();
        return this.httpClient.get(url, {params: parametros})
    }

    public guardarTipoAfectacionIgv(data): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/queryTipoAfecacionIgv'
        this.queryTipoAfectacionIgv = [];
        data._embedded.tipoAfectacionIgvRedises.forEach(element => {
            let tipoAfecacionIgv = new DtoQueryTipoAfectacionIgv();
            tipoAfecacionIgv = element;
            this.queryTipoAfectacionIgv.push(tipoAfecacionIgv);
        });
        return this.httpClient.post<DtoQueryTipoAfectacionIgv[]>(url, this.queryTipoAfectacionIgv);
    }

    public obtenerTipoCalculoIsc(): Observable<any>{
        let url = this.servidores.PARMQRY + '/tipocalculoisc';
        const parametros = new HttpParams();
        return this.httpClient.get(url, {params: parametros});
    }

    public guardarTipoCalculoIsc(data): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/queryTipoCalcIsc';
        this.queryTipoCalculoIsc = [];
        data._embedded.tipoCalculoIscRedises.forEach(element => {
            let tipoCalculoIsc = new DtoQueryTipoCalcIsc();
            tipoCalculoIsc = element;
            this.queryTipoCalculoIsc.push(tipoCalculoIsc);
        });
        return this.httpClient.post<DtoQueryTipoCalcIsc[]>(url, this.queryTipoCalculoIsc);
    }
    public obtenerConceptos(): Observable<any>{
        let url = this.servidores.PARMQRY + '/concepto';
        const parametros = new HttpParams();
        return this.httpClient.get(url, {params: parametros});
    }

    public guardarConcepto(data): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/concepto';
        this.conceptos = [];
        data._embedded.conceptoRedises.forEach(element => {
            let concepto = new DtoConcepto();
            concepto = element;
            this.conceptos.push(concepto);
        });
        return this.httpClient.post<DtoConcepto[]>(url, this.conceptos);
    }

    public eliminarTipoPrecioVenta(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/eliminarTipoPrecioVenta';
        const salida = new BehaviorSubject<any>(null);
        return this.httpClient.post<any>(url,{});
    }

    public eliminarTipoAfectacionIgv(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/eliminarTipoAfectacionIgv';
        const salida = new BehaviorSubject<any>(null);
        return this.httpClient.post<any>(url,{});
    }

    public eliminarTipoCalculoIsc(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/eliminarTipoCalculoIsc';
        const salida = new BehaviorSubject<any>(null);
        return this.httpClient.post<any>(url,{});
    }
    public eliminarConcepto(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/eliminarConcepto';
        const salida = new BehaviorSubject<any>(null);
        return this.httpClient.post<any>(url,{});
    }
    public eliminarUsuarios(): Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/eliminarUsuarios';
        const salida = new BehaviorSubject<any>(null);
        return this.httpClient.post<any>(url,{});
    }
    
    public guardarUsuariosOffline(data):Observable<any>{
        let url = this.servidores.HOSTLOCAL + '/sincronizacion/guardarUsuarios';
        return this.httpClient.post<DtoUsuarioEbiz>(url, data);
    }

    public obtenerUsuariosOffline(ruc):Observable<any>{
        let url = this.servidores.ebiz + '/offorg/';
        const parametros = new HttpParams().set('ruc_emisor', ruc);  
        let headers = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem('access_token'))
                                        .set("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'))
                                        .set("origen_datos", 'OFFLINE');
        return this.httpClient.get(url, { params: parametros, headers: headers} );
    }
}