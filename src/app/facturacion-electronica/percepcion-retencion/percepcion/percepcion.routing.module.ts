import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PercepcionComponent} from './percepcion.component';
import {PercepcionCrearComponent} from './percepcion-crear/percepcion-crear.component';
import {PercepcionItemCrearComponent} from './percepcion-item-crear/percepcion-item-crear.component';
import {PercepcionVistaPreviaComponent} from './percepcion-vista-previa/percepcion-vista-previa.component';
import {EmisionComprobanteComponent} from '../../general/emision-comprobante/emision-comprobante.component';

const routes: Routes = [
  {
    path: '',
    component: PercepcionComponent,
    children: [
      {
        path: '', pathMatch: 'full', redirectTo: 'crear'
      },
      {
        path: 'crear',
        component: PercepcionCrearComponent,
        data: {
          mostrarCombo: true,
          codigo: '40'
        }
      },
      {
        path: 'crear/agregar-item',
        component: PercepcionItemCrearComponent,
        data: {
          mostrarCombo: false,
          codigo: '40',
          esEditable: false
        }
      },
      {
        path: 'crear/editar-item/:id',
        component: PercepcionItemCrearComponent,
        data: {
          mostrarCombo: false,
          codigo: '40',
          esEditable: true
        }
      } ,
      {
        path: 'crear/vista-previa',
        component: PercepcionVistaPreviaComponent,
        data: {
          codigo: '40',
          mostrarCombo: false
        }
      },
      {
        path: 'emision/:id',
        component: EmisionComprobanteComponent,
        data: {
          codigo: '40',
          mostrarCombo: false,
          titulo: 'percepcionElectronica'
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

export class PercepcionRoutingModule {}
