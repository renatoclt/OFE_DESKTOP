import { Injectable } from '@angular/core';
import { Headers, Http, RequestMethod, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import {
    OAUTH_CLIENT_SECRET,
    OAUTH_GRANT_TYPE,
    OCP_APIM_SUBSCRIPTION_KEY,
    URL_GET_USER,
    URL_OAUTH,
    URL_OAUTH_CLIENT_ID,
    URL_OAUTH_KILL
} from '../utils/app.constants'
import { MENSAJE_ERROR_BAD_CREDENTIALS, MENSAJE_ERROR_GENERICO } from '../utils/messages.constants';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Usuario } from 'app/model/usuario';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { URL_MENU } from 'app/utils/app.constants';
import { Servidores } from "../facturacion-electronica/general/services/servidores";
import { Boton, Menu, Modulo, RootMenu } from 'app/model/menu';
import { DtoEvento } from 'app/model/dtoEvento';
import { DtoIdioma } from 'app/model/dtoIdioma';
import { DtoMaestra } from 'app/model/dtoMaestra';
import { Servicio } from 'app/model/retenciones';
import { DtoTipoEntidad } from 'app/model/dtoTipoEntidad';
import { DtoEntidad } from 'app/model/dtoEntidad';
import { DtoParametroEntidad } from 'app/model/dtoParametroEntidad';
import { Console } from '@angular/core/src/console';
import { DtoSeries } from 'app/model/DtoSeries';
import { DtoUsuario } from 'app/model/dtoUsuario';
import { DtoQueryEstado } from 'app/model/dtoQueryEstado';
import { DtoDocumentoAzure } from 'app/model/dtoDocumentoAzure';
import { DtoQueryParametro } from '../model/dtoQueryParametro';
import { DtoQueryTipoPrecioVenta } from '../model/dtoQueryTipoPrecioVenta';
import { DtoQueryTipoAfectacionIgv } from '../model/dtoQueryTipoAfectacionIgv';
import { DtoQueryTipoCalcIsc } from '../model/dtoQueryTipoCalcIsc';
import { DtoConcepto } from '../model/dtoConcepto';
import { Login } from '../model/login';
import { DtoEmpresaLocal } from '../model/dtoEmpresaLocal';
import { DtoUsuarioEbiz } from '../model/dtoUsuarioEbiz';
declare var DatatableFunctions;
declare var swal: any;
@Injectable()
export class LoginService {
    
    constructor(public http: Http, public router: Router, public httpClient: HttpClient, private _servidores: Servidores) { }
    private urlGetUser: string = URL_GET_USER;
    //public eventoDTOlist: DtoEvento[] =[];
    public eventoDTO: DtoEvento[] = [];
    public idiomaDTO: DtoIdioma[] = [];
    public usuarioDTO: DtoUsuario[] = [];
    public queryEstadoDTO: DtoQueryEstado[] = [];
    public conceptos: DtoConcepto[] = [];
    public paremetroEntidadDTO: DtoParametroEntidad[] = [];
    public maestraDTO: DtoMaestra = new DtoMaestra();
    public entidadDTO: DtoEntidad = new DtoEntidad();
    public queryParametrosDto: DtoQueryParametro[] = [];
    public tipoEntidadDTO: DtoTipoEntidad[] = [];
    public serieDTO: DtoSeries[] = [];
    public documentoAzureDTO: DtoDocumentoAzure[] = [];
    public queryTipoPrecioVentaDto: DtoQueryTipoPrecioVenta[] = [];
    public queryTipoAfectacionIgv: DtoQueryTipoAfectacionIgv[] = [];
    public queryTipoCalculoIsc: DtoQueryTipoCalcIsc[] = [];
    public isAuthenticated(): boolean {
        var expires = new Date(Number(localStorage.getItem('expires')));
        var currentDate = new Date();
        return (currentDate <= expires);
    }
    public ObtenerBotonesCache(url): Boton[] {

        let root = JSON.parse(localStorage.getItem("RootMenu")) as RootMenu;
        let modulo = this.ObtenerModulo(url);

        if (modulo && modulo.botones) {
            console.log('botenes', modulo.botones);
            return modulo.botones;
        }
        else return null;
    }

