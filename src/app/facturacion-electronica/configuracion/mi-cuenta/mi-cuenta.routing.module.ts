import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MiCuentaComponent} from './mi-cuenta.component';


const routes: Routes = [
  {
    path: '',
    component: MiCuentaComponent,
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

export class MiCuentaRoutingModule {}
