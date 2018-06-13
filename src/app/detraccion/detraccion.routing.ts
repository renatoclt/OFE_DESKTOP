import {Routes} from '@angular/router';

import {DetraccionCompradorBuscarComponent} from './comprador/buscar/detraccioncompradorbuscar.component';
import {DetraccionCompradorFormularioComponent} from './comprador/formulario/detraccioncompradorformulario.component';
import {DetraccionProveedorBuscarComponent} from './proveedor/buscar/detraccionproveedorbuscar.component';
import {DetraccionProveedorFormularioComponent} from './proveedor/formulario/detraccionproveedorformulario.component';

export const DetraccionesRoutes: Routes = [
  {

    path: '',
    children: [
      {
        path: 'comprador/buscar',
        component: DetraccionCompradorBuscarComponent
      },

      {
        path: 'comprador/formulario/:id',
        component: DetraccionCompradorFormularioComponent
      },
      {
        path: 'proveedor/buscar',
        component: DetraccionProveedorBuscarComponent
      },

      {
        path: 'proveedor/formulario/:id',
        component: DetraccionProveedorFormularioComponent
      },
    ]
  }
];
