import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BitacoraComponent } from './sincronizacion-bitacora.component';

const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: '', pathMatch: 'full', redirectTo: 'sincronizar'
        },
        {
          path: 'bitacora',
          component: BitacoraComponent
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
  
  export class BitacoraRoutingModule {}