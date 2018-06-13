import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoNotaDebitoEditarItemComponent } from './tipo-nota-debito-editar-item.component';
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
    TipoNotaDebitoEditarItemComponent
  ],
  exports: [
    TipoNotaDebitoEditarItemComponent
  ],
  providers: []
})
export class TipoNotaDebitoEditarItemModule { }