    private ObtenerModulo(url): Modulo {
        let root = JSON.parse(localStorage.getItem("RootMenu")) as RootMenu;
        let modulo;
        for (let menu of root.menus) {
            modulo = menu.modulos.find(a => a.moduloUri === url);
            if (modulo)
                break;
        }
        console.log('Botenes ObtenerMOdulo', modulo);
        return modulo;

    }

    public login(username, password): Observable<any> {
        let headers = new Headers();
        headers.set("Authorization", "Basic " + btoa(URL_OAUTH_CLIENT_ID + ":" + OAUTH_CLIENT_SECRET));
        headers.set("Ocp-Apim-Subscription-Key", OCP_APIM_SUBSCRIPTION_KEY);
        let params = new URLSearchParams();
        params.append("grant_type", OAUTH_GRANT_TYPE);
        params.append("username", username.trim().toUpperCase());
        params.append("password", password);

        //TODO HARDCODE
        localStorage.setItem('id_entidad', '1');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(`${URL_OAUTH}/token`, params, options).map(this.handleData)
            .catch(this.handleError);
    }

    public obtenerIdEntidad(ruc: string) {
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
            .set('Ocp-Apim-Subscription-Key', ocp_apim_subscription_key)
            .set('origen_datos', origen_datos)
            .set('tipo_empresa', tipo_empresa)
            .set('org_id', org_id);


      const parametros = new HttpParams()
        .set('ruc', ruc);
      const urlOrganizacion = this._servidores.ORGAQRY + '/organizaciones/' + ruc;
      this.httpClient.get( urlOrganizacion, {
        headers: headers
      }).subscribe(
        data => {
          if ( data ) {
            console.log('-----entro-----');

            localStorage.setItem('id_entidad', data['id'] );
            localStorage.setItem('org_direccion', data['direccionFiscal']);
            localStorage.setItem('org_email', data['correoElectronico']);
          }
        }
      );
    }

    obtenerUser(): Observable<Usuario> {

        let items$ = this.http

            .get(this.urlGetUser,
            { headers: this.getHeaders() })
            .map(this.mapUserData)
            .catch(this.handleError);
        return items$;
    }
    guardarBotonesLocalStore(url: string, botones: Boton[]) {

        let root = JSON.parse(localStorage.getItem("RootMenu")) as RootMenu;
        let modulo;
        for (let menu of root.menus) {
            modulo = menu.modulos.find(a => a.moduloUri === url);
            if (modulo)
                break;
        }
        modulo.botones = botones;
        localStorage.setItem("RootMenu", JSON.stringify(root));
    }
    obtenerBotones(url): Observable<Boton[]> {
        let modulo = this.ObtenerModulo(url) as Modulo;
        let item_id = modulo.idModulo;
        console.log(item_id);
        let items$ = this.http
            .get(URL_MENU + '/' + item_id,
            { headers: this.getHeadersMenu() })
            .map(this.mapBotonData)
            .catch(this.handleError);
        return items$;
    }

    private mapBotonData(res: Response): Boton[] {

        let obj_json = res.json();

        //let obj_json = JSON.parse('{    "statuscode": "0000",    "message": "Accion efectuada con exito",    "data": [        {			"idModulo": "00000000-0000-0000-0000-112301230023",			"moduloUri": "/ordencompra/comprador/buscar",			"moduloDesc": "Orden de Compra",			"mini":"O",			"default": 1,			"botones": [				{"idBoton": "00000000-0000-1234-0000-112301231234", "nombre": "buscar", "Desc": "Buscar", "habilitado": 1},				{"idBoton": "00000000-0000-5678-0000-112301235678", "nombre": "imprimir", "Desc": "Imprimir", "habilitado": 0},				{"idBoton": "00000000-0000-5678-0000-112301235678", "nombre": "detalle", "Desc": "Ver Detalle", "habilitado": 1}			]		}    ]}');

        console.log('obj_json', obj_json);

        let botones;

        let modulo = obj_json.data;
        if (modulo.botones && modulo.botones.length > 0) {
            botones = [];
            for (let boton of modulo.botones) {
                let obj = new Boton();
                obj.idBoton = boton.idBoton;
                obj.nombre = boton.nombre;
                obj.Desc = boton.Desc;
                obj.habilitado = ('habilitado' in boton) ? Boolean(boton.habilitado) : false;
                obj.visible = ('visible' in boton) ? Boolean(boton.visible) : true;
                obj.Titulo = boton.Titulo;
                botones.push(obj);

            }
        }
        console.log('botones', botones);
        return botones;
        //return body.data || {};
    }
    obtenerMenu(): Observable<RootMenu> {

        let items$ = this.http
            .get(URL_MENU, { headers: this.getHeadersMenu() })
            .map(this.mapMenuData)
            .catch(this.handleError);
        return items$;
    }

