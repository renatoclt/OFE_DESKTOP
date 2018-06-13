import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {UtilsModule} from '../utils/utils.module';

import { RequerimientoCompradorBuscarComponent } from './comprador/buscar/requerimientocompradorbuscar.component';
import { RequerimientoCompradorFormularioComponent } from './comprador/formulario/requerimientocompradorformulario.component';
import { RequerimientoProveedorBuscarComponent } from './proveedor/buscar/requerimientoproveedorbuscar.component';
import { RequerimientoProveedorFormularioComponent } from './proveedor/formulario/requerimientoproveedorformulario.component';

import { RequerimientoRoutes } from './requerimiento.routing';
import {A2Edatetimepicker} from '../directives/datepicker.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(RequerimientoRoutes),
        FormsModule,
        UtilsModule,A2Edatetimepicker
    ],
    declarations: [RequerimientoCompradorBuscarComponent,
        RequerimientoCompradorFormularioComponent, RequerimientoProveedorBuscarComponent, RequerimientoProveedorFormularioComponent, ]
})

export class RequerimientoModule {}
