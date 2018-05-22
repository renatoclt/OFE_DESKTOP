import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoNotaCreditoEditarItemComponent } from './tipo-nota-credito-editar-item.component';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {DirectivasModule} from '../../../general/directivas/directivas.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    DirectivasModule
  ],
  declarations: [
    TipoNotaCreditoEditarItemComponent
  ],
  exports: [
    TipoNotaCreditoEditarItemComponent
  ],
  providers: []
})
export class TipoNotaCreditoEditarItemModule { }
