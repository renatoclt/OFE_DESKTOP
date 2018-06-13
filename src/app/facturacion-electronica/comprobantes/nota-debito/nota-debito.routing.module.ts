import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmisionComprobanteComponent} from '../../general/emision-comprobante/emision-comprobante.component';
import {VistaPreviaNotaDebitoComponent} from './vista-previa-nota-debito/vista-previa-nota-debito.component';
import {NotaDebitoComponent} from './nota-debito.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', pathMatch: 'full', redirectTo: 'crear'
      },
      {
        path: 'crear',
        component: NotaDebitoComponent,
        data: {
          codigo: '08',
          mostrarCombo: true
        }
      },
      {
        path: 'crear/vistaPrevia',
        component: VistaPreviaNotaDebitoComponent,
        data: {
          codigo: '08',
          mostrarCombo: false,
          titulo: 'notaDebitoElectronica'
        }
      },
      {
        path: 'emision/:id',
        component: EmisionComprobanteComponent,
        data: {
          codigo: '08',
          mostrarCombo: false,
          titulo: 'emisionNotaDebito'
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

export class NotaDebitoRoutingModule {}
