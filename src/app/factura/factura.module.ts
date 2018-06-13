import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {UtilsModule} from '../utils/utils.module';

import { FacturaProveedorFormularioComponent } from './proveedor/formulario/facturaproveedorformulario.component';
import { FacturaCompradorFormularioComponent } from './comprador/formulario/facturacompradorformulario.component';
import { FacturaProveedorBuscarComponent } from './proveedor/buscar/facturaproveedorbuscar.component';
import { FacturaRoutes } from './factura.routing';

import {A2Edatetimepicker} from '../directives/datepicker.module';
import {FacturaCompradorBuscarComponent} from './comprador/buscar/facturacompradorbuscar.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(FacturaRoutes),
        FormsModule,
        UtilsModule,A2Edatetimepicker
    ],
    declarations: [ FacturaProveedorBuscarComponent, FacturaProveedorFormularioComponent, FacturaCompradorBuscarComponent, FacturaCompradorFormularioComponent]
})

export class FacturaModule {}
