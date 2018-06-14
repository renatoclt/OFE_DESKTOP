import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BoletaComponent} from './boleta.component';
import {ComprobanteVistaPreviaComponent} from '../comprobante-vista-previa/comprobante-vista-previa.component';
import {ComprobanteItemComponent} from '../comprobante-item/comprobante-item.component';
import {ConsultaComponent} from '../../general/consulta/consulta.component';
import {ComprobanteDocumentoRelacionadoComponent} from '../comprobante-documento-relacionado/comprobante-documento-relacionado.component';
import { ComprobanteEmitirComponent } from '../comprobante-emitir/comprobante-emitir.component';
import {EmisionComprobanteComponent} from '../../general/emision-comprobante/emision-comprobante.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', pathMatch: 'full', redirectTo: 'crear'
      },
      {
        path: 'crear',
        component: BoletaComponent,
        data: {
          codigo: '03',
          mostrarCombo: true
        }
      },
      {
        path: 'crear/docRelacionado',
        component: ComprobanteDocumentoRelacionadoComponent,
        data: {
          codigo: '03',
          tipoDocumento: '03',
          mostrarCombo: false
        }
      },
      {
        path: 'crear/docRelacionado/buscar',
        component: ConsultaComponent,
        data: {
          codigo: '03',
          tipoConsulta: 10,
          titulo: 'consultaDocumentoRelacionadoBoleta',
          mostrarCombo: false
        }
      },

      {
        path: 'crear/servicio/agregar',
        component: ComprobanteItemComponent,
        data: {
          codigo: '03',
          tipoAccion: 1,
          tipoDocumento: '03',
          mostrarCombo: true,
          tipoItem: 'S'
        }
      },
      {
        path: 'crear/servicio/editar',
        component: ComprobanteItemComponent,
        data: {
          codigo: '03',
          tipoAccion: 2,
          tipoDocumento: '03',
          mostrarCombo: false,
          tipoItem: 'S'
        }
      },
      {
        path: 'crear/bien/agregar',
        component: ComprobanteItemComponent,
        data: {
          codigo: '03',
          tipoAccion: 3,
          tipoDocumento: '03',
          mostrarCombo: false,
          tipoItem: 'B'
        }
      },
      {
        path: 'crear/bien/editar',
        component: ComprobanteItemComponent,
        data: {
          codigo: '03',
          tipoAccion: 4,
          tipoDocumento: '03',
          mostrarCombo: false,
          tipoItem: 'B'
        }
      },

      {
        path: 'crear/vistaprevia',
        component: ComprobanteVistaPreviaComponent,
        data: {
          tipoDocumento: '03',
          titulo: 'Boleta'
        }
      },

      // {
      //   path: 'emitir/:id',
      //   component: ComprobanteEmitirComponent,
      //   data: {
      //     codigo: '03',
      //     tipoDocumento: '03',
      //     titulo: 'Boleta',
      //     mostrarCombo: false
      //   }
      // },
      {
        path: 'emitir/:id',
        component: EmisionComprobanteComponent,
        data: {
          codigo: '03',
          mostrarCombo: false,
          titulo: 'Factura Emitida'
        }
      },
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

export class BoletaRoutingModule {}
