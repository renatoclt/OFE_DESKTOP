
import { Routes, RouterModule } from '@angular/router';
import { ConsultaClienteComponent } from 'app/cliente/consulta-cliente.component';
import { VisualizarComprobanteClienteComponent } from 'app/cliente/comprobantes-visualizar/visualizar-comprobante-cliente.component';

export const ConsultaRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'consultacliente',
        component: ConsultaClienteComponent
      },
      {
        path: 'consultacliente/visualizar',
        component: VisualizarComprobanteClienteComponent
      }
    ]
  }
];
