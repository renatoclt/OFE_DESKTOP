import { Routes } from '@angular/router';



import { FacturaProveedorBuscarComponent } from './proveedor/buscar/facturaproveedorbuscar.component';
import {FacturaProveedorFormularioComponent} from "./proveedor/formulario/facturaproveedorformulario.component";
import {FacturaCompradorFormularioComponent} from "./comprador/formulario/facturacompradorformulario.component";
import {FacturaCompradorBuscarComponent} from "./comprador/buscar/facturacompradorbuscar.component";
import {AuthGuardService} from "app/service/auth-guard.service";


export const FacturaRoutes: Routes = [
  {
    path: '',
    children: [{
                  path: 'proveedor/formulario/:id',
                  component: FacturaProveedorFormularioComponent,
                  canActivate: [AuthGuardService]
               },
               {
                  path: 'proveedor/buscar',
                  component: FacturaProveedorBuscarComponent,
                  canActivate: [AuthGuardService]
               },
               {
                  path: 'comprador/buscar',
                  component: FacturaCompradorBuscarComponent,
                  canActivate: [AuthGuardService]
               },
               {
                  path: 'comprador/formulario/:id',
                  component: FacturaCompradorFormularioComponent,
                  canActivate: [AuthGuardService]
               }]
  }
];
