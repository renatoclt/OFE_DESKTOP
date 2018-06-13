import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from '../utils/utils.module';
import { DataTablesModule } from 'angular-datatables';

import { TransporteServicioCompradorBuscarComponent } from './comprador/buscar/transporteserviciocompradorbuscar.component';
import { TransporteServicioCompradorFormularioComponent } from './comprador/formulario/transporteserviciocompradorformulario.component';
import { TransporteServicioProveedorBuscarComponent } from './proveedor/buscar/transporteservicioproveedorbuscar.component';
import { TransporteServicioProveedorFormularioComponent} from './proveedor/formulario/transporteservicioproveedorformulario.component';
import { TransporteServicioRoutes } from './transporteservicio.routing';

import {A2Edatetimepicker} from '../directives/datepicker.module';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(TransporteServicioRoutes),
        FormsModule,
        UtilsModule,
        DataTablesModule,
        A2Edatetimepicker
    ],
    declarations: [TransporteServicioCompradorBuscarComponent,TransporteServicioProveedorBuscarComponent,
        TransporteServicioCompradorFormularioComponent,TransporteServicioProveedorFormularioComponent]    
})

export class TransporteServicioModule {}
