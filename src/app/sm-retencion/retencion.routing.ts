import { Routes } from '@angular/router';

import { RetencionCompradorBuscarComponent } from './comprador/buscar/retencioncompradorbuscar.component';
import { RetencionCompradorFormularioComponent} from './comprador/formulario/retencioncompradorformulario.component';
import { RetencionProveedorBuscarComponent } from './proveedor/buscar/retencionproveedorbuscar.component';
import { RetencionProveedorFormularioComponent} from './proveedor/formulario/retencionproveedorformulario.component';

export const RetencionRoutes: Routes = [
  {

    path: '',
    children: [
      {
        path: 'comprador/buscar',
        component: RetencionCompradorBuscarComponent
      },

      {
        path: 'comprador/formulario/:id',
        component: RetencionCompradorFormularioComponent
      },
      {
        path: 'proveedor/buscar',
        component: RetencionProveedorBuscarComponent
      },

      {
        path: 'proveedor/formulario/:id',
        component: RetencionProveedorFormularioComponent
      },
    ]
  }
];
