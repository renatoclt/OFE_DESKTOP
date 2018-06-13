import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from '../utils/utils.module';


import { SolpagoProveedorBuscarComponent } from './proveedor/buscar/solpagoproveedorbuscarcomponent';


import { Solpago } from './solpago.routing';
import { A2Edatetimepicker } from '../directives/datepicker.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(Solpago),
    FormsModule,
    UtilsModule, A2Edatetimepicker
  ],
  declarations: [
    SolpagoProveedorBuscarComponent
  ]
})

export class SolpagoModule { }
