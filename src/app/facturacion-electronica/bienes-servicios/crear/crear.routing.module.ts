import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CrearComponent} from './crear.component';
import {BienesServiciosIndividualComponent} from './bienes-servicios-individual/bienes-servicios-individual.component';
import {BienesServiciosMasivaComponent} from './bienes-servicios-masiva/bienes-servicios-masiva.component';
import {BienesServiciosMasivaDetalleComponent} from './bienes-servicios-masiva/bienes-servicios-masiva-detalle/bienes-servicios-masiva-detalle.component';

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
          {
            path: 'masiva/detalle/:id',
            component: BienesServiciosMasivaDetalleComponent,
            data: {
              id: 'BienesServiciosMasivaDetalleComponent'
            }
          }
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
