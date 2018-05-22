import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {DirectivasModule} from '../general/directivas/directivas.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {BienesServiciosRoutingModule} from './bienes-servicios.routing.module';
import {BienesServiciosComponent} from './bienes-servicios.component';
import {CrearModule} from './crear/crear.module';
import {ConsultarBienesServiciosModule} from './consultar-bienes-servicios/consultar-bienes-servicios.module';

@NgModule({
  imports: [
    BienesServiciosRoutingModule,
    CommonModule,
    HttpClientModule,
    TranslateModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    DirectivasModule,
    CrearModule,
    ConsultarBienesServiciosModule
  ],
  declarations: [
    BienesServiciosComponent
  ]
})
export class BienesServiciosModule { }