    private mapMenuData(res: Response): RootMenu {

        let root = new RootMenu();
        let obj_json = res.json();

        //let obj_json = JSON.parse('{    "statuscode": "0000",    "message": "Accion efectuada con exito",    "data":         {		"front": "PEB2M",		"logoFront": "http://azure.com/logob2m.jpg",		"icon": "assignment",		"title": "Comprador",		"modulos": [			{				"idModulo": "00000000-0000-0000-0000-112301230023",				"moduloUri": "/ordencompra/comprador/buscar",				"moduloDesc": "Orden de Compra",				"mini":"O",				"default":1		},			{				"idModulo": "00000000-0000-0000-0000-112301230024",				"moduloUri": "/factura/comprador/buscar",				"moduloDesc": "Guías",				"mini":"G"			},			{				"idModulo": "00000000-0000-0000-0000-112301230025",				"moduloUri": "/guia/comprador/buscar",				"moduloDesc": "Comprobante de Pago",				"mini":"CP"			}		]	}}');

        console.log('obj_json', obj_json);


        root.menus = [];

        let data = obj_json.data
        let menu = new Menu();

        menu.front = data.front;
        menu.logoFront = data.logoFront;
        menu.icon = data.icon;
        menu.title = data.title;
        menu.modulos = [
          {
            idModulo: '03797780-2568-4da6-92a1-0ef545bf8290',
            moduloUri: '//comprobantes/',
            moduloDesc: 'Comprobantes - Crear',
            mini: 'CC',
            default: false
          },
          {
            idModulo: '03797780-2568-4da6-92a1-0ef545bf8290',
            moduloUri: '//comprobantes/consultar',
            moduloDesc: 'Comprobantes - Consultar',
            mini: 'CC',
            default: false
          },
          {
            idModulo: '03797780-2568-4da6-92a1-0ef545bf8290',
            moduloUri: '//bienes-servicios/crear',
            moduloDesc: 'Bienes/Servicios - Crear',
            mini: 'BC',
            default: false
          },
          {
            idModulo: '03797780-2568-4da6-92a1-0ef545bf8290',
            moduloUri: '//bienes-servicios/consultar',
            moduloDesc: 'Bienes/Servicios - Consultar',
            mini: 'BC',
            default: false
          },
          {
            idModulo: '03797780-2568-4da6-92a1-0ef545bf8290',
            moduloUri: '//configuracion/empresa-emisora',
            moduloDesc: 'Conf. Empresa',
            mini: 'CE',
            default: true
          }
        ];
        if (data.modulos && data.modulos.length > 0) {
            for (let modulo of data.modulos) {
                let moduloUri = '/' + modulo.moduloUri;
                if (!root.moduloUriDefault || root.moduloUriDefault.trim() === '')
                    root.moduloUriDefault = moduloUri;
                let obj_modulo = new Modulo();
                obj_modulo.idModulo = modulo.idModulo;
                obj_modulo.moduloUri = moduloUri;
                obj_modulo.moduloDesc = modulo.moduloDesc;
                obj_modulo.mini = modulo.mini;
                obj_modulo.default = ('default' in modulo) ? Boolean(modulo.default) : false;

                if (obj_modulo.default)
                    root.moduloUriDefault = moduloUri;

                if (modulo.botones && modulo.botones.length > 0) {
                    obj_modulo.botones = [];
                    for (let boton of modulo.botones) {
                        let obj_boton = new Boton();
                        obj_boton.idBoton = boton.idBoton;
                        obj_boton.nombre = boton.nombre;
                        obj_boton.Desc = boton.Desc;
                        obj_boton.Titulo = boton.Titulo;
                        obj_boton.habilitado = ('habilitado' in boton) ? Boolean(boton.habilitado) : false;
                        obj_boton.visible = ('visible' in boton) ? Boolean(boton.visible) : true;

                        obj_modulo.botones.push(obj_boton);
                    }

                }
                menu.modulos.push(obj_modulo);
            }
        }

        root.menus.push(menu);



        localStorage.setItem("RootMenu", JSON.stringify(root));
        console.log('root', root);
        return root;
        //return body.data || {};
    }

