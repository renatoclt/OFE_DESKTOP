import { NgModule } from '@angular/core';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { Ng2CompleterModule } from 'ng2-completer';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTableModule } from 'app/facturacion-electronica/general/data-table/data-table.module';
import { DirectivasModule } from 'app/facturacion-electronica/general/directivas/directivas.module';
import { A2Edatetimepicker } from 'app/directives/datepicker.module';
import { ConsultaClienteComponent } from 'app/cliente/consulta-cliente.component';
import { RouterModule } from '@angular/router';
import { ConsultaRoutes } from 'app/cliente/cliente.routing';
import { CatalogoDocumentoIdentidadService } from 'app/facturacion-electronica/general/utils/catalogo-documento-identidad.service';
import { TiposService } from 'app/facturacion-electronica/general/utils/tipos.service';
import { CorreoService } from 'app/facturacion-electronica/general/services/correo/correo.service';
import { PercepcionRetencionReferenciasService } from 'app/facturacion-electronica/percepcion-retencion/services/percepcion-retencion-referencias.service';
import { Servidores } from 'app/facturacion-electronica/general/services/servidores';
import { PersistenciaService } from 'app/facturacion-electronica/comprobantes/services/persistencia.service';
import { DocumentoQueryService } from 'app/facturacion-electronica/general/services/comprobantes/documentoQuery.service';
import { ArchivoService } from 'app/facturacion-electronica/general/services/archivos/archivo.service';
import { TablaMaestraService } from 'app/facturacion-electronica/general/services/documento/tablaMaestra.service';
import { ComprobantesClienteService } from 'app/cliente/service/comprobantes.service';
import { EstadoDocumentoService } from 'app/facturacion-electronica/general/services/documento/estadoDocumento.service';
import { PdfViewerModule } from 'app/facturacion-electronica/general/pdf-viewer/pdf-viewer.module';
import { VisualizarComprobanteClienteComponent } from 'app/cliente/comprobantes-visualizar/visualizar-comprobante-cliente.component';
import { SpinnerService } from 'app/cliente/service/spinner.service';
import { LoadingModule } from 'ngx-loading';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from 'app/cliente/service/authInterceptor';

@NgModule({
    imports: [
        PdfViewerModule,
        DataTableModule,
        DirectivasModule,
        ReactiveFormsModule,
        CommonModule,
        ReactiveFormsModule,
        A2Edatetimepicker,
        DataTableModule,
        TranslateModule,
        Ng2CompleterModule,
        Ng2AutoCompleteModule,
        DirectivasModule,
        CommonModule,
        RouterModule.forChild(ConsultaRoutes),
        FormsModule,
        LoadingModule,
        HttpClientModule
    ],
    providers: [
        CatalogoDocumentoIdentidadService,
        TiposService,
        PersistenciaService,
        EstadoDocumentoService,
        ComprobantesClienteService,
        TablaMaestraService,
        ArchivoService,
        DocumentoQueryService,
        PersistenciaService,
        Servidores,
        PercepcionRetencionReferenciasService,
        CorreoService,
        SpinnerService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
  ],
    declarations: [ConsultaClienteComponent, VisualizarComprobanteClienteComponent],
    exports: [ConsultaClienteComponent, VisualizarComprobanteClienteComponent]
})

export class ClienteModule {}
