import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotaCreditoComponent} from './nota-credito.component';
import {EmisionComprobanteComponent} from '../../general/emision-comprobante/emision-comprobante.component';
import {VistaPreviaNotaCreditoComponent} from './vista-previa-nota-credito/vista-previa-nota-credito.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', pathMatch: 'full', redirectTo: 'crear'
      },
      {
        path: 'crear',
        component: NotaCreditoComponent,
        data: {
          codigo: '07',
          mostrarCombo: true
        }
      },
      {
        path: 'crear/vistaPrevia',
        component: VistaPreviaNotaCreditoComponent,
        data: {
          codigo: '07',
          mostrarCombo: false,
          titulo: 'notaCreditoElectronica'
        }
      },
      {
        path: 'emision/:id',
        component: EmisionComprobanteComponent,
        data: {
          codigo: '07',
          mostrarCombo: false,
          titulo: 'emisionNotaCredito'
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

export class NotaCreditoRoutingModule {}
