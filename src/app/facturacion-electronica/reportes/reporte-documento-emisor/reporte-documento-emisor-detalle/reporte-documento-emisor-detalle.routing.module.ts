import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ReporteDocumentoEmisorDetalleComponent} from './reporte-documento-emisor-detalle.component';

const routes: Routes = [
  {
    path: '',
    component: ReporteDocumentoEmisorDetalleComponent
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

export class ReporteDocumentoEmisorDetalleRoutingModule { }
