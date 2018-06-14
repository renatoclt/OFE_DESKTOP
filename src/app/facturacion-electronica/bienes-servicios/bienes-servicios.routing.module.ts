import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BienesServiciosComponent} from './bienes-servicios.component';

const routes: Routes = [
  {
    path: '',
    component: BienesServiciosComponent,
    children: [
      {
        path: '', pathMatch: 'full', redirectTo: 'bienes-servicios'
      },
      {
        path: 'crear',
        loadChildren: './crear/crear.module#CrearModule'
      },
      {
        path: 'consultar',
        loadChildren: './consultar-bienes-servicios/consultar-bienes-servicios.module#ConsultarBienesServiciosModule',
      }
    ]
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

export class BienesServiciosRoutingModule {}
