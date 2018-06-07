import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { BASE_URL } from 'app/utils/app.constants';
import { ActivatedRoute, Router } from "@angular/router";
import { Organizacion, Usuario } from 'app/model/usuario';
import { Archivo } from 'app/model/archivo';

import { BaseComponent } from '../base/base.component';
import { LoginService } from 'app/service/login.service';
import { AdjuntoService } from 'app/service/adjuntoservice';

import { Login } from 'app/model/login';
import { ConstantesService } from '../facturacion-electronica/general/utils/constantes.service';
import { TiposService } from '../facturacion-electronica/general/utils/tipos.service';
import { ConstantesLoginService } from '../service/loginConstantes';
import { SincronizacionService } from '../facturacion-electronica/general/services/sincronizacion/sincronizacion.service';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

declare var $, DatatableFunctions: any;
declare var swal: any;
var oLoginComponent: LoginComponent;

@Component({
    moduleId: module.id,
    selector: 'login-cmp',
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [LoginService, AdjuntoService, ConstantesLoginService, SincronizacionService, HttpClient]
})

export class LoginComponent extends BaseComponent implements OnInit {
    test: Date = new Date();
    public base_url: string;
    public usuarios: Usuario[];
    public organizaciones: Organizacion[];
    public usuario: Usuario;
    public myVar:false;
    
    loading: boolean = false;
    loginModel: Login = new Login();
    
    constructor(injector: Injector, private router: Router, private route: ActivatedRoute, private loginService: LoginService, private adjuntoService: AdjuntoService,
                private constantesLoginService : ConstantesLoginService, private sincronizacionService: SincronizacionService,
                private httpClient: HttpClient) {
        super(injector);
        this.organizaciones = [];
        this.usuario = new Usuario();
        loginService.logout();
        this.base_url = BASE_URL;
        oLoginComponent = this;
    }

    AceptarOrganizacion(event) {
        if (event)
            event.preventDefault();

        //this.GuardarSession();
        $('#mdlOrganizacion').modal('toggle');

        let org = this.usuario.organizaciones.find(a => a.id == this.usuario.org_id) as Organizacion;

        if (org.nombre.toLowerCase().indexOf("wong") > -1) {
            org.url_image = "wong.png";
        } else if (org.nombre.toLowerCase().indexOf("centenario") > -1) {
            org.url_image = "centenario.png";
        } else if (org.nombre.toLowerCase().indexOf("abinbev") > -1) {
            org.url_image = "abinbev.png";
        }

        this.usuario.org_url_image = org.url_image;
        this.usuario.tipo_empresa = org.tipo_empresa;
        this.usuario.ruc_org = org.ruc;
        this.usuario.isopais_org = org.isoPais;
        setTimeout(function () { oLoginComponent.GuardarSession(); }, 100);

    }

