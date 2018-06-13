import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'documentoPorEmisor'
  },
  {
    path: 'documentoPorEmisor',
    loadChildren: './reporte-documento-emisor/reporte-documento-emisor.module#ReporteDocumentoEmisorModule'
  }

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
})

export class ReportesRoutingModule {}
