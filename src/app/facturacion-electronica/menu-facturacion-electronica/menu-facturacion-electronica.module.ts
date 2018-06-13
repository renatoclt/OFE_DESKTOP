import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenuFacturacionElectronicaComponent} from './menu-facturacion-electronica.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    MenuFacturacionElectronicaComponent
  ],
  exports: [
    MenuFacturacionElectronicaComponent
  ]
})
export class MenuFacturacionElectronicaModule { }
