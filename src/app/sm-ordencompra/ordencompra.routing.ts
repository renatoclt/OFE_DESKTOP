import { Routes } from '@angular/router';

import { OrdenCompraCompradorBuscarComponent } from './comprador/buscar/ordencompracompradorbuscar.component';
import { OrdenCompraCompradorFormularioComponent} from './comprador/formulario/ordencompracompradorformulario.component';
import { OrdenCompraProveedorBuscarComponent } from './proveedor/buscar/ordencompraproveedorbuscar.component';
import { OrdenCompraProveedorFormularioComponent} from './proveedor/formulario/ordencompraproveedorformulario.component';
import {AuthGuardService} from "app/service/auth-guard.service";

export const OrdenCompraRoutes: Routes = [
  {

    path: '',
    children: [
      {
        path: 'refrescar',
        component: OrdenCompraCompradorBuscarComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'comprador/buscar',
        component: OrdenCompraCompradorBuscarComponent,
        canActivate: [AuthGuardService]
      },

      {
        path: 'comprador/formulario/:id',
        component: OrdenCompraCompradorFormularioComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'proveedor/buscar',
        component: OrdenCompraProveedorBuscarComponent,
        canActivate: [AuthGuardService]
      },

      {
        path: 'proveedor/formulario/:id',
        component: OrdenCompraProveedorFormularioComponent,
        canActivate: [AuthGuardService]
      },
    ]
  }
];
