import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PercepcionVistaPreviaComponent } from './percepcion-vista-previa.component';
import {DataTableModule} from '../../../general/data-table/data-table.module';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DirectivasModule} from '../../../general/directivas/directivas.module';
import {TranslateModule} from '@ngx-translate/core';
import {HttpModule} from '@angular/http';
import {CreacionComprobantes} from '../../../general/services/comprobantes/creacionComprobantes';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DirectivasModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    DataTableModule,
    TranslateModule,
  ],
  declarations: [
    PercepcionVistaPreviaComponent
  ],
  exports: [
    PercepcionVistaPreviaComponent
  ],
  providers: [
    CreacionComprobantes
  ]
})
export class PercepcionVistaPreviaModule { }
