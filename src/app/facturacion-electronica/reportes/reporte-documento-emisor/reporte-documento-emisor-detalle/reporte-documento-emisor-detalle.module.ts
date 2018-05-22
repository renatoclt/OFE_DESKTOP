import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteDocumentoEmisorDetalleComponent } from './reporte-documento-emisor-detalle.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {DataTableModule} from '../../../general/data-table/data-table.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {TokenInterceptorService} from '../../../general/services/tokenInterceptor.service';
import {EntidadService} from '../../../general/services/organizacion/entidad.service';
import {EstilosServices} from '../../../general/utils/estilos.services';
import {CatalogoDocumentoIdentidadService} from '../../../general/utils/catalogo-documento-identidad.service';
import {EstadoDocumentoService} from '../../../general/services/documento/estadoDocumento.service';
import {ReportesService} from '../../../general/services/reportes/reportes.service';
import {ReporteDocumentoEmisorDetalleRoutingModule} from './reporte-documento-emisor-detalle.routing.module';
import {TiposService} from '../../../general/utils/tipos.service';
import {TablaMaestraService} from '../../../general/services/documento/tablaMaestra.service';
import {ArchivoService} from '../../../general/services/archivos/archivo.service';

@NgModule({
  imports: [
    CommonModule,
    ReporteDocumentoEmisorDetalleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule,
    DataTableModule
  ],
  declarations: [
    ReporteDocumentoEmisorDetalleComponent
  ],
  exports: [
    ReporteDocumentoEmisorDetalleComponent
  ],
  providers: [
    EstadoDocumentoService,
    EntidadService,
    CatalogoDocumentoIdentidadService,
    EstilosServices,
    ReportesService,
    TiposService,
    TablaMaestraService,
    ArchivoService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class ReporteDocumentoEmisorDetalleModule { }
