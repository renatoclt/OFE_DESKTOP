import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoNotaDebitoDatatableComponent } from './tipo-nota-debito-datatable.component';
import {TranslateModule} from '@ngx-translate/core';
import {DataTableModule} from '../../../general/data-table/data-table.module';
import {TipoNotaDebitoEditarItemModule} from '../tipo-nota-debito-editar-item/tipo-nota-debito-editar-item.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DataTableModule,
    TipoNotaDebitoEditarItemModule
  ],
  declarations: [
    TipoNotaDebitoDatatableComponent
  ],
  exports: [
    TipoNotaDebitoDatatableComponent
  ],
  providers: []
})
export class TipoNotaDebitoDatatableModule { }
