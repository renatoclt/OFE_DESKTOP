import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CrearComponent} from './crear.component';
import {BienesServiciosIndividualComponent} from './bienes-servicios-individual/bienes-servicios-individual.component';
import {BienesServiciosMasivaComponent} from './bienes-servicios-masiva/bienes-servicios-masiva.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', pathMatch: 'full', redirectTo: 'crear'
      },
      {
        path: '',
        component: CrearComponent,
        children: [
          {
            path: '', pathMatch: 'full', redirectTo: 'individual'
          },
          {
            path: 'individual',
            component: BienesServiciosIndividualComponent,
            data: {
              id: 'BienesServiciosIndividualComponent',
              esEditable: false
            }
          },
          {
            path: 'masiva',
            component: BienesServiciosMasivaComponent,
            data: {
              id: 'BienesServiciosMasivaComponent'
            }
          },
        ]
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

export class CrearRoutingModule {}
