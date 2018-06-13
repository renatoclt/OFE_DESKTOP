import { Routes } from '@angular/router';


import { CotizacionCompradorFormularioComponent } from './comprador/formulario/cotizacioncompradorformulario.component';
import { CotizacionCompradorBuscarComponent } from './comprador/buscar/cotizacioncompradorbuscar.component';
import { CotizacionProveedorFormularioComponent } from './proveedor/formulario/cotizacionproveedorformulario.component';
import { CotizacionProveedorBuscarComponent } from './proveedor/buscar/cotizacionproveedorbuscar.component';
import { CotizacionesEvaluarComponent } from './comprador/evaluar/cotizacionesevaluar.component';

export const CotizacionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'comprador/formulario/:id',
        component: CotizacionCompradorFormularioComponent
      },
      {
        path: 'comprador/buscar',
        component: CotizacionCompradorBuscarComponent
      },

      {
        path: 'comprador/evaluar',
        component: CotizacionesEvaluarComponent
      },

      {
        path: 'proveedor/formulario/:id',
        component: CotizacionProveedorFormularioComponent
      },
      {
        path: 'proveedor/buscar',
        component: CotizacionProveedorBuscarComponent
      }
    ]
  }
];
