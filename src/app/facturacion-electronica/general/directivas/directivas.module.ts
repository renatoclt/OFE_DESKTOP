import { NgModule } from '@angular/core';
import {CommonModule, DatePipe, DecimalPipe} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { CorrelativoDirective } from './correlativo.directive';
import { PrecioDirective } from './precio.directive';
import { TicketDirective } from './ticket.directive';
import { RucDirective } from './ruc.directive';
import { TipoDocumentoDirective } from './tipoDocumento.directive';
import {ArchivoDirective} from './archivo.directive';
import {SerieDirective} from './serie.directive';
import { CodigoDirective } from 'app/facturacion-electronica/general/directivas/codigo.directive';
import {MayusculaDirective} from './mayuscula.directive';
import {PrecioPipe} from '../pipes/precio.pipe';
import {MayusculaPipe} from '../pipes/mayuscula.pipe';
import { DisableControlDirective } from './disableControl.directive';
import { MacDirective } from './mac.directive';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    PrecioPipe,
    MayusculaPipe,
    CorrelativoDirective,
    PrecioDirective,
    TicketDirective,
    RucDirective,
    TipoDocumentoDirective,
    ArchivoDirective,
    SerieDirective,
    CodigoDirective,
    MayusculaDirective,
    DisableControlDirective,
    MacDirective
  ],
  exports: [
    CorrelativoDirective,
    PrecioDirective,
    TicketDirective,
    RucDirective,
    TipoDocumentoDirective,
    ArchivoDirective,
    SerieDirective,
    CodigoDirective,
    MayusculaDirective,
    DisableControlDirective,
    MacDirective
  ],
  providers: [
    PrecioPipe,
    DatePipe,
    DecimalPipe,
    MayusculaPipe
  ]
})
export class DirectivasModule { }
