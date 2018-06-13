import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive } from '@angular/core';
import { ROUTES } from '../.././sidebar/sidebar-routes.config';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Usuario, Organizacion } from 'app/model/usuario';
import { LoginService } from 'app/service/login.service';
import { BaseComponent } from '../../base/base.component';
import { Injector } from '@angular/core';

var misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
}
declare var $, DatatableFunctions: any;
var oNavbarComponent: NavbarComponent;
@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html',
    providers: [LoginService]
})

export class NavbarComponent  extends BaseComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private org_id_original: string;
    private tipo_org_original: string;
    private sidebarVisible: boolean;
    public organizaciones: Organizacion[];
    public usuarioSesion: Usuario;
    public PermitirCambiarOrganizacion: boolean;
    public PermitirCambiarTipoOrganizacion: boolean;
    public selTipo_empresa: string;
    public selOrganizacionActiva: string;
    public esNuevaOrgSel: boolean;

    @ViewChild('navbar-cmp') button;

    constructor(injector: Injector, location: Location, private router: Router, private route: ActivatedRoute,
                private renderer: Renderer, private element: ElementRef, private loginService: LoginService) {
        super(injector);
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;

        // this.usuario = JSON.parse(localStorage.getItem('usuarioActual')) as Usuario;
        this.usuarioSesion = new Usuario;
        this.usuarioSesion.setearDatosDeObjJ(JSON.parse(localStorage.getItem('usuarioActual')));
        this.selTipo_empresa='';
        this.selOrganizacionActiva='';
        this.esNuevaOrgSel=false;
        this.PermitirCambiarOrganizacion = false;
        this.PermitirCambiarTipoOrganizacion = false;

        if (this.usuarioSesion) {
            if (this.usuarioSesion.tipo_empresa === 'C') {
                this.organizaciones = this.usuarioSesion.dameOrgComp();
            }else{
                this.organizaciones = this.usuarioSesion.dameOrgProv();
            }

            if (this.organizaciones && this.organizaciones.length > 1) {
                this.PermitirCambiarOrganizacion = true;
                this.selOrganizacionActiva = this.usuarioSesion.org_id;
            }

            let org = this.usuarioSesion.organizaciones.find(a => a.id == this.usuarioSesion.org_id) as Organizacion;
            if (org.tipo_empresa.split(',').length > 1) {
                this.PermitirCambiarTipoOrganizacion = true;
                this.selTipo_empresa = this.usuarioSesion.tipo_empresa;
            }
        }



        /*
        if (this.usuario) {
            this.organizaciones = this.usuario.organizaciones;

            if (this.organizaciones && this.organizaciones.length > 1) {
                this.PermitirCambiarOrganizacion = true;
                this.selOrganizacionActiva = this.usuario.org_id;
            }

            let org = this.usuario.organizaciones.find(a => a.id == this.usuario.org_id) as Organizacion;
            if(org.tipo_empresa.split(',').length>1){
                this.PermitirCambiarTipoOrganizacion = true;
                this.selTipo_empresa = this.usuario.tipo_empresa;
            }
        }
        */
    }

    ngOnInit() {
        oNavbarComponent = this;

        DatatableFunctions.SetNavbarComponent(oNavbarComponent);
        this.listTitles = ROUTES.filter(listTitle => listTitle);

        var navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        if ($('body').hasClass('sidebar-mini')) {
            misc.sidebar_mini_active = true;
        }
        $('#minimizeSidebar').click(function () {
            var $btn = $(this);

            if (misc.sidebar_mini_active == true) {
                $('body').removeClass('sidebar-mini');
                misc.sidebar_mini_active = false;

            } else {
                setTimeout(function () {
                    $('body').addClass('sidebar-mini');

                    misc.sidebar_mini_active = true;
                }, 300);
            }

            // we simulate the window Resize so the charts will get updated in realtime.
            var simulateWindowResize = setInterval(function () {
                window.dispatchEvent(new Event('resize'));
            }, 180);

            // we stop the simulation of Window Resize after the animations are completed
            setTimeout(function () {
                clearInterval(simulateWindowResize);
            }, 1000);
        });

    };

    ngAfterViewInit() {

        setTimeout(function () {
            $('input').each(function () {
                $(this).keydown();
                if (!$(this).val() && $(this).val() === '') {
                    $(this.parentElement).addClass('is-empty');
                }
            });
            $('select').each(function () {
                $(this).keydown();
                if (!$(this).val() && $(this).val() === '') {
                    $(this.parentElement).addClass('is-empty');
                }
            });
            $('textarea').each(function () {
                $(this).keydown();
                if (!$(this).val() && $(this).val() === '') {
                    $(this.parentElement).addClass('is-empty');
                }
            });
        }, 100);
    };

    isMobileMenu() {
        if ($(window).width() < 991) {
            return false;
        }
        return true;
    };

    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];

        if (this.sidebarVisible == false) {
            setTimeout(function () {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            $(".main-panel").append("<div class='close-layer visible' style='height: 4252px;'></div>");
            var navbarcmp = this;
            $(".close-layer").on("click", function () {
                navbarcmp.sidebarToggle();
            });
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
            $(".close-layer").remove();
        }
    }

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        // console.log('titlee',titlee);
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(2);
        }
        // console.log('titlee',titlee);
        // console.log('this.listTitles',this.listTitles);

        let selected = this.listTitles.find(a => a.path === titlee);
        // console.log('selected',selected);

        if (selected && selected.title) {
            return selected.title;
        } else {
            selected = this.listTitles.find(a => EncontrarPath(a, titlee));
            if (selected && selected.title) {
                return selected.title;

            }
        }
        return 'Dashboard';
    };

    getPath() {
        return this.location.prepareExternalUrl(this.location.path());
    };

    logout(event) {

        oNavbarComponent.loginService.KillToken()
            .subscribe(
            response => {
                console.log('response', response);
                localStorage.clear();
                let baseurl = $('#baseurl').attr('href');
                window.location.href = baseurl;
            },
            error => {
                console.error('error', error);
                localStorage.clear();
                let baseurl = $('#baseurl').attr('href');
                window.location.href = baseurl;
            },
            () => { }
            );

        if (event) {
            event.preventDefault();
        }
    };


    cambiarOrganizacion($event) {
     //   this.usuario = JSON.parse(localStorage.getItem('usuarioActual')) as Usuario;

        localStorage.setItem('org_id_original', this.usuarioSesion.org_id);
        $('#mdlOrganizacion').modal('show');

        event.preventDefault();
    };

    AceptarOrganizacion(event) {
        console.log('AceptarOrganizacion');
        this.org_id_original = localStorage.getItem('org_id_original');
        if (this.org_id_original != this.selOrganizacionActiva) {

            this.usuarioSesion.org_id = this.selOrganizacionActiva;
            // this.GuardarSession();
            let org = this.usuarioSesion.organizaciones.find(a => a.id == this.usuarioSesion.org_id) as Organizacion;

            this.usuarioSesion.org_id = org.id;
            this.usuarioSesion.isopais_org = org.isoPais;
            this.usuarioSesion.org_url_image = org.url_image;

            this.usuarioSesion.keySuscripcion = org.keySuscripcion;
            this.usuarioSesion.nombreOrgActiva = org.nombre;
            this.usuarioSesion.ruc_org = org.ruc;

            // this.usuario.tipo_empresa = this.org_id_original.ti
            // this.GuardarSession();

            this.uiUtils.showOrHideLoadingScreen(true);
            oNavbarComponent.GuardarSession();

            /*
            if(org.tipo_empresa.split(',').length>1){
                /// this.finishLoading();
                this.esNuevaOrgSel = true;
                $('#mdlTipoOrganizacion').modal('show');
            }else{
                this.usuario.tipo_empresa = org.tipo_empresa;
                // this.GuardarSession();
                setTimeout(function () { oNavbarComponent.GuardarSession(); }, 100);

                //    this.finishLoading();
            }
            */
            // this.usuario.tipo_empresa = org.tipo_empresa;
            // setTimeout(function () { this.GuardarSession(); }, 100);

            // console.log(org);
        }
        $('#mdlOrganizacion').modal('toggle');
        if (event) {
            event.preventDefault();
        }
    };


    cambiarTipoOrganizacion($event) {

        if (this.usuarioSesion.tipo_empresa === 'C') {
            this.usuarioSesion.tipo_empresa = 'P';
        }else {
            this.usuarioSesion.tipo_empresa = 'C';
        }

        // = this.selTipo_empresa;
        this.uiUtils.showOrHideLoadingScreen(true);
        this.GuardarSession();

        /*
        return null;

        this.usuarioSesion = JSON.parse(localStorage.getItem('usuarioActual')) as Usuario;

        localStorage.setItem('tipo_org_original', this.usuarioSesion.tipo_empresa);
        this.selTipo_empresa='';
        this.esNuevaOrgSel=false;
        setTimeout(function () { $('#mdlTipoOrganizacion').modal('show'); }, 100);

        event.preventDefault();
        */
    };

    AceptarTipoOrganizacion(event) {

        console.log('AceptarTipoOrganizacion');
        this.tipo_org_original = localStorage.getItem('tipo_org_original');

        if (this.tipo_org_original != this.selTipo_empresa) {
            this.usuarioSesion.tipo_empresa = this.selTipo_empresa;
            this.GuardarSession();

            // let org = this.usuario.organizaciones.find(a => a.id == this.usuario.org_id) as Organizacion;
            // this.usuario.tipo_empresa = org.tipo_empresa;
            // console.log(org);
        }
        $('#mdlTipoOrganizacion').modal('toggle');
        if (event) {
            event.preventDefault();
        }
    };

    GuardarSession() {
        localStorage.setItem('username', this.usuarioSesion.nombreusuario);
        localStorage.setItem('org_id', this.usuarioSesion.org_id);        
        localStorage.setItem('Ocp_Apim_Subscription_Key', this.usuarioSesion.keySuscripcion);
        localStorage.setItem('org_nombre', this.usuarioSesion.nombreOrgActiva);
        localStorage.setItem('org_ruc', this.usuarioSesion.ruc_org);
        localStorage.setItem('tipo_empresa', this.usuarioSesion.tipo_empresa);

        localStorage.setItem('usuarioActual', JSON.stringify(this.usuarioSesion));
        let baseurl = $('#baseurl').attr('href');

        let oSidebarComponent = DatatableFunctions.getSidebarComponent();
        if (oSidebarComponent) {
            oSidebarComponent.usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        }

        this.loginService.obtenerMenu()
            // this.loginService.login(usuario.nombreusuario, usuario.contrasenha)
                        .subscribe(
                            data => {
                                localStorage.setItem('menuLateral', JSON.stringify(data.menus));
                                //this.router.navigate([data.moduloUriDefault], { relativeTo: this.route });
                                let url = baseurl + data.moduloUriDefault;
                                url = url.replace('//', '/');
                                window.location.href = url;
          //                      this.router.navigate([url], { relativeTo: this.route });

                                this.uiUtils.showOrHideLoadingScreen(false);
                            },
                            error => {
                                console.error(error);
                            },
                            () => { }
                        );
    }
}

function EncontrarPath(element, path) {

    var str_regex = element.path.replace('/', '\/');
    var regex = new RegExp(str_regex, "i");

    var match = regex.test(path);
    return match;
}
