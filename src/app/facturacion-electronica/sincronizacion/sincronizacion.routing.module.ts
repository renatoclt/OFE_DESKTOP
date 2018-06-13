import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SincronizacionComponent } from './sincronizacion.component';
import { BitacoraComponent } from './sincronizacion-bitacora/sincronizacion-bitacora.component';

const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: '', pathMatch: 'full', redirectTo: 'sincronizar'
        },
        {
          path: 'sincronizar',
          component: SincronizacionComponent
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
  
  export class SincronizacionRoutingModule {}