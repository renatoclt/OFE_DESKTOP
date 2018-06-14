import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmisionComprobanteComponent } from './emision-comprobante.component';
import {TranslateModule} from '@ngx-translate/core';
import {CorreoService} from '../services/correo/correo.service';
import {ArchivoService} from '../services/archivos/archivo.service';
import {PdfViewerModule} from '../pdf-viewer/pdf-viewer.module';
import {TiposService} from '../utils/tipos.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    PdfViewerModule
  ],
  declarations: [
    EmisionComprobanteComponent
  ],
  exports: [
    EmisionComprobanteComponent
  ],
  providers: [
    CorreoService,
    TiposService,
    ArchivoService
  ]
})
export class EmisionComprobanteModule { }
