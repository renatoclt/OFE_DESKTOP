import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from '../utils/utils.module';

import { DetraccionCompradorBuscarComponent } from './comprador/buscar/detraccioncompradorbuscar.component';
import { DetraccionCompradorFormularioComponent } from './comprador/formulario/detraccioncompradorformulario.component';
import { DetraccionProveedorBuscarComponent } from './proveedor/buscar/detraccionproveedorbuscar.component';
import { DetraccionProveedorFormularioComponent} from './proveedor/formulario/detraccionproveedorformulario.component';
import { DetraccionesRoutes } from './detraccion.routing';

import {A2Edatetimepicker} from '../directives/datepicker.module';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DetraccionesRoutes),
        FormsModule,
        UtilsModule,
        A2Edatetimepicker
    ],
    declarations: [DetraccionCompradorBuscarComponent,DetraccionProveedorBuscarComponent,
        DetraccionCompradorFormularioComponent,DetraccionProveedorFormularioComponent]    
})

export class DetraccionModule {}