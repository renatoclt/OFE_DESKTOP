export class RootMenu{
    moduloUriDefault: string;
    menus: Menu[];

    constructor() {
        this.menus = [];
    }

    setEnLocalStorage() {
      // console.log(JSON.stringify(this));
        localStorage.setItem('RootMenu', JSON.stringify(this));
    }

    getDeLocalStorage() {
      // console.log('RootMenu');
      // console.log(JSON.parse(localStorage.getItem('RootMenu')));
        this.setearDatosDeObjJ(JSON.parse(localStorage.getItem('RootMenu')));
    }

    setearDatosDeObjJ(obj) {
        this.moduloUriDefault = obj.moduloUriDefault;
        this.menus = [];

        for (let i = 0 ; i < obj.menus.length ; i++) {
            const item = new Menu();
            item.setearDatosDeObjJ(obj.menus[i]);
            this.menus.push(item);
        }
    }
}

export class Menu {
    front: string;
    logoFront: string;
    icon: string;
    title: string;
    modulos: Modulo[];

    constructor() {
        this.modulos = [];
    }

    setEnLocalStorage() {
        localStorage.setItem('menuLateral', JSON.stringify(this));
    }

    getDeLocalStorage() {
        this.setearDatosDeObjJ(JSON.parse(localStorage.getItem('menuLateral')));
    }

    setearDatosDeObjJ(obj) {
        this.front = obj.front;
        this.logoFront = obj.logoFront;
        this.icon = obj.icon;
        this.title = obj.title;
        this.modulos = [];

        for (let i = 0; i < obj.modulos.length; i++) {
            const item = new Modulo();
            item.setearDatosDeObjJ(obj.modulos[i]);
            this.modulos.push(item);
        }
    }

    buscarURILmodulo(nombre: string) {
        for (let i = 0; i < this.modulos.length; i++) {
            if (this.modulos[i].estaNombreRelacionadoConURI(nombre)) {
                return this.modulos[i].moduloUri;
            }
        }
        return '';
    }
}

export class Modulo {
    idModulo: string;
    logoFront: string;
    moduloUri: string;
    moduloDesc: string;
    mini: string;
    default: boolean;
    botones?: Boton[];

    constructor() {
        this.botones = [];
    }

    setearDatosDeObjJ(obj){
        this.idModulo = obj.idModulo;
        this.logoFront = obj.logoFront;
        this.moduloUri = obj.moduloUri;
        this.moduloDesc = obj.moduloDesc;
        this.mini = obj.mini;
        this.default = obj.default;
        this.botones = [];

        for (let i = 0; i < obj.botones.length; i++) {
            const item = new Boton();
            item.setearDatosDeObjJ(obj.botones[i]);
            this.botones.push(item);
        }
    }

    estaNombreRelacionadoConURI(nombre: string) {

        if ( nombre === 'requerimiento') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['sm-requerimiento' , 'egp-requerimiento'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'cotizacion') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['sm-cotizacion' , 'egp-cotizacion'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'oc') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['ordencompra' , 'sm-ordencompra' , 'egp-ordencompra'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'guia') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['guia' , 'sm-guia'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'has') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['conformidadservicio'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'ticket') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['transporte'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'factura') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['factura' , 'sm-factura' , 'cl-factura'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'retencion') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['sm-retencion'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'detraccion') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['sm-detraccion'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'solpago') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['solpago'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'grupoempresarial') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['grupoempresarial'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'organizacion') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['organizacion'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'modulo') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['modulo'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'contrato') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['contrato'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'usuario') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['usuario'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'accesousuario') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['accesousuario'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'aprobador') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['aprobador'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'indicadores') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['indicadores'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'reportes') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['reportes'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'confcalendarios') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['confcalendarios'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        if ( nombre === 'confparametros') {
            const arrayNom =  this.moduloUri.split('/');
            const list = ['confparametros'];
            if ( arrayNom[0] in list ) {
                return true;
            }
            return false;
        }

        return false;
    }
}

export class Boton {

    idBoton: string;
    nombre: string;
    Desc: string;
    habilitado: boolean;
    visible: boolean;
    Titulo?: string;

    constructor() {
        this.habilitado = false;
        this.visible = true;
    }

    setearDatosDeObjJ(obj) {
        this.idBoton = obj.idBoton;
        this.nombre = obj.nombre;
        this.Desc = obj.Desc;
        this.habilitado = obj.habilitado;
        this.visible = obj.visible;
        this.Titulo = obj.Titulo;
    }
}