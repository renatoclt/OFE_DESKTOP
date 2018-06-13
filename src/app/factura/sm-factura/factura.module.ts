import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from 'app/utils/utils.module';

import { FacturaCompradorBuscarComponent } from './comprador/buscar/facturacompradorbuscar.component';
import { FacturaCompradorFormularioComponent } from './comprador/formulario/facturacompradorformulario.component';
import { FacturaCompradorFormularioComponentPub } from './comprador/formulario-pub/facturacompradorformulario.component';

import { FacturaProveedorBuscarComponent } from './proveedor/buscar/facturaproveedorbuscar.component';
import { FacturaProveedorFormularioComponentPre } from './proveedor/formulario-pre/facturaproveedorformulario.component';
import { FacturaProveedorFormularioComponentPub } from './proveedor/formulario-pub/facturaproveedorformulario.component';

import { FacturaRoutes } from './factura.routing';
import { A2Edatetimepicker } from 'app/directives/datepicker.module';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(FacturaRoutes),
        FormsModule,
        UtilsModule,A2Edatetimepicker
    ],
    declarations: [ FacturaProveedorBuscarComponent, FacturaProveedorFormularioComponentPre, FacturaCompradorBuscarComponent, FacturaCompradorFormularioComponent, FacturaProveedorFormularioComponentPub, FacturaCompradorFormularioComponentPub]
})

export class FacturaModule {}
