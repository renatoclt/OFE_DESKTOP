import {CanActivate, Routes} from '@angular/router';

import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import {AuthLayoutComponent} from './layouts/auth/auth-layout.component';
import {AuthGuardService} from './service/auth-guard.service';

import * as routesFacturacionElectronica from './facturacion-electronica/facturacion-electronica.routing';
import { ConsultaClienteComponent } from 'app/cliente/consulta-cliente.component';
import { VisualizarComprobanteClienteComponent } from 'app/cliente/comprobantes-visualizar/visualizar-comprobante-cliente.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '',
        component: AdminLayoutComponent,
        canActivateChild: [AuthGuardService],
        children: [


            {
                path: 'cotizacion',
                loadChildren: './cotizacion/cotizacion.module#CotizacionModule',
                canActivate: [AuthGuardService]
            },


            {
                path: 'requerimiento',
                loadChildren: './requerimiento/requerimiento.module#RequerimientoModule',
                canActivate: [AuthGuardService]
            },

            {
                path: 'guia',
                loadChildren: './guia/guia.module#GuiaModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'factura',
                loadChildren: './factura/factura.module#FacturaModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'ordencompra',
                loadChildren: './ordencompra/ordencompra.module#OrdenCompraModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'conformidadservicio',
                loadChildren: './conformidadservicio/conformidadservicio.module#ConformidadServicioModule',
                canActivate: [AuthGuardService]
            },

            /*{
                path: 'detraccion',
                loadChildren: './detraccion/detraccion.module#DetraccionModule',
                canActivate: [AuthGuardService]
            },
            {
                path: 'retencion',
                loadChildren: './retencion/retencion.module#retencionModule',
                canActivate: [AuthGuardService]
            },*/


            ...routesFacturacionElectronica.routes

        ]
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: './login/login.module#LoginModule'
            },
            {
                path: '',
                loadChildren: './cliente/cliente.module#ClienteModule'
            },
            // {
            //     path: 'consultacliente',
            //     component: ConsultaClienteComponent
            // },
            // {
            //     path: 'consultacliente/visualizar',
            //     component: VisualizarComprobanteClienteComponent
            // },
        ]
    },
];
