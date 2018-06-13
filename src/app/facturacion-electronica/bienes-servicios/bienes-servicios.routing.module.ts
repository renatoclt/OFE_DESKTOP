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
        loadChildren: '../bienes-servicios/crear/crear.module#CrearModule'
      }// ,
      // {
      //   path: 'consultar',
      //   loadChildren: '../configuracion/empresa-emisora/consulta.module#ConsultaModule',
      // }
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
