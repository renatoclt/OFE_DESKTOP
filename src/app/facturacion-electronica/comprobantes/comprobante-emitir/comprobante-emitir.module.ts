import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { ComprobanteEmitirComponent } from './comprobante-emitir.component';
import {PdfViewerModule} from '../../general/pdf-viewer/pdf-viewer.module';
import {ArchivoService} from '../../general/services/archivos/archivo.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PdfViewerModule,
    TranslateModule,
  ],
  declarations: [
    ComprobanteEmitirComponent
  ],
  exports: [
    ComprobanteEmitirComponent
  ],
  providers: [
    ArchivoService
  ]
})
export class ComprobanteEmitirModule { }