    private mapUserData(res: Response): Usuario {
        let respuesta = {
            status: res ? res.status : -1,
            statusText: res ? res.statusText : "ERROR",
            data: res ? res.json() || {} : {},
        }

        let user_json = res.json();
        console.log('1', user_json);
        user_json = user_json.principal.user;

        console.log('2', user_json);
        let usuario = new Usuario();
        usuario.id = user_json.id;
        usuario.nombreusuario = user_json.usuario ? user_json.usuario : '';
        usuario.nombrecompleto = (user_json.nombre ? user_json.nombre : '') + ' ' + (user_json.apellidoPaterno ? user_json.apellidoPaterno : '');
        usuario.nombrecompleto = usuario.nombrecompleto.trim();
        usuario.url_image = user_json.avatar ? user_json.avatar : null;
        usuario.organizaciones = [];
        if (user_json.organizaciones.length > 0) {
            for (let org of user_json.organizaciones) {
                let item = {
                    id: org.id,
                    nombre: org.nombre ? org.nombre : '',
                    tipo_empresa: org.tipoEmpresa ? org.tipoEmpresa : '',
                    keySuscripcion: org.keySuscripcion ? org.keySuscripcion : '',
                    ruc: org.ruc ? org.ruc : '',
                    isoPais: org.isoPais ? org.isoPais : '',
                    url_image: org.logo ? org.logo : null
                }

                usuario.organizaciones.push(item);
                usuario.org_id = item.id;
                usuario.tipo_empresa = item.tipo_empresa.toUpperCase();

                if (item.tipo_empresa.toLowerCase() === 'c') {
                    usuario.token = 'comprador1';
                    usuario.perfil = 'comprador';

                }
                else {

                    usuario.token = 'proveedor1';
                    usuario.perfil = 'proveedor';
                }
            }

        }
        return usuario;

        //return body.data || {};
    }

