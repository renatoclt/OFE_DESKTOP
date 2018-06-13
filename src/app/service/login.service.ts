import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { URL_OAUTH_KILL, URL_OAUTH_REFRESH, URL_OAUTH, URL_OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET,
         OAUTH_GRANT_TYPE, OAUTH_GRANT_TYPE_REFRESH_TOKEN, URL_GET_USER, OCP_APIM_SUBSCRIPTION_KEY } from 'app/utils/app.constants'
import { MENSAJE_ERROR_BAD_CREDENTIALS, MENSAJE_ERROR_GENERICO } from 'app/utils/messages.constants';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Organizacion, Usuario } from 'app/model/usuario';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Entidad } from 'app/facturacion-electronica/general/models/organizacion/entidad';
import { BASE_URL, URL_MENU } from 'app/utils/app.constants';
import { Servidores } from 'app/facturacion-electronica/general/services/servidores';
import { Menu, Modulo, Boton, RootMenu } from 'app/model/menu';

declare var DatatableFunctions;
declare var swal: any;

@Injectable()
export class LoginService {

    private urlGetUser: string;

    constructor(public http: Http, public router: Router, public httpClient: HttpClient,
                private _servidores: Servidores) { 

        this.urlGetUser = URL_GET_USER;
    }

///////////  NO UTILIZADO  ////////////////
    /*
    public isAuthenticated(): boolean {
        var expires = new Date(Number(localStorage.getItem('expires')));
        var currentDate = new Date();
        return (currentDate <= expires);
    }
    */
///////////////////////////////////////////

    public ObtenerBotonesCache(url): Boton[] {
        let root = JSON.parse(localStorage.getItem('RootMenu')) as RootMenu;
        let modulo = this.ObtenerModulo(url);
        if (modulo && modulo.botones) {
            return modulo.botones;
        } else { return null; }
    }

    private ObtenerModulo(url): Modulo {
        let root = JSON.parse(localStorage.getItem('RootMenu')) as RootMenu;
        let modulo;
        for (let menu of root.menus) {
            modulo = menu.modulos.find(a => a.moduloUri === url);
            if (modulo) {
                break;
            }
        }
        return modulo;
    }

    public login(username, password): Observable<any> {
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(URL_OAUTH_CLIENT_ID + ':' + OAUTH_CLIENT_SECRET));
        headers.set('Ocp-Apim-Subscription-Key', OCP_APIM_SUBSCRIPTION_KEY);

        let params = new URLSearchParams();
        params.append('grant_type', OAUTH_GRANT_TYPE);
        params.append('username', username.trim().toUpperCase());
        params.append('password', password);

