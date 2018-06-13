import {RouteInfo} from './sidebar.metadata';
import * as routesInfoFacturacionElectronica from '../facturacion-electronica/facturacion-electronica.routing.conf';

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard', icon: 'material-icons' },
    { path: '/requerimiento/comprador/buscar', title: 'Requerimientos', icon: 'material-icons' },
    { path: '/requerimiento/comprador/formulario/\d*', title: 'Detalle Requerimiento', icon: 'material-icons' },
    { path: '/requerimiento/comprador/formulario/0', title: 'Crear Requerimiento', icon: 'material-icons' },


    { path: '/requerimiento/proveedor/buscar', title: 'Requerimientos', icon: 'material-icons' },
    { path: '/requerimiento/proveedor/formulario/\d*', title: 'Detalle Requerimiento', icon: 'material-icons' },
    { path: '/requerimiento/proveedor/formulario/0', title: 'Crear Requerimiento', icon: 'material-icons' },


    { path: '/cotizacion/proveedor/buscar', title: 'Cotizaciones', icon: 'material-icons' },
    { path: '/cotizacion/proveedor/formulario/\d*', title: 'Detalle Cotización', icon: 'material-icons' },
    { path: '/cotizacion/proveedor/formulario/0', title: 'Crear Cotización', icon: 'material-icons' },

    { path: '/cotizacion/comprador/buscar', title: 'Cotizaciones', icon: 'material-icons' },
    { path: '/cotizacion/comprador/formulario/\d*', title: 'Detalle Cotización', icon: 'material-icons' },
    { path: '/cotizacion/comprador/formulario/0', title: 'Crear Cotización', icon: 'material-icons' },

    { path: '/guia/proveedor/buscar', title: 'Guías', icon: 'material-icons' },
    { path: '/guia/proveedor/formulario/\d*', title: 'Detalle Guía', icon: 'material-icons' },
    { path: '/guia/comprador/buscar', title: 'Guías', icon: 'material-icons' },
    { path: '/guia/comprador/formulario/\d*', title: 'Detalle Guía', icon: 'material-icons' },

    { path: '/ordencompra/proveedor/buscar', title: 'Orden de Compra', icon: 'material-icons' },
    { path: '/ordencompra/proveedor/formulario/\d*', title: 'Detalle Orden de Compra', icon: 'material-icons' },
    { path: '/ordencompra/comprador/buscar', title: 'Orden de Compra', icon: 'material-icons' },
    { path: '/ordencompra/comprador/formulario/\d*', title: 'Detalle Orden de Compra', icon: 'material-icons' },

    { path: '/factura/proveedor/buscar', title: 'Comprobante de Pago', icon: 'material-icons' },
    { path: '/factura/proveedor/formulario/\d*', title: 'Detalle Comprobante de Pago', icon: 'material-icons' },
    { path: '/factura/comprador/buscar', title: 'Comprobante de Pago', icon: 'material-icons' },
    { path: '/factura/comprador/formulario/\d*', title: 'Detalle Comprobante de Pago', icon: 'material-icons' },

    { path: '/detraccion/proveedor/buscar', title: 'Detracción', icon: 'material-icons' },
    { path: '/detraccion/proveedor/formulario/\d*', title: 'Detalle Detracción', icon: 'material-icons' },
    { path: '/detraccion/comprador/buscar', title: 'Detracción', icon: 'material-icons' },
    { path: '/detraccion/comprador/formulario/\d*', title: 'Detalle Detraccióntalle ', icon: 'material-icons' },

    { path: '/retención/proveedor/buscar', title: 'Retención', icon: 'material-icons' },
    { path: '/retención/proveedor/formulario/\d*', title: 'Detalle Retención', icon: 'material-icons' },
    { path: '/retención/comprador/buscar', title: 'Retención', icon: 'material-icons' },
    { path: '/retención/comprador/formulario/\d*', title: 'Detalle Retención ', icon: 'material-icons' },



    { path: '/conformidadservicio/proveedor/buscar', title: 'Aceptación de Servicio', icon: 'material-icons' },
    { path: '/conformidadservicio/proveedor/formulario/\d*', title: 'Detalle Aceptación de Servicio', icon: 'material-icons' },
    { path: '/conformidadservicio/comprador/buscar', title: 'Aceptación de Servicio', icon: 'material-icons' },
    { path: '/conformidadservicio/comprador/formulario/\d*', title: 'Detalle Aceptación de Servicio', icon: 'material-icons' },
    ...(routesInfoFacturacionElectronica.routesInfo)

];
