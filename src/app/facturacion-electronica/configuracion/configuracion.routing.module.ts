import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConfiguracionComponent} from './configuracion.component';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracionComponent,
    children: [
      {
        path: '', pathMatch: 'full', redirectTo: 'configuracion'
      },
      {
        path: 'mi-cuenta',
        loadChildren: '../configuracion/mi-cuenta/mi-cuenta.module#MiCuentaModule'
      },
      {
        path: 'empresa-emisora',
        loadChildren: '../configuracion/empresa-emisora/empresa-emisora.module#EmpresaEmisoraModule'
      },
      {
        path: 'series',
        loadChildren: '../configuracion/series/series.module#SeriesModule'
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

export class ConfiguracionRoutingModule {}
