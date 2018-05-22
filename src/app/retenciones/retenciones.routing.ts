import {Routes} from '@angular/router';

import {RetencionesCompradorBuscarComponent} from './comprador/buscar/retencionescompradorbuscar.component';
import {RetencionesCompradorFormularioComponent} from './comprador/formulario/retencionescompradorformulario.component';
import {RetencionesProveedorBuscarComponent} from './proveedor/buscar/retencionesproveedorbuscar.component';
import {RetencionesProveedorFormularioComponent} from './proveedor/formulario/retencionesproveedorformulario.component';

export const RetencionesRoutes: Routes = [
  {

    path: '',
    children: [
      {
        path: 'comprador/buscar',
        component: RetencionesCompradorBuscarComponent
      },

      {
        path: 'comprador/formulario/:id',
        component: RetencionesCompradorFormularioComponent
      },
      {
        path: 'proveedor/buscar',
        component: RetencionesProveedorBuscarComponent
      },

      {
        path: 'proveedor/formulario/:id',
        component: RetencionesProveedorFormularioComponent
      },
    ]
  }
];