    checkFullPageBackgroundImage() {
        var $page = $('.full-page');
        var image_src = $page.data('image');

        if (image_src !== undefined) {
            var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    }

    async GuardarSession() {
        localStorage.setItem('org_id', this.usuario.org_id);
        localStorage.setItem("username", this.usuario.nombreusuario);
        localStorage.setItem('tipo_empresa', this.usuario.tipo_empresa);
        let org = this.usuario.organizaciones.find(a => a.id == this.usuario.org_id);
        localStorage.setItem('Ocp_Apim_Subscription_Key', org.keySuscripcion);
        localStorage.setItem('org_nombre', org.nombre);
        localStorage.setItem('org_ruc', org.ruc);
        localStorage.setItem('usuarioActual', JSON.stringify(this.usuario));
        localStorage.setItem('passwordActual', this.loginModel.password);
        console.log('--------consume------');
        console.log(this.loginModel.inicio );
        if(this.loginModel.inicio == 'false'){
            await this.loginService.guardarUsuariosOffline(await this.loginService.obtenerUsuariosOffline(this.loginModel.ruc).toPromise()).toPromise();
            // console.log(await this.loginService.obtenerUsuariosOffline(this.loginModel.ruc).toPromise());
            await this.loginService.guardarIdioma().toPromise();
            await this.loginService.guardarIdiomaQuery().toPromise();
            await this.loginService.guardarEvento().toPromise();
            let dataMaestra = await this.loginService.obtenerMaestra().toPromise()
            await this.loginService.guardarMaestra(dataMaestra).toPromise() ;
            await this.loginService.guardarParemetroEntidad().toPromise();
            await this.loginService.guardarTipoEntidad().toPromise();
            await this.loginService.guardarQueryEstado().toPromise();
            try{
                let dataEntidad = await this.loginService.obtenerEntidad().toPromise();
                await this.loginService.guardarEntidad(dataEntidad).toPromise();
                let imagenEbiz = await this.loginService.obtenerAzure('logo_ebiz.png').toPromise();
                let imagenEmpresa = await this.loginService.obtenerAzure(dataEntidad.logoCloud).toPromise();
                let plantillaRetenciones = await this.loginService.obtenerAzure('retenciones-final.xml').toPromise();
                await this.loginService.guardarDocumentoAzure('1',dataEntidad.id, '20' , imagenEbiz, imagenEmpresa, plantillaRetenciones);
                let plantillaBoletas = await this.loginService.obtenerAzure('facturas.xml').toPromise();
                await this.loginService.guardarDocumentoAzure('2',dataEntidad.id, '01' , imagenEbiz, imagenEmpresa, plantillaBoletas);
                let plantillaPercepcion = await this.loginService.obtenerAzure('percepcion.xml').toPromise();
                await this.loginService.guardarDocumentoAzure('3',dataEntidad.id, '40' , imagenEbiz, imagenEmpresa, plantillaPercepcion);
                let plantillaFacturas = await this.loginService.obtenerAzure('facturas.xml').toPromise();
                await this.loginService.guardarDocumentoAzure('4',dataEntidad.id, '03' , imagenEbiz, imagenEmpresa, plantillaFacturas);
                await this.loginService.guardarSerie(await this.loginService.obtenerSerie().toPromise()).toPromise();
            }
            catch(e){
                swal({
                    text: "Error al intentar sincronizar.",
                    type: 'error',
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-error",
                    confirmButtonText: 'CONTINUAR',
                });
                
            }
            try{
                await this.loginService.guardarParametro(await this.loginService.obtenerParametros().toPromise()).toPromise();
                await this.loginService.guardarTipoPrecioVenta(await this.loginService.obtenerTipoPrecioVenta().toPromise()).toPromise();
                await this.loginService.guardarTipoAfectacionIgv(await this.loginService.obtenerTipoAfectacionIgv().toPromise()).toPromise();   
                await this.loginService.guardarTipoCalculoIsc(await this.loginService.obtenerTipoCalculoIsc().toPromise()).toPromise();
                await this.loginService.guardarConcepto(await this.loginService.obtenerConceptos().toPromise()).toPromise();
                await this.loginService.guardarEmpresaLocal(this.loginModel.ruc).toPromise();
            }
            catch(e){
                swal({
                    text: "Error al intentar sincronizarN.",
                    type: 'error',
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-error",
                    confirmButtonText: 'CONTINUAR',
                });

            }
            
        }
        
        // DatatableFunctions.ConnectWebsockets();
        
        this.loginService.obtenerIdEntidad(localStorage.getItem('org_ruc'));
        this.menuOffline = await this.loginService.obtenerMenuOffline().toPromise();
        this.loginService.obtenerMenu()
            // this.loginService.login(usuario.nombreusuario, usuario.contrasenha)
            .subscribe(
            data =>  {

                localStorage.setItem('menuLateral', JSON.stringify(this.menuOffline));
                this.router.navigate([data.moduloUriDefault], { relativeTo: this.route });
            },
            error => {
                this.messageUtils.showError(error);
            },
            () => { }
            );
        

    }
    async ObtenerUsuario() {
        this.usuario = await this.loginService.obtenerUser().toPromise();

        this.organizaciones = this.usuario.organizaciones;

        if (this.organizaciones.length <= 0) {
            this.finishLoading();
            swal({
                text: "El usuario debe tener asignado al menos una organización.",
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: "btn btn-warning"
            });
            return false;
        }
        if (this.organizaciones.length > 1) {
            /*setTimeout(function () {
                $("select").each(function () {
                    $(this).keydown();
                    if (!$(this).val() && $(this).val() == '')
                        $(this.parentElement).addClass("is-empty");
                });
            }, 100);*/
            this.finishLoading();
            $('#mdlOrganizacion').modal('show');
        }
        else {
            let org = this.organizaciones[0];

            /*if (org.nombre.toLowerCase().indexOf("wong") > -1) {
                org.url_image = "wong.png";
            } else if (org.nombre.toLowerCase().indexOf("centenario") > -1) {
                org.url_image = "centenario.png";
            } else if (org.nombre.toLowerCase().indexOf("abinbev") > -1) {
                org.url_image = "abinbev.png";
            }*/
            this.usuario.org_url_image = org.url_image;
            this.usuario.ruc_org = org.ruc;
            this.usuario.isopais_org = org.isoPais;
            this.GuardarSession();
        }
        /*
        if (usuario.perfil == "comprador")
            this.router.navigate(["/ordencompra/comprador/buscar"], { relativeTo: this.route });
        else
            this.router.navigate(["/ordencompra/proveedor/buscar"], { relativeTo: this.route });

    this.finishLoading();
    */
    }
    public verMac() {
        const urlMac = 'http://localhost:3000/v1/sincronizacion/consultarMac';
        let direccionMac: string;
        direccionMac = '';
        this.httpClient.get(urlMac, {
            params: null
          }).subscribe(
            data => {
              console.log(data.mac);
              direccionMac = data.mac.toString();
              swal({
                    title: 'Dirección Mac',
                    html: "<p class='text-center'>" + direccionMac + "</p>",
                    type: 'success',
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-warning"
                });
            }
        );
    }
    iniciarSesion() {
        if (this.loginModel.username == "") {
            swal({
                html: '<div class="text-center"> El usuario es un campo requerido.</div>',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: "btn btn-warning",
                confirmButtonText: 'CONTINUAR',
            });
            return false;
        }
        if (this.loginModel.password == "") {
            swal({
                html: '<div class="text-center"> El password es un campo requerido.</div>',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: "btn btn-warning",
                confirmButtonText: 'CONTINUAR',
            });
            return false;
        }
        console.log('this.loginModel.inicio');
        console.log(this.loginModel.inicio);
        if (this.loginModel.inicio == 'false') {
            console.log('VALIDACION DE RUC');
            if (this.loginModel.ruc == "") {
                swal({
                    html: '<div class="text-center"> El ruc es un campo requerido.</div>',
                    type: 'warning',
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-warning",
                    confirmButtonText: 'CONTINUAR',
                });
                return false;
            }
            if (this.loginModel.ruc == undefined) {
                swal({
                    html: '<div class="text-center"> El ruc es un campo requerido.</div>',
                    type: 'warning',
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-warning",
                    confirmButtonText: 'CONTINUAR',
                });
                return false;
            }
            if (this.loginModel.ruc.length < 11) {
                swal({
                    html: '<div class="text-center"> Tamaño de Ruc Inválido, Formato 11 dígitos. </div>',
                    type: 'warning',
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-warning",
                    confirmButtonText: 'CONTINUAR',
                });
                return false;
            }
        }
        this.loading = true;
        this.uiUtils.showOrHideLoadingScreen(this.loading);
        //let usuario = this.usuarios.find(a=> a.nombreusuario===$("#txtUsuario").val()&& a.contrasenha===$("#txtClave").val());

        this.loginService.login(this.loginModel.username, this.loginModel.password)
            // this.loginService.login(usuario.nombreusuario, usuario.contrasenha)
            .subscribe(
                response => {
                    localStorage.setItem('access_token', response.access_token);
                    var expireDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                    expireDate.setDate(expireDate.getDate()+1);
                    localStorage.setItem('expires', expireDate.getTime().toString());
                    localStorage.setItem('expires_in', response.expires_in);
                    this.ObtenerUsuario();
                    window.setup(true);
                    // this.appUtils.redirect('/home');
                },
                error => {
                    /* empieza login offline*/
                    this.loginService.loginOffline(this.loginModel.username, this.loginModel.password).subscribe(
                        data => {
                            if (data !== null) {
                                //token login
                                localStorage.setItem('access_token', 'cdf1fe11-b36c-4be4-8434-557c143341a6');
                                var expireDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                                expireDate.setDate(expireDate.getDate()+1);
                                localStorage.setItem('expires', expireDate.getTime().toString());
                                localStorage.setItem('expires_in', '1728000');
                                this.ObtenerUsuarioOffline(data);
                                // this.uiUtils.showOrHideLoadingScreen(false);
                                swal.close();
                            }
                            else {
                                this.finishLoading();
                                this.messageUtils.showError(error);
                                swal({
                                    text: "El usuario o clave ingresado no son los correctos!",
                                    type: 'warning',
                                    buttonsStyling: false,
                                    confirmButtonClass: "btn btn-warning"
                                });
                            }

                        },
                        error => {

                            this.finishLoading();
                            this.messageUtils.showError(error);
                            swal({
                                text: "El usuario o clave ingresado no son los correctos!",
                                type: 'warning',
                                buttonsStyling: false,
                                confirmButtonClass: "btn btn-warning"
                            });
                        },
                    );
                    /* termina login offline*/
                },
                () => { }
            );
    }

    ngOnInit() {
        this.checkFullPageBackgroundImage();
        this.obtenerEmpresaLocal();
        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700)

        setTimeout(function () {
            $("select").each(function () {
                $(this).keydown();
                if (!$(this).val() && $(this).val() == '')
                    $(this.parentElement).addClass("is-empty");
            });
        }, 100);

    }
    async obtenerEmpresaLocal(){
        let empresaLocal = await this.loginService.obtenerEmpresaOffline().toPromise();
        console.log(empresaLocal);
        this.loginModel.ruc = empresaLocal.ruc;
        this.loginModel.inicio = empresaLocal.inicio;
        console.log(this.loginModel);
    }
    ngAfterViewInit() {
        DatatableFunctions.ModalSettings();
        this.uiUtils.addOrRemoveBodyBackGround(true, 'bckgrd-50percent-login');
        this.uiUtils.addOrRemoveStyleFooter(true, 'fixed_full');
        $("#txtUsuario").focus();
    }

