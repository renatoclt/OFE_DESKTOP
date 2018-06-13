import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ResumenBajasCrearComponent} from './resumen-bajas-crear/resumen-bajas-crear.component';
import {ResumenBajasListarComponent} from './resumen-bajas-listar/resumen-bajas-listar.component';
import {ResumenBajasComponent} from './resumen-bajas.component';
import { AuthGuardService } from 'app/service/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: ResumenBajasComponent,
    children: [
      {
        path: 'crear',
        component: ResumenBajasCrearComponent
      },
      {
        path: 'consultar',
        component: ResumenBajasListarComponent
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

export class ResumenBajasRoutingModule {}
