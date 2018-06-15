import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RetencionComponent} from './retencion.component';
import {RetencionUnitariaComponent} from './retencion-unitaria/retencion-unitaria.component';
import {ItemCrearEditarComponent} from '../item-crear-editar/item-crear-editar.component';
import {RetencionMasivaComponent} from './retencion-masiva/retencion-masiva.component';
import {RetencionMasivaDetalleComponent} from '../retencion-masiva-detalle/retencion-masiva-detalle.component';
import {VistapreviaRetencionComponent} from '../vistaprevia-retencion/vistaprevia-retencion.component';
import {EmisionPercepcionRetencionComponent} from '../emision-percepcion-retencion/emision-percepcion-retencion.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', pathMatch: 'full', redirectTo: 'crear'
      },
      {
        path: 'crear',
        component: RetencionComponent,
        children: [
          {
            path: '', pathMatch: 'full', redirectTo: 'individual'
          },
          {
            path: 'individual',
            component: RetencionUnitariaComponent,
            data: {
              mostrarCombo: true,
              codigo: '20',
              id: 'RetencionUnitariaComponent'
            }
          },
          {
            path: 'masiva',
            component: RetencionMasivaComponent,
            data: {
              mostrarCombo: true,
              codigo: '20',
              id: 'RetencionUnitariaComponent'
            }
          },
        ]
      },
      {
        path: 'crear/individual/agregar-item',
        component: ItemCrearEditarComponent,
        data: {
          mostrarCombo: false,
          tipoaccion: 1,
          codigo: '20',
          titulo: 'agregarItem'
        }
      },
      {
        path: 'crear/individual/editar-item/:id',
        component: ItemCrearEditarComponent,
        data: {
          mostrarCombo: false,
          tipoaccion: 2,
          codigo: '20',
          titulo: 'editarItem',
          button: 'guardar'
        }
      },
      {
        path: 'masiva/detalle/:id',
        component: RetencionMasivaDetalleComponent,
        data: {
          mostrarCombo: false,
          tipoaccion: 1,
          codigo: '20',
          titulo: 'detalleRetencionMasiva'
        }
      },
      {
        path: 'crear/individual/vista-previa',
        component: VistapreviaRetencionComponent,
        data: {
          mostrarCombo: false,
          codigo: '20',
        }
      },
      {
        path: 'crear/individual/emision/:id',
        component: EmisionPercepcionRetencionComponent,
        data: {
          mostrarCombo: false,
          codigo: '20',
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

export class RetencionRoutingModule {}