    private getHeaders() {
        // I included these headers because otherwise FireFox
        // will request text/html
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('origen_datos', 'PEB2M');
        headers.append('tipo_empresa', localStorage.getItem('tipo_empresa'));
        headers.append("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        headers.append("Ocp-Apim-Subscription-Key", OCP_APIM_SUBSCRIPTION_KEY);
        // headers.append('Access-Control-Allow-Origin', '*');
        return headers;
    }
    private getHeadersMenu() {
        // I included these headers because otherwise FireFox
        // will request text/html
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('origen_datos', 'PEB2M');
        headers.append('tipo_empresa', localStorage.getItem('tipo_empresa').toUpperCase());
        headers.append("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        headers.append("Ocp-Apim-Subscription-Key", OCP_APIM_SUBSCRIPTION_KEY);
        headers.append("org_id", localStorage.getItem('org_id'));
        // headers.append('Access-Control-Allow-Origin', '*');
        return headers;
    }
    private handleData(res: Response) {
        let body = res.json();
        return body;
    }

    private handleErrorLogin(error: any) {

        let errMsg = error.statusText;

        if (error.status == "400") {
            errMsg = MENSAJE_ERROR_BAD_CREDENTIALS;
        }
        else {
            errMsg = MENSAJE_ERROR_GENERICO;
        }
        return Observable.throw(errMsg);
    }

    private handleError(error: Response | any) {
        // console.error('handleError',error);
        console.error('handleError', error.message || error);
        let data = error ? error.json() || {} : {};
        if (data && data.error && data.error === "invalid_token")
            DatatableFunctions.logout();
        return Observable.throw(error.message || error);
    }


    private handleErrorKillToken(error: Response | any) {
        // console.error('handleError',error);
        console.error('handleError', error.message || error);


        return Observable.throw(error.message || error);
    }


    public logout() {
        localStorage.clear();
        this.router.navigateByUrl('/login');
    }



    public KillToken(): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('origen_datos', 'PEB2M');
        headers.append("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        headers.append("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(URL_OAUTH_KILL, options)
            .catch(this.handleErrorKillToken);
    }

    //Sincronización
    public sincronizar(org_id):  Observable<Object>{
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('origen_datos', 'PEB2M');
        headers.append("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        headers.append("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
        let url = this._servidores.HOSTLOCAL + '/idiomas';
        const parametros = new HttpParams();
        const salida = new BehaviorSubject<any>(null);
        return  this.httpClient.get(url, { params: parametros, headers: headers });
        
    }
    public guardarIdioma():  Observable<any>{
        let url = this._servidores.HOSTLOCAL + '/sincronizacion/idioma';
        this.idiomaDTO = [{id:'1', descripcion:'ES', descripcionCorta: 'Español'},
                            {id:'2', descripcion:'EN', descripcionCorta: 'Ingles'}];
        const salida = new BehaviorSubject<any>(null);    
        return this.httpClient.post<DtoIdioma[]>(url, this.idiomaDTO);    
    }

    public guardarEmpresaLocal(data): Observable<any>{
        let url = this._servidores.HOSTLOCAL +  '/sincronizacion/EmpresaLocal';
        console.log(data);
        return this.httpClient.post<DtoEmpresaLocal[]>(url, {ruc: data});
    }
    
    public guardarIdiomaQuery() :  Observable<any>{
        let url = this._servidores.HOSTLOCAL +  '/sincronizacion/queryIdioma';
        this.idiomaDTO = [{id:'1', descripcion:'ES', descripcionCorta: 'Español'},
                        {id:'2', descripcion:'EN', descripcionCorta: 'Ingles'}];
        return this.httpClient.post<DtoIdioma[]>(url, this.idiomaDTO);
    }
    public guardarEvento(): Observable<any>{
        let url = this._servidores.HOSTLOCAL + '/sincronizacion/evento';
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
    public obtenerMaestra(): Observable<any>{
        let url = this._servidores.PARMQRY + '/maestra';
        // let url = 'https://dev.ebizlatindata.com/fe/ms-parametro-query/v1/maestra/search/filtros?tabla=10007';
        const parametros = new HttpParams();
        
        return this.httpClient.get(url, { params: parametros , headers: this.getCabezera()});
    }
    public guardarMaestra(data): Observable<any>{
        let listaMaestra: DtoMaestra[] = [];
        let url = this._servidores.HOSTLOCAL + '/sincronizacion/maestra';
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
        let url = this._servidores.HOSTLOCAL + '/sincronizacion/parametroEntidad'
        return this.httpClient.post<DtoParametroEntidad[]>(url, this.paremetroEntidadDTO);
    }
    public guardarTipoEntidad(): Observable<any>{
        let fecha = new Date();
        let url = this._servidores.HOSTLOCAL + '/sincronizacion/tipoEntidad';
        this.tipoEntidadDTO = [{id:'1', descripcion:'Emisor', usuarioCreacion: 'Offline', usuarioModificacion: 'Offline', fechaCreacion: fecha.toString() , fechaModificacion: fecha.toString(), estado: ''},
                               {id:'2', descripcion:'Receptor', usuarioCreacion: 'Offline', usuarioModificacion: 'Offline', fechaCreacion: fecha.toString() , fechaModificacion: fecha.toString(), estado: ''}];
        return this.httpClient.post<DtoTipoEntidad[]>(url, this.tipoEntidadDTO);
    }
    public obtenerSerie(): Observable<any>{
        let url = this._servidores.PARMQRY + '/seriess';
        const parametros = new HttpParams();
        return this.httpClient.get(url, { params: parametros , headers: this.getCabezera()  });
    }
    public guardarSerie(data): Observable<any>{
        this.serieDTO = [];
        let url = this._servidores.HOSTLOCAL + '/sincronizacion/querySerie';
        data._embedded.serieCommands.forEach(element => {
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

    public guardarQueryEstado(): Observable<any>{
        let fecha = new Date();
        let url = this._servidores.HOSTLOCAL + '/sincronizacion/queryEstado';
        this.queryEstadoDTO = [{id:'1', idioma:'1', descripcion: 'Pendiente de Envio',abreviatura: 'Pendiente' },
                               {id:'2', idioma:'1', descripcion: 'Bloqueado',abreviatura: 'Bloqueado'},
                               {id:'3', idioma:'1', descripcion: 'Autorizado',abreviatura: 'Autorizado'},
                               {id:'4', idioma:'1', descripcion: 'Autorizado con Observaciones',abreviatura: 'Autorizado con Obs.'},
                               {id:'5', idioma:'1', descripcion: 'Rechazado',abreviatura: 'Rechazado'},
                               {id:'6', idioma:'1', descripcion: 'Dado de Baja',abreviatura: 'Baja'},
                               {id:'99', idioma:'1', descripcion: 'Error',abreviatura: 'Error'}];
        return this.httpClient.post<DtoQueryEstado[]>(url, this.queryEstadoDTO);
    }

    public obtenerParametros(): Observable<any>{
        let url = this._servidores.PARMQRY + '/parametros';
        const parametros = new HttpParams();
        return this.httpClient.get(url, { params: parametros  , headers: this.getCabezera() });
    }

    public guardarParametro(data): Observable<any>{
        this.queryParametrosDto = []
        let url = this._servidores.HOSTLOCAL + '/sincronizacion/parametros';
        data._embedded.parametroRedises.forEach(element => {
            let parameto = new DtoQueryParametro();
            parameto = element;
            this.queryParametrosDto.push(parameto);
        });
        return this.httpClient.post<DtoQueryParametro[]>(url, this.queryParametrosDto);
    }

    

    public obtenerTipoPrecioVenta(): Observable<any>{
        let url = this._servidores.PARMQRY + '/tipoprecioventa';
        const parametros = new HttpParams();
        return this.httpClient.get(url, {params: parametros  , headers: this.getCabezera()});
    }

    public guardarTipoPrecioVenta(data): Observable<any>{
        this.queryTipoPrecioVentaDto = []
        let url = this._servidores.HOSTLOCAL + '/sincronizacion/tipoprecioventa';
        data._embedded.tipoPrecioVentaRedises.forEach(element => {
            let tipoPrecioVenta = new DtoQueryTipoPrecioVenta();
            tipoPrecioVenta = element;
            this.queryTipoPrecioVentaDto.push(tipoPrecioVenta);
        });
        return this.httpClient.post<DtoQueryTipoPrecioVenta[]>(url, this.queryTipoPrecioVentaDto);
    }

    public obtenerTipoAfectacionIgv(): Observable<any>{
        let url = this._servidores.PARMQRY + '/tipoafectacionigv';
        const parametros = new HttpParams();
        return this.httpClient.get(url, {params: parametros, headers: this.getCabezera()})
    }

    public guardarTipoAfectacionIgv(data): Observable<any>{
        let url = this._servidores.HOSTLOCAL + '/sincronizacion/queryTipoAfecacionIgv'
        this.queryTipoAfectacionIgv = [];
        data._embedded.tipoAfectacionIgvRedises.forEach(element => {
            let tipoAfecacionIgv = new DtoQueryTipoAfectacionIgv();
            tipoAfecacionIgv = element;
            this.queryTipoAfectacionIgv.push(tipoAfecacionIgv);
        });
        return this.httpClient.post<DtoQueryTipoAfectacionIgv[]>(url, this.queryTipoAfectacionIgv);
    }

    public obtenerTipoCalculoIsc(): Observable<any>{
        let url = this._servidores.PARMQRY + '/tipocalculoisc';
        const parametros = new HttpParams();
        return this.httpClient.get(url, {params: parametros, headers: this.getCabezera()});
    }

    public guardarTipoCalculoIsc(data): Observable<any>{
        let url = this._servidores.HOSTLOCAL + '/sincronizacion/queryTipoCalcIsc';
        this.queryTipoCalculoIsc = [];
        data._embedded.tipoCalculoIscRedises.forEach(element => {
            let tipoCalculoIsc = new DtoQueryTipoCalcIsc();
            tipoCalculoIsc = element;
            this.queryTipoCalculoIsc.push(tipoCalculoIsc);
        });
        return this.httpClient.post<DtoQueryTipoCalcIsc[]>(url, this.queryTipoCalculoIsc);
    }

    public obtenerConceptos(): Observable<any>{
        let url = this._servidores.PARMQRY + '/concepto';
        const parametros = new HttpParams();
        return this.httpClient.get(url, {params: parametros, headers: this.getCabezera()});
    }

    public guardarConcepto(data): Observable<any>{
        let url = this._servidores.HOSTLOCAL + '/sincronizacion/concepto';
        this.conceptos = [];
        data._embedded.conceptoRedises.forEach(element => {
            let concepto = new DtoConcepto();
            concepto = element;
            this.conceptos.push(concepto);
        });
        return this.httpClient.post<DtoConcepto[]>(url, this.conceptos);
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
        let url = this._servidores.ORGAQRY + '/organizaciones/' + org_id ;
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
        let url = this._servidores.HOSTLOCAL +  '/sincronizacion/entidad';
        return this.httpClient.post<DtoEntidad>(url, this.entidadDTO);
    }

    /* empieza login offline*/
    public loginOffline(username, password): BehaviorSubject<any> {
        let url = this._servidores.HOSTLOCAL + '/usuarios/search/buscar';
        const parametros = new HttpParams()
            .set('nombreusuario', username)
            .set('password', password);
        const salida = new BehaviorSubject<any>(null);
        //this.httpClient.get(url)
        this.httpClient.get(url, { params: parametros })
            .subscribe(
            data => {
                console.log(data);
                let listaUser = data;
                salida.next(listaUser);
            },
            error => {
                salida.next(error);
            });
        return salida;
    }
    public obtenerAzure(nombre): Observable<any>{
        let url = this._servidores.FILEQRY + "/archivos/search?nombre_archivo="+nombre;
        const parametros = new HttpParams();
        let salida = new Observable<any>();
        return this.httpClient.get(url, { params: parametros, responseType: "text/plain" , headers: this.getCabezera()});
    }
      
    public guardarDocumentoAzure(id, idEntidad, tipoComprobante ,logoEbiz, logoEmpresa, plantilla): Observable<any>{
        let url = this._servidores.HOSTLOCAL + '/sincronizacion/documentoAzure';
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
    public obtenerEmpresaOffline():Observable<any>{
        let url = this._servidores.HOSTLOCAL + '/obtenerEmpresaOffline';
        const parametros = new HttpParams();
        return this.httpClient.get(url, { params: parametros });
    }
    public obtenerIdEntidadOFE(ruc: string) {
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
            .set('Ocp-Apim-Subscription-Key', ocp_apim_subscription_key)
            .set('origen_datos', origen_datos)
            .set('tipo_empresa', tipo_empresa)
            .set('org_id', org_id);

        const parametros = new HttpParams()
            .set('ruc', ruc);
        const Organizacion = '';
        //TODO HARDCODE
        localStorage.setItem('id_entidad', '1');
        localStorage.setItem('org_direccion', 'AV. NICOLAS AYLLON NRO. 3820 URB. SANTA RAQUEL - LIMA LIMA ATE');
        localStorage.setItem('org_email', 'lizbethlima@ulasalle.edu.pe');
    }
    public obtenerUsuariosOffline(ruc):Observable<any>{
        let url = this._servidores.ebiz + '/offorg/';
        const parametros = new HttpParams().set('ruc_emisor', ruc);  
        let headers = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem('access_token'))
                                        .set("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'))
                                        .set("origen_datos", 'OFFLINE');
        return this.httpClient.get(url, { params: parametros, headers: headers} );
    }

    public guardarUsuariosOffline(data):Observable<any>{
        let url = this._servidores.HOSTLOCAL + '/sincronizacion/guardarUsuarios';
        return this.httpClient.post<DtoUsuarioEbiz>(url, data);
    }
    public obtenerMenuOffline(){
        let url = this._servidores.HOSTLOCAL + '/sincronizacion/mostrarMenu';
        const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
        const parametros = new HttpParams().set('idUsuario', usuario.id);
        return this.httpClient.get(url, { params: parametros  });
    }
    public ObtenerMenuOfe() {
        localStorage.setItem('RootMenu', JSON.stringify(
            {
                "menus": [
                    {
                        "front": "PEB2M",
                        "logoFront": "https://sab2md.blob.core.windows.net/public-dev/org/logos/b2mining-ico.png",
                        "icon": "",
                        "title": "Comprobante",
                        "modulos": [
                            {
                                "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
                                "moduloUri": "//comprobantes/factura/crear",
                                "moduloDesc": "Crear",
                                "mini": "CC",
                                "default": true,
                            },
                            {
                                "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
                                "moduloUri": "//comprobantes/consultar",
                                "moduloDesc": "Consultar",
                                "mini": "CS",
                                "default": false
                            },
                            // {
                            //     "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
                            //     "moduloUri": "/resumen-boletas/consultar",
                            //     "moduloDesc": "Resumen Boletas - Consultar",
                            //     "mini": "RB",
                            //     "default": false
                            // },
                            // {
                            //     "idModulo": "03797780-2568-4da6-92a1-0ef545bf8290",
                            //     "moduloUri": "//percepcion-retencion/retencion/crear/masiva",
                            //     "moduloDesc": "Percepción/Ret. - Crear",
                            //     "mini": "RE",
                            //     "default": false
                            // },
                            // {
                            //     "idModulo": "03797780-2568-4da7-92a1-0ef545bf8290",
                            //     "moduloUri": "//percepcion-retencion/consultar",
                            //     "moduloDesc": "Percepción/Ret. - Consult",
                            //     "mini": "RL",
                            //     "default": true,
                            //     "botones": [
                            //         {
                            //             "habilitado": true,
                            //             "visible": true,
                            //             "idBoton": "5a5e3e43-73db-457e-aaaa-9cb1989c7654",
                            //             "nombre": "buscar",
                            //             "Desc": "Botón de búsqueda",
                            //             "Titulo": "BUSCAR"
                            //         }
                            //     ]
                            // },
                            // {
                            //     "idModulo": "03797780-2568-4da8-92a1-0ef545bf8290",
                            //     "moduloUri": "//resumen-bajas/crear",
                            //     "moduloDesc": "Resumen Bajas - Crear",
                            //     "mini": "BE",
                            //     "default": false
                            // },
                            // {
                            //     "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
                            //     "moduloUri": "//resumen-bajas/consultar",
                            //     "moduloDesc": "Resumen Bajas - Consult",
                            //     "mini": "BL",
                            //     "default": false
                            // },                            
                            // {
                            //     "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
                            //     "moduloUri": "//reportes",
                            //     "moduloDesc": "Ver",
                            //     "mini": "RS",
                            //     "default": false
                            // }
                        ]
                    },
                    {
                        "front": "PEB2M",
                        "logoFront": "https://sab2md.blob.core.windows.net/public-dev/org/logos/b2mining-ico.png",
                        "icon": "",
                        "title": "Percepcion/Retencion",
                        "modulos": [
                            {
                                "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
                                "moduloUri": "//comprobantes/factura/crear",
                                "moduloDesc": "Crear",
                                "mini": "CC",
                                "default": false,
                            },
                            {
                                "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
                                "moduloUri": "//comprobantes/consultar",
                                "moduloDesc": "Consultar",
                                "mini": "CS",
                                "default": false
                            },
                            // {
                            //     "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
                            //     "moduloUri": "/resumen-boletas/consultar",
                            //     "moduloDesc": "Resumen Boletas - Consultar",
                            //     "mini": "RB",
                            //     "default": false
                            // },
                            // {
                            //     "idModulo": "03797780-2568-4da6-92a1-0ef545bf8290",
                            //     "moduloUri": "//percepcion-retencion/retencion/crear/masiva",
                            //     "moduloDesc": "Percepción/Ret. - Crear",
                            //     "mini": "RE",
                            //     "default": false
                            // },
                            // {
                            //     "idModulo": "03797780-2568-4da7-92a1-0ef545bf8290",
                            //     "moduloUri": "//percepcion-retencion/consultar",
                            //     "moduloDesc": "Percepción/Ret. - Consult",
                            //     "mini": "RL",
                            //     "default": true,
                            //     "botones": [
                            //         {
                            //             "habilitado": true,
                            //             "visible": true,
                            //             "idBoton": "5a5e3e43-73db-457e-aaaa-9cb1989c7654",
                            //             "nombre": "buscar",
                            //             "Desc": "Botón de búsqueda",
                            //             "Titulo": "BUSCAR"
                            //         }
                            //     ]
                            // },
                            // {
                            //     "idModulo": "03797780-2568-4da8-92a1-0ef545bf8290",
                            //     "moduloUri": "//resumen-bajas/crear",
                            //     "moduloDesc": "Resumen Bajas - Crear",
                            //     "mini": "BE",
                            //     "default": false
                            // },
                            // {
                            //     "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
                            //     "moduloUri": "//resumen-bajas/consultar",
                            //     "moduloDesc": "Resumen Bajas - Consult",
                            //     "mini": "BL",
                            //     "default": false
                            // },                            
                            // {
                            //     "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
                            //     "moduloUri": "//reportes",
                            //     "moduloDesc": "Ver",
                            //     "mini": "RS",
                            //     "default": false
                            // }
                        ]
                    }
                ],
                "moduloUriDefault": "//percepcion-retencion/consultar"
            }
        ));
    }
    /* termina login offline*/
}
