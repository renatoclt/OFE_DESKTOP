import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteDocumentoEmisorComponent } from './reporte-documento-emisor.component';
import {ReporteDocumentoEmisorRoutingModule} from './reporte-documento-emisor.routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {A2Edatetimepicker} from '../../../directives/datepicker.module';
import {TranslateModule} from '@ngx-translate/core';
import {Ng2AutoCompleteModule} from 'ng2-auto-complete';
import {DataTableModule} from '../../general/data-table/data-table.module';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {EstadoDocumentoService} from '../../general/services/documento/estadoDocumento.service';
import {EntidadService} from '../../general/services/organizacion/entidad.service';
import {CatalogoDocumentoIdentidadService} from '../../general/utils/catalogo-documento-identidad.service';
import {TokenInterceptorService} from '../../general/services/tokenInterceptor.service';
import {EstilosServices} from '../../general/utils/estilos.services';
import {ReportesService} from '../../general/services/reportes/reportes.service';
import {TiposService} from '../../general/utils/tipos.service';
import {ReporteDocumentoEmisorService} from './servicios/reporte-documento-emisor.service';
import {PersistenciaService} from '../../comprobantes/services/persistencia.service';

@NgModule({
  imports: [
    CommonModule,
    ReporteDocumentoEmisorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    A2Edatetimepicker,
    TranslateModule,
    Ng2AutoCompleteModule,
    DataTableModule,
    AngularMultiSelectModule
  ],
  declarations: [
    ReporteDocumentoEmisorComponent
  ],
  providers: [
    EstadoDocumentoService,
    EntidadService,
    CatalogoDocumentoIdentidadService,
    EstilosServices,
    ReportesService,
    TiposService,
    ReporteDocumentoEmisorService,
    PersistenciaService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class ReporteDocumentoEmisorModule { }
