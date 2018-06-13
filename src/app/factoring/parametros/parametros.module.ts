import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from '../../utils/utils.module';

import { FactoringRoutes } from './parametros.routing';

import { ParametrosBuscarComponent } from "./comprador/buscar/parametrosbuscar.component";


import { A2Edatetimepicker } from '../../directives/datepicker.module';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FactoringRoutes),
    FormsModule,
    UtilsModule,
    A2Edatetimepicker
  ],
  declarations: [
    ParametrosBuscarComponent
  ]
})

export class ParametrosModule { }