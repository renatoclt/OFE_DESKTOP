import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MiCuentaComponent} from './mi-cuenta.component';
import {MiCuentaRoutingModule} from './mi-cuenta.routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {DirectivasModule} from '../../general/directivas/directivas.module';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  imports: [
    MiCuentaRoutingModule,
    CommonModule,
    HttpClientModule,
    TranslateModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    DirectivasModule
  ],
  declarations: [
    MiCuentaComponent
  ]
})
export class MiCuentaModule { }
