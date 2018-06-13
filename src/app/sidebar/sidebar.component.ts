import {AfterContentInit, AfterViewChecked, AfterViewInit, Component, Injector, OnInit} from '@angular/core';
import {ROUTES} from './sidebar-routes.config';
import {Organizacion, Usuario} from 'app/model/usuario';
import {BaseComponent} from '../base/base.component';
import {LoginService} from 'app/service/login.service';

declare var $, DatatableFunctions: any;
var sidebarTimer;

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent extends BaseComponent implements OnInit {
    public menuItems: any[];
    public usuarioActual: Usuario= new Usuario();
    public menuLateral: any[];
    loading: boolean = false;
    public organizaciones: Organizacion[];
    public PermitirCambiarOrganizacion: boolean = false;
    constructor(injector: Injector, private loginService: LoginService) {
        super(injector);
    }

    isNotMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }
    getRUCOrganizacion() {
        let usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        return usuarioActual.org_url_image != null ? "" : usuarioActual.isopais_org + usuarioActual.ruc_org

    }

    ngOnInit() {
        DatatableFunctions.SetSidebarComponent(this);

        this.usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

        if (this.usuarioActual) {
            this.organizaciones = this.usuarioActual.organizaciones;
            if (this.organizaciones && this.organizaciones.length > 1) {

                this.PermitirCambiarOrganizacion = true;
            }
        }
        var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        if (isWindows) {
            // if we are on windows OS we activate the perfectScrollbar function
            var $sidebar = $('.sidebar-wrapper');
            $sidebar.perfectScrollbar();
        }
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

        if (isWindows) {
            // if we are on windows OS we activate the perfectScrollbar function
            $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
            $('html').addClass('perfect-scrollbar-on');
        } else {
            $('html').addClass('perfect-scrollbar-off');
        }

        let menu = JSON.parse(localStorage.getItem('menuLateral'));
        this.menuLateral = Object.keys(menu).map(function (k) { return menu[k] });
        console.log('this.menuLateral', this.menuLateral);
        this.finishLoading();
    }

    ngAfterViewInit() {
        // init Moving Tab after the view is initialisez
        setTimeout(() => {
            if (mda.movingTabInitialised == false) {
                mda.initMovingTab();
                mda.movingTabInitialised = true;
            }
        }, 10);
    }

    finishLoading() {
        this.uiUtils.showOrHideLoadingScreen(false);
    }

    logout(event) {
        this.loginService.KillToken()
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

        event.preventDefault();
    }

    cambiarOrganizacion($event) {
        $('#navbar_toggle_main').click();
        let usuario = JSON.parse(localStorage.getItem('usuarioActual')) as Usuario;
        localStorage.setItem('org_id_original', usuario.org_id);
        setTimeout(
            function () {
                $('#mdlOrganizacion').modal('show');
            },
            1000);
        event.preventDefault();
    }

}

