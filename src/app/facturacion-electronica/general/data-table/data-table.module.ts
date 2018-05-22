import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataTableComponent} from './data-table.component';
import {FormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {BasePaginacion} from '../services/base.paginacion';
import {DataTableServicio} from './servicios/dataTableServicio';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    TranslateModule
  ],
  declarations: [
    DataTableComponent
  ],
  exports: [
    DataTableComponent
  ],
  providers: [
    BasePaginacion,
    DataTableServicio
  ]
})
export class DataTableModule { }