    ngOnDestroy() {
        this.uiUtils.addOrRemoveBodyBackGround(false, 'bckgrd-50percent-login');
        this.uiUtils.addOrRemoveStyleFooter(false, 'fixed_full');
    }

    finishLoading() {
        this.loading = false;
        this.uiUtils.showOrHideLoadingScreen(this.loading);
    }

    @HostListener('document:keydown', ['$event'])
    public manejador(event: KeyboardEvent): void {
        if (event.keyCode == 13) {
            if ($("#txtUsuario").is(":focus") || $("#txtClave").is(":focus")) {
                $("#btnLogin").focus();
            }
        }
    }
    /* empieza cambios login offline*/
    ObtenerUsuarioOffline(user) {
        let usuario_: any = {};

        usuario_.id = user.id;
        usuario_.nombreusuario = user.nombreusuario;
        usuario_.nombrecompleto = user.nombrecompleto;
        usuario_.perfil = user.perfil;
        usuario_.url_image = user.url_image;
        usuario_.token = user.token;
        usuario_.org_id = user.org_id;
        usuario_.tipo_empresa = user.tipo_empresa;
        usuario_.organizaciones = JSON.parse(user.organizaciones);
        // this.usuario = jsonUser;
        this.usuario = usuario_;

        this.organizaciones = this.usuario.organizaciones;

        // verifica que tenga el usuario una organizacion
        if (this.organizaciones.length <= 0) {
            this.finishLoading();
            swal({
                text: "El usuario debe tener asignado al menos una orgamización.",
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: "btn btn-warning"
            });
            return false;
        }

        // si el usuario tiene al menos una organizacion
        if (this.organizaciones.length > 1) {
            /* setTimeout(function () {
              $("select").each(function () {
                $(this).keydown();
                if (!$(this).val() && $(this).val() == '')
                  $(this.parentElement).addClass("is-empty");
              });
            }, 0);*/
            this.finishLoading();
            $('#mdlOrganizacion').modal('show');
        }
        else {
            let org = this.organizaciones[0];
            if (org.nombre.toLowerCase().indexOf("wong") > -1) {
                org.url_image = "wong.png";
            } else if (org.nombre.toLowerCase().indexOf("centenario") > -1) {
                org.url_image = "centenario.png";
            } else if (org.nombre.toLowerCase().indexOf("abinbev") > -1) {
                org.url_image = "abinbev.png";
            }

            this.usuario.org_url_image = org.url_image;
            this.usuario.ruc_org = org.ruc;
            this.usuario.isopais_org = 'pprueba';



            this.GuardarSessionOffline(this.usuario);
        }

    }
    async GuardarSessionOffline(usuario) {
        localStorage.setItem('org_id', usuario.org_id);
        localStorage.setItem("username", usuario.nombreusuario);
        localStorage.setItem('passwordActual', this.loginModel.password);
        let org = usuario.organizaciones.find(a => a.id == usuario.org_id);

        localStorage.setItem('tipo_empresa', usuario.tipo_empresa);
        localStorage.setItem('Ocp_Apim_Subscription_Key', this.constantesLoginService.Ocp_Apim_Subscription_Key);
        localStorage.setItem('org_nombre', org.nombre);
        localStorage.setItem('org_ruc', org.ruc);

        localStorage.setItem('usuarioActual', JSON.stringify(usuario));

        this.loginService.obtenerIdEntidadOFE(localStorage.getItem('org_ruc'));

        
        this.menuOffline = await this.loginService.obtenerMenuOffline().toPromise();
        
        if (usuario != null) {
            localStorage.setItem('menuLateral', JSON.stringify(this.menuOffline          
            ));
            this.router.navigate(["/comprobantes/factura/crear"], { relativeTo: this.route });
        }
    }
    public menuOffline:any;
    //  [
    //     {
    //         "front": "PEB2M",
    //         "title": "Comprobante",
    //         "mini": "CC",
    //         "id": "1",
    //         "modulos": [
    //             {
    //                 "moduloUri": "//comprobantes/factura/crear",
    //                 "moduloDesc": "Crear",
    //                 "mini": "CC",
    //                 "default": "false",
    //                 "orden": 1,
    //                 "id": "af31777d-22b4-4a9a-aca1-b5f4454ded26"
    //             },
    //             {
    //                 "moduloUri": "//comprobantes/consultar",
    //                 "moduloDesc": "Consultar",
    //                 "mini": "CS",
    //                 "default": "false",
    //                 "orden": 2,
    //                 "id": "1c3bf1e3-8371-4777-a692-1b0be76b8aaa"
    //             }
    //         ],
    //         "orden": 1
    //     },
    //     {
    //         "front": "PEB2M",
    //         "title": "Percepcion/Retencion",
    //         "mini": "",
    //         "id": "2",
    //         "modulos": [
    //             {
    //                 "moduloUri": "//percepcion-retencion/retencion/crear/individual",
    //                 "moduloDesc": "Crear",
    //                 "mini": "CC",
    //                 "default": "true",
    //                 "orden": 1,
    //                 "id": "03797780-2568-4da6-92a1-0ef545bf8290"
    //             },
    //             {
    //                 "moduloUri": "//percepcion-retencion/consultar",
    //                 "moduloDesc": "Consultar",
    //                 "mini": "CC",
    //                 "default": "false",
    //                 "orden": 2,
    //                 "id": "03797780-2568-4da7-92a1-0ef545bf8290"
    //             }
    //         ],
    //         "orden": 2
    //     },
    //     {
    //         "front": "PEB2M",
    //         "title": "Comunicacion de bajas",
    //         "mini": "",
    //         "id": "3",
    //         "modulos": [
    //             {
    //                 "moduloUri": "//resumen-bajas/consultar",
    //                 "moduloDesc": "Consultar",
    //                 "mini": "CS",
    //                 "default": "false",
    //                 "orden": 2,
    //                 "id": "03797780-2568-4da9-92a1-0ef545bf8290"
    //             },
    //             {
    //                 "moduloUri": "//resumen-bajas/crear",
    //                 "moduloDesc": "Crear",
    //                 "mini": "CC",
    //                 "default": "false",
    //                 "orden": 4,
    //                 "id": "03797780-2568-4da8-92a1-0ef545bf8290"
    //             }
    //         ],
    //         "orden": 3
    //     }
    // ];
    // public menuOffline = [
    //     {
    //         "front": "PEB2M",
    //         "logoFront": "https://sab2md.blob.core.windows.net/public-dev/org/logos/b2mining-ico.png",
    //         "icon": "",
    //         "title": "Comprobante",
    //         "mini": "CC",
    //         "modulos": [
    //             {
    //                 "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
    //                 "moduloUri": "//comprobantes/factura/crear",
    //                 "moduloDesc": "Crear",
    //                 "mini": "CC",
    //                 "default": false,
    //             },
    //             {
    //                 "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
    //                 "moduloUri": "//comprobantes/consultar",
    //                 "moduloDesc": "Consultar",
    //                 "mini": "CS",
    //                 "default": false
    //             },
    //             // {
    //             //     "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
    //             //     "moduloUri": "/resumen-boletas/consultar",
    //             //     "moduloDesc": "Resumen Boletas - Consultar",
    //             //     "mini": "RB",
    //             //     "default": false
    //             // },
    //             // {
    //             //     "idModulo": "03797780-2568-4da6-92a1-0ef545bf8290",
    //             //     "moduloUri": "//percepcion-retencion/retencion/crear/masiva",
    //             //     "moduloDesc": "Percepción/Ret. - Crear",
    //             //     "mini": "RE",
    //             //     "default": false
    //             // },
    //             // {
    //             //     "idModulo": "03797780-2568-4da7-92a1-0ef545bf8290",
    //             //     "moduloUri": "//percepcion-retencion/consultar",
    //             //     "moduloDesc": "Percepción/Ret. - Consult",
    //             //     "mini": "RL",
    //             //     "default": true,
    //             //     "botones": [
    //             //         {
    //             //             "habilitado": true,
    //             //             "visible": true,
    //             //             "idBoton": "5a5e3e43-73db-457e-aaaa-9cb1989c7654",
    //             //             "nombre": "buscar",
    //             //             "Desc": "Botón de búsqueda",
    //             //             "Titulo": "BUSCAR"
    //             //         }
    //             //     ]
    //             // },
    //             // {
    //             //     "idModulo": "03797780-2568-4da8-92a1-0ef545bf8290",
    //             //     "moduloUri": "//resumen-bajas/crear",
    //             //     "moduloDesc": "Resumen Bajas - Crear",
    //             //     "mini": "BE",
    //             //     "default": false
    //             // },
    //             // {
    //             //     "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
    //             //     "moduloUri": "//resumen-bajas/consultar",
    //             //     "moduloDesc": "Resumen Bajas - Consult",
    //             //     "mini": "BL",
    //             //     "default": false
    //             // },                            
    //             // {
    //             //     "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
    //             //     "moduloUri": "//reportes",
    //             //     "moduloDesc": "Ver",
    //             //     "mini": "RS",
    //             //     "default": false
    //             // }
    //         ]
    //     },
    //     {
    //         "front": "PEB2M",
    //         "logoFront": "https://sab2md.blob.core.windows.net/public-dev/org/logos/b2mining-ico.png",
    //         "icon": "",
    //         "title": "Percepcion/Retencion",
    //         "modulos": [
    //             {
    //                 "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
    //                 "moduloUri": "//percepcion-retencion/retencion/crear/individual",
    //                 "moduloDesc": "Crear",
    //                 "mini": "CC",
    //                 "default": true,
    //             },
    //             {
    //                 "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
    //                 "moduloUri": "//percepcion-retencion/consultar",
    //                 "moduloDesc": "Consultar",
    //                 "mini": "CS",
    //                 "default": false
    //             },
    //         ]
    //     },
    //     {
    //         "front": "PEB2M",
    //         "logoFront": "https://sab2md.blob.core.windows.net/public-dev/org/logos/b2mining-ico.png",
    //         "icon": "",
    //         "title": "Comunicacion de bajas",
    //         "modulos": [
    //             {
    //                 "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
    //                 "moduloUri": "//resumen-bajas/crear",
    //                 "moduloDesc": "Crear",
    //                 "mini": "CC",
    //                 "default": true,
    //             },
    //             {
    //                 "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
    //                 "moduloUri": "//resumen-bajas/consultar",
    //                 "moduloDesc": "Consultar",
    //                 "mini": "CS",
    //                 "default": false
    //             },
    //         ]
    //     },
    //     {
    //         "front": "PEB2M",
    //         "logoFront": "https://sab2md.blob.core.windows.net/public-dev/org/logos/b2mining-ico.png",
    //         "icon": "",
    //         "title": "Sincronización",
    //         "modulos": [
    //             {
    //                 "idModulo": "03797780-2568-4da9-92a1-0ef545bf8290",
    //                 "moduloUri": "//sincronizacion/sincronizar",
    //                 "moduloDesc": "Sincronización",
    //                 "mini": "CC",
    //                 "default": true,
    //             }
    //         ]
    //     }
    // ];
    /* termina cambios login offline*/

}
