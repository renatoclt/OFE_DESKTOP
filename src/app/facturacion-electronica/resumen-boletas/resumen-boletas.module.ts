import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumenBoletasRoutingModule } from 'app/facturacion-electronica/resumen-boletas/resumen-boletas.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { A2Edatetimepicker } from 'app/directives/datepicker.module';
import { DataTableModule } from 'app/facturacion-electronica/general/data-table/data-table.module';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivasModule } from 'app/facturacion-electronica/general/directivas/directivas.module';
import { ResumenBoletasComponent } from 'app/facturacion-electronica/resumen-boletas/resumen-boletas.component';
import { TiposService } from 'app/facturacion-electronica/general/utils/tipos.service';
import { ComprobantesService } from 'app/facturacion-electronica/general/services/comprobantes/comprobantes.service';
import { Servidores } from 'app/facturacion-electronica/general/services/servidores';
import { ArchivoService } from 'app/facturacion-electronica/general/services/archivos/archivo.service';
import { NuevoDocumentoBajaService } from 'app/facturacion-electronica/general/services/documento/nuevoDocumentoBaja';
import { PersistenciaService } from 'app/facturacion-electronica/comprobantes/services/persistencia.service';
import { TokenInterceptorService } from 'app/facturacion-electronica/general/services/tokenInterceptor.service';
import { ConsultaModule } from 'app/facturacion-electronica/general/consulta/consulta.module';
import {PadreComprobanteService} from '../comprobantes/services/padre-comprobante.service';

@NgModule({
  imports: [
    CommonModule,
    ResumenBoletasRoutingModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    HttpClientModule,
    A2Edatetimepicker,
    DataTableModule,
    TranslateModule,
    DirectivasModule,
    ConsultaModule
  ],
  declarations: [
    ResumenBoletasComponent
  ],
  providers: [
    TiposService,
    ComprobantesService,
    Servidores,
    ArchivoService,
    PersistenciaService,
    NuevoDocumentoBajaService,
    PadreComprobanteService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  exports: [
    ResumenBoletasComponent
  ]
})
export class ResumenBoletasModule { }
