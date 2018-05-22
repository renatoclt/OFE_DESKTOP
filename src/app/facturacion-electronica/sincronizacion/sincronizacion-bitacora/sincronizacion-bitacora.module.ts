import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SincronizacionService } from '../../general/services/sincronizacion/sincronizacion.service';
import { BitacoraComponent } from './sincronizacion-bitacora.component';
import { BitacoraRoutingModule  } from './sincronizacion-bitacora.routing.module';
import { DataTableModule } from '../../general/data-table/data-table.module';
import { ReactiveFormsModule } from '@angular/forms';
import {A2Edatetimepicker} from '../../../directives/datepicker.module';
import { EstadoDocumentoService  } from '../../general/services/documento/estadoDocumento.service';
import {TiposService} from '../../general/utils/tipos.service';

@NgModule({
    imports: [
      CommonModule,
      TranslateModule,
      BitacoraRoutingModule,
      DataTableModule,
      ReactiveFormsModule,
      A2Edatetimepicker
    ],
    declarations: [
        BitacoraComponent
    ],
    providers: [
      SincronizacionService,
      EstadoDocumentoService,
      TiposService
    ]
  })
  export class BitacoraModule { }