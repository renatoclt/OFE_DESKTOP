import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PercepcionCrearComponent} from './percepcion-crear.component';
import {PercepcionItemCrearModule} from '../percepcion-item-crear/percepcion-item-crear.module';
import {EntidadService} from '../../../general/services/organizacion/entidad.service';
import {SeriesService} from '../../../general/services/configuracionDocumento/series.service';
import {TiposService} from '../../../general/utils/tipos.service';
import {TablaMaestraService} from '../../../general/services/documento/tablaMaestra.service';
import {HttpClientModule} from '@angular/common/http';
import {EstilosServices} from '../../../general/utils/estilos.services';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DirectivasModule} from '../../../general/directivas/directivas.module';
import {A2Edatetimepicker} from '../../../../directives/datepicker.module';
import {TranslateModule} from '@ngx-translate/core';
import {DataTableModule} from '../../../general/data-table/data-table.module';
import {Ng2AutoCompleteModule} from 'ng2-auto-complete';
import {CatalogoDocumentoIdentidadService} from '../../../general/utils/catalogo-documento-identidad.service';
import {PersistenciaDatosService} from '../../../general/services/utils/persistenciaDatos.service';
import {UtilsService} from '../../../general/utils/utils.service';
import {ManejoMensajes} from '../../../general/utils/manejo-mensajes';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    PercepcionItemCrearModule,
    TranslateModule,
    FormsModule,
    A2Edatetimepicker,
    DirectivasModule,
    DataTableModule,
    Ng2AutoCompleteModule
  ],
  declarations: [
    PercepcionCrearComponent
  ],
  exports: [
    PercepcionCrearComponent
  ],
  providers: [
    EntidadService,
    SeriesService,
    TiposService,
    EstilosServices,
    TablaMaestraService,
    CatalogoDocumentoIdentidadService,
    PersistenciaDatosService,
    UtilsService,
    ManejoMensajes
  ]
})
export class PercepcionCrearModule { }