// The Moving Tab (the element that is moving on the sidebar, when you switch the pages) is depended on jQuery because it is doing a lot of calculations and changes based on Bootstrap collapse elements. If you have a better suggestion please send it to hello@creative-tim.com and we would be glad to talk more about this improvement. Thank you!
var mda: any = {
    movingTab: '<div class="sidebar-moving-tab"/>',
    isChild: false,
    sidebarMenuActive: '',
    movingTabInitialised: false,
    distance: 0,

    setMovingTabPosition: function ($currentActive) {
        try {
            $currentActive = mda.sidebarMenuActive;
            mda.distance = $currentActive.parent().position().top - 10;

            if ($currentActive.closest('.collapse').length != 0) {
                var parent_distance = $currentActive.closest('.collapse').parent().position().top;
                mda.distance = mda.distance + parent_distance;
            }
            mda.moveTab();
        } catch (ex) { }


    },
    initMovingTab: function () {

        mda.movingTab = $(mda.movingTab);

        mda.sidebarMenuActive = $('.sidebar .nav-container > .nav > li.active > a:not([data-toggle="collapse"]');

        if (mda.sidebarMenuActive.length != 0) {
            mda.setMovingTabPosition(mda.sidebarMenuActive);
        } else {
            mda.sidebarMenuActive = $('.sidebar .nav-container .nav > li.active .collapse li.active > a');
            mda.isChild = true;
            this.setParentCollapse();
        }

        mda.sidebarMenuActive.parent().addClass('visible');

        var button_text = mda.sidebarMenuActive.html();
        mda.movingTab.html(button_text);

        $('.sidebar .nav-container').append(mda.movingTab);

        if (window.history && window.history.pushState) {
            $(window).on('popstate', function () {

                setTimeout(function () {
                    mda.sidebarMenuActive = $('.sidebar .nav-container .nav li.active a:not([data-toggle="collapse"])');

                    if (mda.isChild == true) {
                        if (this.setParentCollapse)
                            this.setParentCollapse();
                    }
                    clearTimeout(sidebarTimer);

                    var $currentActive = mda.sidebarMenuActive;

                    $('.sidebar .nav-container .nav li').removeClass('visible');

                    var $movingTab = mda.movingTab;
                    $movingTab.addClass('moving');

                    $movingTab.css('padding-left', $currentActive.css('padding-left'));
                    var button_text = $currentActive.html();

                    mda.setMovingTabPosition($currentActive);

                    sidebarTimer = setTimeout(function () {
                        $movingTab.removeClass('moving');
                        $currentActive.parent().addClass('visible');
                    }, 650);

                    setTimeout(function () {
                        $movingTab.html(button_text);
                    }, 10);
                }, 10);

            });
        }

        $('.sidebar .nav .collapse').on('hidden.bs.collapse', function () {
            try {
                var $currentActive = mda.sidebarMenuActive;

                mda.distance = $currentActive.parent().position().top - 10;

                if ($currentActive.closest('.collapse').length != 0) {
                    var parent_distance = $currentActive.closest('.collapse').parent().position().top;
                    mda.distance = mda.distance + parent_distance;
                }

                mda.moveTab();
            } catch (ex) { }
        });

        $('.sidebar .nav .collapse').on('shown.bs.collapse', function () {
            try {
                var $currentActive = mda.sidebarMenuActive;

                mda.distance = $currentActive.parent().position().top - 10;

                if ($currentActive.closest('.collapse').length != 0) {
                    var parent_distance = $currentActive.closest('.collapse').parent().position().top;
                    mda.distance = mda.distance + parent_distance;
                }

                mda.moveTab();
            } catch (ex) { }
        });

        $('.sidebar .nav-container .nav > li > a:not([data-toggle="collapse"])').click(function () {

            mda.sidebarMenuActive = $(this);
            var $parent = $(this).parent();

            if (mda.sidebarMenuActive.closest('.collapse').length == 0) {
                mda.isChild = false;
            }

            // we call the animation of the moving tab
            clearTimeout(sidebarTimer);

            var $currentActive = mda.sidebarMenuActive;

            $('.sidebar .nav-container .nav li').removeClass('visible');

            var $movingTab = mda.movingTab;
            $movingTab.addClass('moving');

            $movingTab.css('padding-left', $currentActive.css('padding-left'));
            var button_text = $currentActive.html();

            var $currentActive = mda.sidebarMenuActive;
            try {
                mda.distance = $currentActive.parent().position().top - 10;
            }
            catch (ex) { }

            if ($currentActive.closest('.collapse').length != 0) {
                var parent_distance = $currentActive.closest('.collapse').parent().position().top;
                mda.distance = mda.distance + parent_distance;
            }

            mda.moveTab();

            sidebarTimer = setTimeout(function () {
                $movingTab.removeClass('moving');
                $currentActive.parent().addClass('visible');
            }, 650);

            setTimeout(function () {
                $movingTab.html(button_text);
            }, 10);
        });
    },
    setParentCollapse: function () {
        if (mda.isChild == true) {
            var $sidebarParent = mda.sidebarMenuActive.parent().parent().parent();
            var collapseId = $sidebarParent.siblings('a').attr("href");

            $(collapseId).collapse("show");

            $(collapseId).collapse()
                .on('shown.bs.collapse', () => {
                    mda.setMovingTabPosition();
                })
                .on('hidden.bs.collapse', () => {
                    mda.setMovingTabPosition();
                });
        }
    },
    animateMovingTab: function () {

        clearTimeout(sidebarTimer);

        var $currentActive = mda.sidebarMenuActive;

        $('.sidebar .nav-container .nav li').removeClass('visible');

        var $movingTab = mda.movingTab;
        $movingTab.addClass('moving');

        $movingTab.css('padding-left', $currentActive.css('padding-left'));
        var button_text = $currentActive.html();

        mda.setMovingTabPosition($currentActive);

        sidebarTimer = setTimeout(function () {
            $movingTab.removeClass('moving');
            $currentActive.parent().addClass('visible');
        }, 650);

        setTimeout(function () {
            $movingTab.html(button_text);
        }, 10);
    },
    moveTab: function () {
        mda.movingTab.css({
            'transform': 'translate3d(0px,' + mda.distance + 'px, 0)',
            '-webkit-transform': 'translate3d(0px,' + mda.distance + 'px, 0)',
            '-moz-transform': 'translate3d(0px,' + mda.distance + 'px, 0)',
            '-ms-transform': 'translate3d(0px,' + mda.distance + 'px, 0)',
            '-o-transform': 'translate3d(0px,' + mda.distance + 'px, 0)'
        });
    }
};
