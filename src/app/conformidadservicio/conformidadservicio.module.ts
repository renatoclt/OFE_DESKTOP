import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {UtilsModule} from '../utils/utils.module';

import { ConformidadServicioCompradorBuscarComponent } from './comprador/buscar/conformidadserviciocompradorbuscar.component';
import { ConformidadServicioCompradorFormularioComponent } from './comprador/formulario/conformidadserviciocompradorformulario.component';
import { ConformidadServicioProveedorBuscarComponent } from './proveedor/buscar/conformidadservicioproveedorbuscar.component';
import { ConformidadServicioProveedorFormularioComponent} from './proveedor/formulario/conformidadservicioproveedorformulario.component';
import { ConformidadServicioRoutes } from './conformidadservicio.routing';

import {A2Edatetimepicker} from '../directives/datepicker.module';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ConformidadServicioRoutes),
        FormsModule,
        UtilsModule,
        A2Edatetimepicker
    ],
    declarations: [ConformidadServicioCompradorBuscarComponent,ConformidadServicioProveedorBuscarComponent,
        ConformidadServicioCompradorFormularioComponent,ConformidadServicioProveedorFormularioComponent]    
})

export class ConformidadServicioModule {}
