import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeriesCrearEditarComponent } from './series-crear-editar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DirectivasModule} from '../../../general/directivas/directivas.module';
import {EstilosServices} from '../../../general/utils/estilos.services';
import {SeriesService} from '../../../general/services/configuracionDocumento/series.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivasModule,
    TranslateModule
  ],
  declarations: [
    SeriesCrearEditarComponent
  ],
  exports: [
    SeriesCrearEditarComponent
  ],
  providers: [
    EstilosServices,
    SeriesService
  ]
})
export class SeriesCrearEditarModule { }
