import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConsultarBienesServiciosComponent} from './consultar-bienes-servicios.component';
import {BienesServiciosIndividualComponent} from '../crear/bienes-servicios-individual/bienes-servicios-individual.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ConsultarBienesServiciosComponent
      },
      {
        path: 'editar/:id',
        component: BienesServiciosIndividualComponent,
        data: {
          esEditable: true
        }
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

export class ConsultarBienesServiciosRoutingModule {}
