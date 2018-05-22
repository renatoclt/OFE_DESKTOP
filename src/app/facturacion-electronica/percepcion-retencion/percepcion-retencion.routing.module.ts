import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PercepcionRetencionComponent} from './percepcion-retencion.component';
import { ConsultaComponent } from '../general/consulta/consulta.component';
import { PercepcionRetencionVisualizarComponent } from './percepcion-retencion-visualizar/percepcion-retencion-visualizar.component';

const routes: Routes = [
  {
    path: '',
    component: PercepcionRetencionComponent,
    children: [
      {
        path: '', pathMatch: 'full', redirectTo: 'retencion'
      },
      {
        path: 'retencion',
        loadChildren: '../percepcion-retencion/retencion/retencion.module#RetencionModule'
      },
      {
        path: 'percepcion',
        loadChildren: '../percepcion-retencion/percepcion/percepcion.module#PercepcionModule'
      }
    ]
  },
  {
    path: 'consultar',
    component: ConsultaComponent,
    data: {
      titulo: 'consultaPercepcionRetencion',
      tipoConsulta: 2
    }
  },
  {
    path: 'consultar/visualizar',
    component: PercepcionRetencionVisualizarComponent,
    data: {
      titulo: 'visualizarConsultaRetencion',
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class PercepcionRetencionRoutingModule {}
