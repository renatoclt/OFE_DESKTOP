import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {UtilsModule} from '../utils/utils.module';

import { CalificacionProveedorBuscarComponent } from './proveedor/buscar/calificacionproveedorbuscar.component';
import { CalificacionProveedorFormularioComponent} from './proveedor/formulario/calificacionproveedorformulario.component';
import { CalificacionProveedorCalificarComponent} from './proveedor/calificar/calificacionproveedorcalificar.component';
import { CalificacionProveedorDetalleCalificacionComponent} from './proveedor/detallecalificacion/calificacionproveedordetallecalificacion.component';
import { CalificacionRoutes } from './calificacion.routing';

import {A2Edatetimepicker} from '../directives/datepicker.module';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(CalificacionRoutes),
        FormsModule,
        UtilsModule,
        A2Edatetimepicker
    ],
    declarations: [CalificacionProveedorBuscarComponent,
        CalificacionProveedorFormularioComponent,CalificacionProveedorCalificarComponent, CalificacionProveedorDetalleCalificacionComponent]    
})

export class CalificacionModule {}