        let options = new RequestOptions({ headers: headers });
        return this.http.post(`${URL_OAUTH}/token`, params, options).map(this.handleData)
            .catch(this.handleError);
    };

    public logout() {
        localStorage.clear();
        this.KillToken();
        this.router.navigateByUrl('/login');
    };

    public RefreshToken(): Observable<any> {
        // console.log('token eliminado');
      //  alert('iniciando');
        const headers = new Headers();

        headers.set('Authorization', 'Basic ' + btoa(URL_OAUTH_CLIENT_ID + ':' + OAUTH_CLIENT_SECRET));
        headers.set('Ocp-Apim-Subscription-Key', OCP_APIM_SUBSCRIPTION_KEY);

        const params = new URLSearchParams();
        params.append('grant_type', OAUTH_GRANT_TYPE_REFRESH_TOKEN);
        params.append('refresh_token', localStorage.getItem('refresh_token'));

        /*
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('origen_datos', 'PEB2M');
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        headers.append('Ocp-Apim-Subscription-Key', localStorage.getItem('Ocp_Apim_Subscription_Key'));
*/
        const options = new RequestOptions({ headers: headers });
        return this.http.post(URL_OAUTH_REFRESH, params, options)
            .catch(this.handleErrorKillToken);

    };

    public KillToken(): Observable<any> {
        // console.log('token eliminado');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('origen_datos', 'PEB2M');
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        headers.append('Ocp-Apim-Subscription-Key', localStorage.getItem('Ocp_Apim_Subscription_Key'));

        const options = new RequestOptions({ headers: headers });
        return this.http.delete(URL_OAUTH_KILL, options)
            .catch(this.handleErrorKillToken);

    };


    public obtenerIdEntidad(ruc: string) {
        const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
        const access_token = localStorage.getItem('access_token');
        const token_type = 'Bearer';
        const ocp_apim_subscription_key = localStorage.getItem('Ocp_Apim_Subscription_Key');
        const origen_datos = 'PEB2M';
        const tipo_empresa = usuario.tipo_empresa;
        const org_id = usuario.org_id;

        const headers = new HttpHeaders()
            .set('Authorization', token_type + ' ' + access_token)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Ocp-Apim-Subscription-Key', ocp_apim_subscription_key)
            .set('origen_datos', origen_datos)
            .set('tipo_empresa', tipo_empresa)
            .set('org_id', org_id);

        if ( ruc !== '77777777777' && ruc !== '30-70971175-6' ) {
            const parametros = new HttpParams()
                .set('ruc', ruc);
            const urlOrganizacion = this._servidores.ORGAQRY + '/organizaciones/' + ruc;
            const respuesta = new BehaviorSubject(null);

            this.httpClient.get( urlOrganizacion, {
                headers: headers
            }).subscribe(
                data => {
                    if ( data ) {
                        localStorage.setItem('id_entidad', data['id'] );
                        localStorage.setItem('org_direccion', data['direccionFiscal']);
                        localStorage.setItem('org_email', data['correoElectronico']);
                        respuesta.next(data);
                    } else {
                        respuesta.next(null);
                    }
                },
                error => {
                    swal({
                        text: 'Ha ocurrido algún problema. Inténtelo de nuevo.',
                        type: 'warning',
                        buttonsStyling: false,
                        confirmButtonClass: 'btn btn-warning'
                    });
                    respuesta.error(error);
                    this.router.navigate(['./login']);
                }
            );
            return respuesta;
        }//// if(ruc!='77777777777')
      // return respuesta;
      return null;
    };

    obtenerUser(): Observable<Usuario> {
        let items$ = this.http
            .get(this.urlGetUser, { headers: this.getHeaders() })
            .map(this.mapUserData)
            .catch(this.handleError);
        return items$;
    };

    guardarBotonesLocalStore(url: string, botones: Boton[]) {
        let root = JSON.parse(localStorage.getItem('RootMenu')) as RootMenu;
        let modulo;
        for (let menu of root.menus) {
            modulo = menu.modulos.find(a => a.moduloUri === url);
            if (modulo) {
                break;
            }
        }
        modulo.botones = botones;
        localStorage.setItem('RootMenu', JSON.stringify(root));
    };

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
    };

    private mapBotonData(res: Response): Boton[] {
        let obj_json = res.json();
        // let obj_json = JSON.parse('{    "statuscode": "0000",    "message": "Accion efectuada con exito",    "data": [        {			"idModulo": "00000000-0000-0000-0000-112301230023",			"moduloUri": "/ordencompra/comprador/buscar",			"moduloDesc": "Orden de Compra",			"mini":"O",			"default": 1,			"botones": [				{"idBoton": "00000000-0000-1234-0000-112301231234", "nombre": "buscar", "Desc": "Buscar", "habilitado": 1},				{"idBoton": "00000000-0000-5678-0000-112301235678", "nombre": "imprimir", "Desc": "Imprimir", "habilitado": 0},				{"idBoton": "00000000-0000-5678-0000-112301235678", "nombre": "detalle", "Desc": "Ver Detalle", "habilitado": 1}			]		}    ]}');
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
        // return body.data || {};
    };

    obtenerMenu(): Observable<RootMenu> {

        let items$ = this.http
            .get(URL_MENU, { headers: this.getHeadersMenu() })
            .map(this.mapMenuData)
            .catch(this.handleError);
        return items$;
    };

    private mapMenuData(res: Response): RootMenu {
        let root = new RootMenu();
        let obj_json = res.json();

        // let obj_json = JSON.parse('{    "statuscode": "0000",    "message": "Accion efectuada con exito",    "data":         {		"front": "PEB2M",		"logoFront": "http://azure.com/logob2m.jpg",		"icon": "assignment",		"title": "Comprador",		"modulos": [			{				"idModulo": "00000000-0000-0000-0000-112301230023",				"moduloUri": "/ordencompra/comprador/buscar",				"moduloDesc": "Orden de Compra",				"mini":"O",				"default":1		},			{				"idModulo": "00000000-0000-0000-0000-112301230024",				"moduloUri": "/factura/comprador/buscar",				"moduloDesc": "Guías",				"mini":"G"			},			{				"idModulo": "00000000-0000-0000-0000-112301230025",				"moduloUri": "/guia/comprador/buscar",				"moduloDesc": "Comprobante de Pago",				"mini":"CP"			}		]	}}');
        console.log('obj_json', obj_json);
        root.menus = [];
        let data = obj_json.data
        let menu = new Menu();
        menu.front = data.front;
        menu.logoFront = data.logoFront;
        menu.icon = data.icon;
        menu.title = data.title;
        menu.modulos = [];

        if (data.modulos && data.modulos.length > 0) {
            for (let modulo of data.modulos) {
                let moduloUri = '/' + modulo.moduloUri;
                if (!root.moduloUriDefault || root.moduloUriDefault.trim() === '') {
                    root.moduloUriDefault = moduloUri;
                }
                let obj_modulo = new Modulo();
                obj_modulo.idModulo = modulo.idModulo;
                obj_modulo.moduloUri = moduloUri;
                obj_modulo.moduloDesc = modulo.moduloDesc;
                obj_modulo.mini = modulo.mini;
                obj_modulo.default = ('default' in modulo) ? Boolean(modulo.default) : false;

                if (obj_modulo.default) {
                    root.moduloUriDefault = moduloUri;
                }

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
        localStorage.setItem('RootMenu', JSON.stringify(root));
        console.log('root', root);
        return root;
        // return body.data || {};
    };

    private mapUserData(res: Response): Usuario {
        let respuesta = {
            status: res ? res.status : -1,
            statusText: res ? res.statusText : 'ERROR',
            data: res ? res.json() || {} : {},
        }

        let user_json = res.json();
        console.log('1', user_json);
        user_json = user_json.principal.user;

        console.log('2', user_json);
        let usuario = new Usuario();
        usuario.id = user_json.id;
        usuario.nombreusuario = user_json.usuario ? user_json.usuario : '';
        usuario.nombrecompleto = (user_json.nombre ? user_json.nombre : '') + ' ' +
                                 (user_json.apellidoPaterno ? user_json.apellidoPaterno : '') + ' ' +
                                 (user_json.apellidoMaterno ? user_json.apellidoMaterno : '');
        usuario.nombrecompleto = usuario.nombrecompleto.trim();
        usuario.url_image = user_json.avatar ? user_json.avatar : null;

        usuario.organizaciones = [];
        if (user_json.organizaciones.length > 0) {
            for (const org of user_json.organizaciones) {

                /*
                let item = {
                    id: org.id,
                    nombre: org.nombre ? org.nombre : '',
                    tipo_empresa: org.tipoEmpresa ? org.tipoEmpresa : '',
                    keySuscripcion: org.keySuscripcion ? org.keySuscripcion : '',
                    ruc: org.ruc ? org.ruc : '',
                    isoPais: org.isoPais ? org.isoPais : '',
                    url_image:org.logo?org.logo:null
                }
                */

                let item = new Organizacion(org.id,
                                            org.nombre ? org.nombre : '',
                                            org.tipoEmpresa ? org.tipoEmpresa : '',
                                            org.keySuscripcion ? org.keySuscripcion : '',
                                            org.ruc ? org.ruc : '',
                                            org.isoPais ? org.isoPais : '',
                                            org.logo?org.logo:null
                                           );
                usuario.organizaciones.push(item);
           /*     usuario.org_id = item.id;
                usuario.tipo_empresa = item.tipo_empresa.toUpperCase();

                if (item.tipo_empresa.toLowerCase() === 'c') {
                    usuario.token = 'comprador1';
                    usuario.perfil = 'comprador';

                }
                else {

                    usuario.token = 'proveedor1';
                    usuario.perfil = 'proveedor';
                }
            */
            }
        }
        return usuario;

        // return body.data || {};
    };

    private getHeaders() {
        // I included these headers because otherwise FireFox
        // will request text/html
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('origen_datos', 'PEB2M');
        headers.append('tipo_empresa', localStorage.getItem('tipo_empresa'));
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        headers.append('Ocp-Apim-Subscription-Key', OCP_APIM_SUBSCRIPTION_KEY);
        // headers.append('Access-Control-Allow-Origin', '*');
        return headers;
    };

    private getHeadersMenu() {
        // I included these headers because otherwise FireFox
        // will request text/html
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('origen_datos', 'PEB2M');
        headers.append('tipo_empresa', localStorage.getItem('tipo_empresa').toUpperCase());
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        headers.append('Ocp-Apim-Subscription-Key', OCP_APIM_SUBSCRIPTION_KEY);
        headers.append('org_id', localStorage.getItem('org_id'));
        // headers.append('Access-Control-Allow-Origin', '*');
        return headers;
    }

    private handleData(res: Response) {
        const body = res.json();
        return body;
    }

    private handleErrorLogin(error: any) {

        let errMsg = error.statusText;

        if (error.status === '400') {
            errMsg = MENSAJE_ERROR_BAD_CREDENTIALS;
        } else {
            errMsg = MENSAJE_ERROR_GENERICO;
        }
        return Observable.throw(errMsg);
    }

    private handleError(error: Response | any) {
        // console.error('handleError',error);
        console.error('handleError', error.message || error);
        let data = error ? error.json() || {} : {};
        if (data && data.error && data.error === 'invalid_token') {
            DatatableFunctions.logout();
        }

        return Observable.throw(error.message || error);
    }

    private handleErrorKillToken(error: Response | any) {
        // console.error('handleError',error);
        console.error('handleError', error.message || error);
        return Observable.throw(error.message || error);
    }


}