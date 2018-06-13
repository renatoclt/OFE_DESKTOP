import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {DirectivasModule} from '../../general/directivas/directivas.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {SeriesComponent} from './series.component';
import {DataTableModule} from '../../general/data-table/data-table.module';
import {SeriesCrearEditarModule} from './series-crear-editar/series-crear-editar.module';
import {SeriesRoutingModule} from './series.routing.module';
import {TokenInterceptorService} from '../../general/services/tokenInterceptor.service';
import {SeriesService} from '../../general/services/configuracionDocumento/series.service';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SeriesRoutingModule,
    TranslateModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    DirectivasModule,
    DataTableModule,
    SeriesCrearEditarModule
  ],
  declarations: [
    SeriesComponent
  ],
  providers: [
    SeriesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class SeriesModule { }
