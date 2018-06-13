import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ReporteDocumentoEmisorComponent} from './reporte-documento-emisor.component';

const routes: Routes = [
  {
    path: '',
    component: ReporteDocumentoEmisorComponent
  },
  {
    path: 'detalle',
    loadChildren: './reporte-documento-emisor-detalle/reporte-documento-emisor-detalle.module#ReporteDocumentoEmisorDetalleModule'
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

export class ReporteDocumentoEmisorRoutingModule { }
