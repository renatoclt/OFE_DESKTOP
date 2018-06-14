import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FacturaComponent} from './factura.component';
import {ItemComponent} from '../item/item.component';
import {ComprobanteVistaPreviaComponent} from '../comprobante-vista-previa/comprobante-vista-previa.component';
import {ComprobanteItemComponent} from '../comprobante-item/comprobante-item.component';
import {ConsultaComponent} from '../../general/consulta/consulta.component';
import {ComprobanteDocumentoRelacionadoComponent} from '../comprobante-documento-relacionado/comprobante-documento-relacionado.component';
import { ComprobanteEmitirComponent } from '../comprobante-emitir/comprobante-emitir.component';
import { ComprobanteEditarBaseComponent } from '../comprobante-item/comprobante-editar-base.component';
import { EmisionComprobanteComponent } from 'app/facturacion-electronica/general/emision-comprobante/emision-comprobante.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', pathMatch: 'full', redirectTo: 'crear'
      },
      {
        path: 'crear',
        component: FacturaComponent,
        data: {
          codigo: '01',
          mostrarCombo: true
        }
      },
      // {
      //   path: 'emitir/:id',
      //   component: ComprobanteEmitirComponent,
      //   data: {
      //     codigo: '01',
      //     tipoDocumento: '01',
      //     titulo: 'Factura',
      //     mostrarCombo: false
      //   }
      // },
      {
        path: 'emitir/:id',
        component: EmisionComprobanteComponent,
        data: {
          codigo: '01',
          mostrarCombo: false,
          titulo: 'Factura Emitida'
        }
      },
      {
        path: 'crear/vistaprevia',
        component: ComprobanteVistaPreviaComponent,
        data: {
          codigo: '01',
          tipoDocumento: '01',
          titulo: 'Factura',
          mostrarCombo: false
        }
      },
      {
        path: 'crear/servicio/agregar',
        component: ComprobanteItemComponent,
        data: {
          codigo: '01',
          tipoAccion: 1,
          tipoDocumento: '01',
          mostrarCombo: false,
          tipoItem: 'S'
        }
      },
      {
        path: 'crear/servicio/editar',
        component: ComprobanteItemComponent,
        data: {
          codigo: '01',
          tipoAccion: 2,
          tipoDocumento: '01',
          mostrarCombo: false,
          tipoItem: 'S'
        }
      },
      {
        path: 'crear/bien/agregar',
        component: ComprobanteItemComponent,
        data: {
          codigo: '01',
          tipoAccion: 3,
          tipoDocumento: '01',
          mostrarCombo: false,
          tipoItem: 'B'
        }
      },
      {
        path: 'crear/bien/editar',
        component: ComprobanteItemComponent,
        data: {
          codigo: '01',
          tipoAccion: 4,
          tipoDocumento: '01',
          mostrarCombo: false,
          tipoItem: 'B'
        }
      },
      {
        path: 'crear/docRelacionado/buscar',
        component: ConsultaComponent,
        data: {
          codigo: '01',
          tipoConsulta: 9,
          titulo: 'consultaDocumentoRelacionadoFactura',
          mostrarCombo: false
        }
      },
      {
        path: 'crear/docRelacionado',
        component: ComprobanteDocumentoRelacionadoComponent,
        data: {
          codigo: '01',
          tipoDocumento: '01',
          mostrarCombo: false
        }
      },
      {
        path: 'editarProducto/:id',
        component: ComprobanteEditarBaseComponent
      },
      {
        path: ':tipoItem',
        component: ItemComponent
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

export class FacturaRoutingModule {}
