import { Routes } from '@angular/router';




import {FacturaCompradorBuscarComponent} from "./comprador/buscar/facturacompradorbuscar.component";
import {FacturaCompradorFormularioComponent} from "./comprador/formulario/facturacompradorformulario.component";
import {FacturaCompradorFormularioComponentPub} from "./comprador/formulario-pub/facturacompradorformulario.component";

import { FacturaProveedorBuscarComponent } from './proveedor/buscar/facturaproveedorbuscar.component';
import {FacturaProveedorFormularioComponentPre} from "./proveedor/formulario-pre/facturaproveedorformulario.component";
import { FacturaProveedorFormularioComponentPub} from "./proveedor/formulario-pub/facturaproveedorformulario.component";

import {AuthGuardService} from "app/service/auth-guard.service";


export const FacturaRoutes: Routes = [
  {
      path: '',
      children: [ 
                  {
                    path: 'comprador/buscar',
                    component: FacturaCompradorBuscarComponent,
                    canActivate: [AuthGuardService]
                  },
                  {
                    path: 'comprador/formulario/:id',
                    component: FacturaCompradorFormularioComponent,
                    canActivate: [AuthGuardService]
                  },
                  {
                    path: 'comprador/formulario-pub/:id',
                    component: FacturaCompradorFormularioComponentPub,
                    canActivate: [AuthGuardService]
                  },
                  {
                    path: 'proveedor/buscar',
                    component: FacturaProveedorBuscarComponent,
                    canActivate: [AuthGuardService]
                  },
                  {
                    path: 'proveedor/formulario-pre/:id',
                    component: FacturaProveedorFormularioComponentPre,
                    canActivate: [AuthGuardService]
                  },
                  {
                    path: 'proveedor/formulario-pub/:id',
                    component: FacturaProveedorFormularioComponentPub,
                    canActivate: [AuthGuardService]
                  }
                ]
  }
];
