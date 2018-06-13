import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ComprobantesRoutingModule} from './comprobantes.routing.module';
import {ComprobantesComponent} from './comprobantes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { TiposService } from '../general/utils/tipos.service';
import { RutasService } from '../general/utils/rutas.service';
import { ProductosComprobanteService } from './general/productos-comprobante.service';
import { ComprobanteProductosService } from './services/comprobante.productos.service';
import { A2Edatetimepicker } from '../../directives/datepicker.module';
import { ConstantesService } from '../general/utils/constantes.service';
import { ConsultaModule } from '../general/consulta/consulta.module';
import { PersistenciaService } from './services/persistencia.service';
import { TranslateModule} from '@ngx-translate/core';
import { EntidadService } from 'app/facturacion-electronica/general/services/organizacion/entidad.service';
import { TablaMaestraService } from 'app/facturacion-electronica/general/services/documento/tablaMaestra.service';
import { ParametrosService } from 'app/facturacion-electronica/general/services/configuracionDocumento/parametros.service';
import { TipoPrecioVentaService } from 'app/facturacion-electronica/general/services/configuracionDocumento/tipoPrecioVenta.service';
import { TipoCalculoIscService } from 'app/facturacion-electronica/general/services/configuracionDocumento/tipoCalculoIsc.service';
import { TipoAfectacionIgvService } from 'app/facturacion-electronica/general/services/configuracionDocumento/tipoAfectacionIgv.service';
import { DirectivasModule } from 'app/facturacion-electronica/general/directivas/directivas.module';
import { CatalogoIgvService } from 'app/facturacion-electronica/general/utils/catalogo-igv.service';
import { PersistenciaPost } from 'app/facturacion-electronica/percepcion-retencion/services/persistencia-post';
import {ComprobanteVisualizarModule} from './comprobantes-visualizar/comprobante-visualizar.module';
import {PadreComprobanteService} from './services/padre-comprobante.service';
import { PersistenciaEntidadService } from '../percepcion-retencion/services/persistencia.entidad.service';

@NgModule({
  imports: [
    CommonModule,
    ComprobantesRoutingModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    HttpClientModule,
    A2Edatetimepicker,
    ConsultaModule,
    TranslateModule,
    DirectivasModule,
    ComprobanteVisualizarModule
  ],
  declarations: [
    // ComprobantesEditarComponent,
    ComprobantesComponent,
  ],
  providers: [
    TiposService,
    ConstantesService,
    RutasService,
    ProductosComprobanteService,
    ComprobanteProductosService,
    PersistenciaService,
    EntidadService,
    TablaMaestraService,
    ParametrosService,
    TipoPrecioVentaService,
    TipoCalculoIscService,
    TipoAfectacionIgvService,
    CatalogoIgvService,
    PersistenciaPost,
    PadreComprobanteService,
    PersistenciaEntidadService
  ]
})
export class ComprobantesModule { }
