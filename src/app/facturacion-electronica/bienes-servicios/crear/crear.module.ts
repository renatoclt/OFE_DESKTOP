import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ArchivoService} from '../../general/services/archivos/archivo.service';
import {ComprobantesService} from '../../general/services/comprobantes/comprobantes.service';
import {NuevoDocumentoService} from '../../general/services/documento/nuevoDocumento';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConsultaModule} from '../../general/consulta/consulta.module';
import {DirectivasModule} from '../../general/directivas/directivas.module';
import {HttpModule} from '@angular/http';
import {CrearRoutingModule} from './crear.routing.module';
import {CrearComponent} from './crear.component';
import {BienesServiciosIndividualComponent} from './bienes-servicios-individual/bienes-servicios-individual.component';
import {BienesServiciosMasivaComponent} from './bienes-servicios-masiva/bienes-servicios-masiva.component';
import {TipoCalculoIscService} from '../../general/services/configuracionDocumento/tipoCalculoIsc.service';
import {ProductoServices} from '../../general/services/inventario/producto.services';
import {PadreComprobanteService} from '../../comprobantes/services/padre-comprobante.service';
import {ProductoMasivoService} from '../../general/services/inventario/producto-masivo.service';
import {Servidores} from '../../general/services/servidores';
import {DataTableModule} from '../../general/data-table/data-table.module';
import {TokenInterceptorService} from '../../general/services/tokenInterceptor.service';
import {EstilosServices} from '../../general/utils/estilos.services';

@NgModule({
  imports: [
    CrearRoutingModule,
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    HttpClientModule,
    ConsultaModule,
    TranslateModule,
    DirectivasModule,
    DataTableModule
  ],
  declarations: [
    CrearComponent,
    BienesServiciosIndividualComponent,
    BienesServiciosMasivaComponent
  ],
  providers: [
    Servidores,
    NuevoDocumentoService,
    ArchivoService,
    ComprobantesService,
    TipoCalculoIscService,
    ProductoServices,
    PadreComprobanteService,
    ProductoMasivoService,
    EstilosServices,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
],
  exports: [
    CrearComponent,
    BienesServiciosIndividualComponent,
    BienesServiciosMasivaComponent
  ]
})
export class CrearModule { }
