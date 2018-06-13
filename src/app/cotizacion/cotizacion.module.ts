import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { CotizacionCompradorFormularioComponent } from './comprador/formulario/cotizacioncompradorformulario.component';
import { CotizacionCompradorBuscarComponent } from './comprador/buscar/cotizacioncompradorbuscar.component';
import { CotizacionProveedorFormularioComponent } from './proveedor/formulario/cotizacionproveedorformulario.component';
import { CotizacionProveedorBuscarComponent } from './proveedor/buscar/cotizacionproveedorbuscar.component';
import { CotizacionRoutes } from './cotizacion.routing';
import {A2Edatetimepicker} from '../directives/datepicker.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(CotizacionRoutes),
        FormsModule, A2Edatetimepicker
    ],
    declarations: [ CotizacionCompradorBuscarComponent,CotizacionCompradorFormularioComponent, CotizacionProveedorBuscarComponent, CotizacionProveedorFormularioComponent]
})

export class CotizacionModule {}
