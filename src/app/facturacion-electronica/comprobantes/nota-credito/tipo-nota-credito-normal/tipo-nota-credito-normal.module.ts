import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoNotaCreditoNormalComponent } from './tipo-nota-credito-normal.component';
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
    TipoNotaCreditoNormalComponent
  ],
  exports: [
    TipoNotaCreditoNormalComponent
  ],
  providers: []
})
export class TipoNotaCreditoNormalModule { }
