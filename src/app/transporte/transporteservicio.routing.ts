import { Routes } from '@angular/router';

import { TransporteServicioCompradorBuscarComponent } from './comprador/buscar/transporteserviciocompradorbuscar.component';
import { TransporteServicioCompradorFormularioComponent} from './comprador/formulario/transporteserviciocompradorformulario.component';
import { TransporteServicioProveedorBuscarComponent } from './proveedor/buscar/transporteservicioproveedorbuscar.component';
import { TransporteServicioProveedorFormularioComponent} from './proveedor/formulario/transporteservicioproveedorformulario.component';
import { AuthGuardService } from '../service/auth-guard.service';

export const TransporteServicioRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'refrescar',
        component: TransporteServicioCompradorBuscarComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'comprador/buscar',
        component: TransporteServicioCompradorBuscarComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'comprador/formulario/:id',
        component: TransporteServicioCompradorFormularioComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'proveedor/buscar',
        component: TransporteServicioProveedorBuscarComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'proveedor/formulario/:id',
        component: TransporteServicioProveedorFormularioComponent,
        canActivate: [AuthGuardService]
      },
    ]
  }
];
