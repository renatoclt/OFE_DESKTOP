import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PercepcionItemCrearComponent } from './percepcion-item-crear.component';
import {HttpClientModule} from '@angular/common/http';
import {A2Edatetimepicker} from '../../../../directives/datepicker.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DirectivasModule} from '../../../general/directivas/directivas.module';
import {TranslateModule} from '@ngx-translate/core';
import {HttpModule} from '@angular/http';
import {ComprobantesService} from '../../../general/services/comprobantes/comprobantes.service';
import {ParametrosService} from '../../../general/services/configuracionDocumento/parametros.service';
import {TiposService} from '../../../general/utils/tipos.service';
import {TablaMaestraService} from '../../../general/services/documento/tablaMaestra.service';
import {EstilosServices} from '../../../general/utils/estilos.services';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DirectivasModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    A2Edatetimepicker,
    TranslateModule,
    DirectivasModule,
  ],
  declarations: [
    PercepcionItemCrearComponent
  ],
  exports: [
    PercepcionItemCrearComponent
  ],
  providers: [
    ParametrosService,
    ComprobantesService,
    TiposService,
    TablaMaestraService,
    EstilosServices
  ]
})
export class PercepcionItemCrearModule { }
