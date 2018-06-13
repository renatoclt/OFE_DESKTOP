import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoNotaCreditoDatatableComponent } from './tipo-nota-credito-datatable.component';
import {TranslateModule} from '@ngx-translate/core';
import {DataTableModule} from '../../../general/data-table/data-table.module';
import {TipoNotaCreditoEditarItemModule} from '../tipo-nota-credito-editar-item/tipo-nota-credito-editar-item.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DataTableModule,
    TipoNotaCreditoEditarItemModule
  ],
  declarations: [
    TipoNotaCreditoDatatableComponent
  ],
  exports: [
    TipoNotaCreditoDatatableComponent
  ],
  providers: []
})
export class TipoNotaCreditoDatatableModule { }
