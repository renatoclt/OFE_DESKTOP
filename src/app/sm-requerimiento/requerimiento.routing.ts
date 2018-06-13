import { Routes } from '@angular/router';


import { RequerimientoCompradorBuscarComponent } from './comprador/buscar/requerimientocompradorbuscar.component';
import { RequerimientoCompradorFormularioComponent } from './comprador/formulario/requerimientocompradorformulario.component';

import { RequerimientoProveedorBuscarComponent } from './proveedor/buscar/requerimientoproveedorbuscar.component';
import { RequerimientoProveedorFormularioComponent } from './proveedor/formulario/requerimientoproveedorformulario.component';


export const RequerimientoRoutes: Routes = [
  {

    path: '',
    children: [
      {
        path: 'comprador/buscar',
        component: RequerimientoCompradorBuscarComponent
      },

      {
        path: 'comprador/formulario/:id',
        component: RequerimientoCompradorFormularioComponent
      },

      {
        path: 'proveedor/buscar',
        component: RequerimientoProveedorBuscarComponent
      },
      {
        path: 'proveedor/formulario/:id',
        component: RequerimientoProveedorFormularioComponent
      },
     
    ]
  }
];
