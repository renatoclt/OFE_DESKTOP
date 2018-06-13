import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from '../utils/utils.module';

import { RetencionCompradorBuscarComponent } from './comprador/buscar/retencioncompradorbuscar.component';
import { RetencionCompradorFormularioComponent } from './comprador/formulario/retencioncompradorformulario.component';
import { RetencionProveedorBuscarComponent } from './proveedor/buscar/retencionproveedorbuscar.component';
import { RetencionProveedorFormularioComponent} from './proveedor/formulario/retencionproveedorformulario.component';
import { RetencionRoutes } from './retencion.routing';

import {A2Edatetimepicker} from '../directives/datepicker.module';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(RetencionRoutes),
        FormsModule,
        UtilsModule,
        A2Edatetimepicker
    ],
    declarations: [RetencionCompradorBuscarComponent,RetencionProveedorBuscarComponent,
        RetencionCompradorFormularioComponent,RetencionProveedorFormularioComponent]    
})

export class RetencionModule {}
