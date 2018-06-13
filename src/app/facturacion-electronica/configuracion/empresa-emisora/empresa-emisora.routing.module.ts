import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmpresaEmisoraComponent} from './empresa-emisora.component';
import {SeriesComponent} from '../series/series.component';


const routes: Routes = [
  {
    path: '',
    component: EmpresaEmisoraComponent,
  },
  {
    path: 'series/:id',
    component: SeriesComponent,
    data: {
      titulo: 'editarItem',
      button: 'guardar'
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

export class EmpresaEmisoraRoutingModule {}
