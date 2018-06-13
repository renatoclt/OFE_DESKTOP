import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComprobantesComponent} from './comprobantes.component';
import { ConsultaComponent } from '../general/consulta/consulta.component';
import { ComprobanteVistaPreviaComponent } from './comprobante-vista-previa/comprobante-vista-previa.component';
import { BoletaFacturanVisualizarComponent } from 'app/facturacion-electronica/comprobantes/comprobantes-visualizar/comprobante-visualizar-boleta-factura/comprobante-visualizar-boleta-factura.component';
import {ComprobanteVisualizarNotaCreditoDebitoComponent} from './comprobantes-visualizar/comprobante-visualizar-nota-credito-debito/comprobante-visualizar-nota-credito-debito.component';


const routes: Routes = [
  {
    path: '',
    component: ComprobantesComponent,
    children: [
      {
        path: '', pathMatch: 'full', redirectTo: 'factura'
      },
      {
        path: 'factura',
        loadChildren: '../comprobantes/factura/factura.module#FacturaModule'
      },
      {
        path: 'boleta',
        loadChildren: './boleta/boleta.module#BoletaModule'
      },
      {
        path: 'notaCredito',
        loadChildren: './nota-credito/nota-credito.module#NotaCreditoModule'
      },
      {
        path: 'notaDebito',
        loadChildren: './nota-debito/nota-debito.module#NotaDebitoModule'
      }
    ]
  },
  {
    path: 'consultar',
    component: ConsultaComponent,
    data: {
      titulo: 'consultarComprobante',
      tipoConsulta: 1
    }
    /*,
    children: [
      {
        path: 'vistaprevia',
        component: ComprobanteVistaPreviaComponent
      }
    ]*/
  },
  {
    path: 'consultar/vistaprevia/:id',
    component: ComprobanteVistaPreviaComponent,
    data: {
      tipoAccion: 1
    }
  },
  {
    path: 'consultar/visualizar/factura/:id',
    component: BoletaFacturanVisualizarComponent,
    data: {
      tipoComprobante: 1
    }
  },
  {
    path: 'consultar/visualizar/boleta/:id',
    component: BoletaFacturanVisualizarComponent,
    data: {
      tipoComprobante: 2
    }
  },
  {
    path: 'consultar/visualizar/notaCredito/:id',
    component: ComprobanteVisualizarNotaCreditoDebitoComponent,
    data: {
      tipoComprobante: '07'
    }
  },
  {
    path: 'consultar/visualizar/notaDebito/:id',
    component: ComprobanteVisualizarNotaCreditoDebitoComponent,
    data: {
      tipoComprobante: '08'
    }
  },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
})

export class ComprobantesRoutingModule {}
