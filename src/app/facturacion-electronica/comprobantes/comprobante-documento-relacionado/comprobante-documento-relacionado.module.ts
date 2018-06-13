import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ComprobanteDocumentoRelacionadoComponent} from './comprobante-documento-relacionado.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { DataTableModule } from '../../general/data-table/data-table.module';
import {TranslateModule} from '@ngx-translate/core';
import { DirectivasModule } from 'app/facturacion-electronica/general/directivas/directivas.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataTableModule,
    TranslateModule,
    DirectivasModule,
    FormsModule
  ],
  declarations: [
    ComprobanteDocumentoRelacionadoComponent
  ],
  exports: [
    ComprobanteDocumentoRelacionadoComponent
  ]
})
export class ComprobanteDocumentoRelacionadoModule { }
