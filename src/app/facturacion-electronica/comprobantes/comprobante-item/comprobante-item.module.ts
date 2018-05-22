import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ComprobanteItemComponent} from './comprobante-item.component';
import {ReactiveFormsModule} from '@angular/forms';
import { ComprobanteEditarBaseComponent } from './comprobante-editar-base.component';
import {TranslateModule} from '@ngx-translate/core';
import { DirectivasModule } from 'app/facturacion-electronica/general/directivas/directivas.module';
import {Ng2AutoCompleteModule} from 'ng2-auto-complete';
import {Servidores} from '../../general/services/servidores';
import { MensajeService } from 'app/facturacion-electronica/general/services/utils/mensaje.service';
import { EstilosServices } from 'app/facturacion-electronica/general/utils/estilos.services';
import { RefreshService } from 'app/facturacion-electronica/general/services/refresh.service';
import {ProductoServices} from '../../general/services/inventario/producto.services';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DirectivasModule,
    Ng2AutoCompleteModule
  ],
  declarations: [
    ComprobanteItemComponent,
    ComprobanteEditarBaseComponent
  ],
  exports: [
    ComprobanteItemComponent,
    ComprobanteEditarBaseComponent
  ],
  providers: [
    Servidores,
    ProductoServices,
    MensajeService,
    EstilosServices,
    RefreshService
  ]
})
export class ComprobanteItemModule { }
