import {NgModule} from '@angular/core';
import {TablaMaestraService} from '../../general/services/documento/tablaMaestra.service';
import {ResumenBajasListarComponent} from './resumen-bajas-listar.component';
import {TiposService} from '../../general/utils/tipos.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DirectivasModule} from '../../general/directivas/directivas.module';
import {Servidores} from '../../general/services/servidores';
import {TranslateModule} from '@ngx-translate/core';
import {HttpModule} from '@angular/http';
import {DataTableModule} from '../../general/data-table/data-table.module';
import {ComprobantesService} from '../../general/services/comprobantes/comprobantes.service';
import {HttpClientModule} from '@angular/common/http';
import {A2Edatetimepicker} from '../../../directives/datepicker.module';
import {EstadoDocumentoService} from '../../general/services/documento/estadoDocumento.service';
import {EstilosServices} from '../../general/utils/estilos.services';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    HttpClientModule,
    A2Edatetimepicker,
    DataTableModule,
    TranslateModule,
    DirectivasModule
  ],
  declarations: [
    ResumenBajasListarComponent
  ],
  providers: [
    TablaMaestraService,
    ComprobantesService,
    Servidores,
    TiposService,
    EstadoDocumentoService,
    EstilosServices
  ],
  exports: [
    ResumenBajasListarComponent
  ]
})

export class ResumenBajasListarModule { }
