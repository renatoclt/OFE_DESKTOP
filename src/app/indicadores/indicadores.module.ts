import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from '../utils/utils.module';

import { IndicadoresRoutes } from './indicadores.routing';

import { IndicadoresComponent } from "./indicadores.component";
import { HasCompradorBuscarComponent } from "./comprador/has/comprador/buscar/hascompradorbuscar.component";
import { GuiaCompradorBuscarComponent } from "./comprador/guia/comprador/buscar/guiacompradorbuscar.component";
import { OcCompradorBuscarComponent } from "./comprador/ordendecompra/comprador/buscar/occompradorbuscar.component";
import { FacturaCompradorBuscarComponent } from "./comprador/facturas/comprador/buscar/facturacompradorbuscar.component";
import { PreGuiaCompradorBuscarComponent } from "./comprador/preregistroguias/comprador/buscar/prgcompradorbuscar.component";
import { RfqCompradorBuscarComponent } from "./comprador/rfq/comprador/buscar/rfqcompradorbuscar.component";
//PROVEEDORES
import { HasProveedorBuscarComponent } from "./proveedor/has/proveedor/buscar/hasproveedorbuscar.component";
import { GuiaProveedorBuscarComponent } from "./proveedor/guia/proveedor/buscar/guiaproveedorbuscar.component";
import { OCProveedorBuscarComponent } from "./proveedor/ordendecompra/proveedor/buscar/ocproveedorbuscar.component";
import { FacturaProveedorBuscarComponent } from "./proveedor/facturas/proveedor/buscar/facturaproveedorbuscar.component";
import { PreGuiaProveedorBuscarComponent } from "./proveedor/preregistroguias/proveedor/buscar/prgproveedorbuscar.component";
import { RfqProveedorBuscarComponent } from "./proveedor/rfq/proveedor/buscar/rfqproveedorbuscar.component";

import { IndicadoresComponent as IndicadoresComponent2 } from './comprador/indicadores.component';
import { IndicadoresComponent as IndicadoresComponent3 } from './proveedor/indicadores.component';


import { A2Edatetimepicker } from '../directives/datepicker.module';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(IndicadoresRoutes),
    FormsModule,
    UtilsModule,
    A2Edatetimepicker
  ],
  declarations: [
    IndicadoresComponent,

    IndicadoresComponent2,
    IndicadoresComponent3,

    
    HasCompradorBuscarComponent,
    GuiaCompradorBuscarComponent,
    FacturaCompradorBuscarComponent,
    PreGuiaCompradorBuscarComponent,
    RfqCompradorBuscarComponent,
    HasProveedorBuscarComponent,
    GuiaProveedorBuscarComponent,
    OCProveedorBuscarComponent,
    FacturaProveedorBuscarComponent,
    PreGuiaProveedorBuscarComponent,
    OcCompradorBuscarComponent,
    RfqProveedorBuscarComponent
  ]
})

export class IndicadoresModule { }