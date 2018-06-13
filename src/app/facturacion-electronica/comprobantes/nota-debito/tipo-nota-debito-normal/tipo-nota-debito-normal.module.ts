import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoNotaDebitoNormalComponent } from './tipo-nota-debito-normal.component';
import {TranslateModule} from '@ngx-translate/core';
import {DirectivasModule} from '../../../general/directivas/directivas.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    DirectivasModule
  ],
  declarations: [
    TipoNotaDebitoNormalComponent
  ],
  exports: [
    TipoNotaDebitoNormalComponent
  ],
  providers: []
})
export class TipoNotaDebitoNormalModule { }
