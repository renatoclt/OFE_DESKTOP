import { Routes } from '@angular/router';

import { ConformidadServicioCompradorBuscarComponent } from './comprador/buscar/conformidadserviciocompradorbuscar.component';
import { ConformidadServicioCompradorFormularioComponent} from './comprador/formulario/conformidadserviciocompradorformulario.component';
import { ConformidadServicioProveedorBuscarComponent } from './proveedor/buscar/conformidadservicioproveedorbuscar.component';
import { ConformidadServicioProveedorFormularioComponent} from './proveedor/formulario/conformidadservicioproveedorformulario.component';
import {AuthGuardService} from "app/service/auth-guard.service";

export const ConformidadServicioRoutes: Routes = [
  {

    path: '',
    children: [
      {
        path: 'comprador/buscar',
        component: ConformidadServicioCompradorBuscarComponent,
        canActivate: [AuthGuardService]
      },

      {
        path: 'comprador/formulario/:id',
        component: ConformidadServicioCompradorFormularioComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'proveedor/buscar',
        component: ConformidadServicioProveedorBuscarComponent,
        canActivate: [AuthGuardService]
      },

      {
        path: 'proveedor/formulario/:id',
        component: ConformidadServicioProveedorFormularioComponent,
        canActivate: [AuthGuardService]
      },
    ]
  }
];
