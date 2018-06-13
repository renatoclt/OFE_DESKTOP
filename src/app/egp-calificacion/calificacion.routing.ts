import { Routes } from '@angular/router';

import { CalificacionProveedorBuscarComponent } from './proveedor/buscar/calificacionproveedorbuscar.component';
import { CalificacionProveedorFormularioComponent} from './proveedor/formulario/calificacionproveedorformulario.component';
import { CalificacionProveedorCalificarComponent} from './proveedor/calificar/calificacionproveedorcalificar.component';
import { CalificacionProveedorDetalleCalificacionComponent} from './proveedor/detallecalificacion/calificacionproveedordetallecalificacion.component';

export const CalificacionRoutes: Routes = [
  {

    path: '',
    children: [
      {
        path: 'proveedor/buscar',
        component: CalificacionProveedorBuscarComponent
      },

      {
        path: 'proveedor/formulario/:id',
        component: CalificacionProveedorFormularioComponent
      },
      {
        path: 'proveedor/calificar/:id',
        component: CalificacionProveedorCalificarComponent
      },
      {
        path: 'proveedor/detallecalificacion/:id',
        component: CalificacionProveedorDetalleCalificacionComponent
      },
    ]
  }
];
