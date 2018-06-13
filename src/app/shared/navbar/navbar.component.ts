import {Component, Directive, ElementRef, OnInit, Renderer, ViewChild} from '@angular/core';
import {ROUTES} from '../.././sidebar/sidebar-routes.config';
import {ActivatedRoute, Router} from '@angular/router';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {Organizacion, Usuario} from 'app/model/usuario';
import {LoginService} from 'app/service/login.service';

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

export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private org_id_original: string;
    private sidebarVisible: boolean;
    public organizaciones: Organizacion[];
    public usuario: Usuario = new Usuario();
    public PermitirCambiarOrganizacion: boolean = false;
    @ViewChild("navbar-cmp") button;

    constructor(location: Location, private router: Router, private route: ActivatedRoute, private renderer: Renderer, private element: ElementRef, private loginService: LoginService) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        this.usuario = JSON.parse(localStorage.getItem('usuarioActual')) as Usuario;
        if (this.usuario) {
            this.organizaciones = this.usuario.organizaciones;
            if (this.organizaciones && this.organizaciones.length > 1) {

                this.PermitirCambiarOrganizacion = true;
            }
        }
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

    }

    isMobileMenu() {
        if ($(window).width() < 991) {
            return false;
        }
        return true;
    }

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
        //console.log('titlee',titlee);
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(2);
        }
        //console.log('titlee',titlee);
        //console.log('this.listTitles',this.listTitles);

        let selected = this.listTitles.find(a => a.path === titlee);
        //console.log('selected',selected);

        if (selected && selected.title) {
            return selected.title;

        }
        else {
            selected = this.listTitles.find(a => EncontrarPath(a, titlee));
            if (selected && selected.title) {
                return selected.title;

            }
        }
        return 'Dashboard';
    }

    getPath() {
        return this.location.prepareExternalUrl(this.location.path());
    }

    logout(event) {
        localStorage.clear();
        // const baseurl = $('#baseurl').attr('href');
        // window.location.href = baseurl;
        console.log('LOGIN');

        this.router.navigate([''], {relativeTo: this.route});
        // this.router.navigateByUrl( '../../login' );

        // oNavbarComponent.loginService.KillToken()
        //     .subscribe(
        //     response => {
        //         console.log('response', response);
        //         localStorage.clear();
        //         let baseurl = $('#baseurl').attr('href');
        //         //window.location.href = baseurl;
        //     },
        //     error => {
        //         console.error('error', error);
        //         localStorage.clear();
        //         let baseurl = $('#baseurl').attr('href');
        //         window.location.href = baseurl;
        //     },
        //     () => { }
        //     );

        // if (event)
        //     event.preventDefault();

    }

    cambiarOrganizacion($event) {
        this.usuario = JSON.parse(localStorage.getItem('usuarioActual')) as Usuario;

        localStorage.setItem('org_id_original', this.usuario.org_id);
        $('#mdlOrganizacion').modal('show');


        event.preventDefault();
    }
    AceptarOrganizacion(event) {

        console.log('AceptarOrganizacion');
        this.org_id_original = localStorage.getItem('org_id_original');
        if (this.org_id_original != this.usuario.org_id) {

            this.GuardarSession();
            let org = this.usuario.organizaciones.find(a => a.id == this.usuario.org_id) as Organizacion;
            this.usuario.tipo_empresa = org.tipo_empresa;


            // console.log(org);

        }
        $('#mdlOrganizacion').modal('toggle');
        if (event)
            event.preventDefault();
    }

    GuardarSession() {
        localStorage.setItem('org_id', this.usuario.org_id);
        localStorage.setItem("username", this.usuario.nombreusuario);

        let org = this.usuario.organizaciones.find(a => a.id == this.usuario.org_id);

        localStorage.setItem('tipo_empresa', this.usuario.tipo_empresa);
        localStorage.setItem('Ocp_Apim_Subscription_Key', org.keySuscripcion);
        localStorage.setItem('org_nombre', org.nombre);
        localStorage.setItem('org_ruc', org.ruc);

        this.usuario.ruc_org = org.ruc;
        this.usuario.tipo_empresa = org.tipo_empresa;
        this.usuario.org_url_image = org.url_image;
        this.usuario.isopais_org = org.isoPais;

        localStorage.setItem('usuarioActual', JSON.stringify(this.usuario));
        let baseurl = $('#baseurl').attr('href');

        let oSidebarComponent = DatatableFunctions.getSidebarComponent();
        if (oSidebarComponent)
            oSidebarComponent.usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

        this.loginService.obtenerMenu()
            // this.loginService.login(usuario.nombreusuario, usuario.contrasenha)
            .subscribe(
            data => {


                localStorage.setItem('menuLateral', JSON.stringify(data.menus));
                //this.router.navigate([data.moduloUriDefault], { relativeTo: this.route });
                let url = baseurl + data.moduloUriDefault;
                url = url.replace('//', '/');
                window.location.href = url;

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
