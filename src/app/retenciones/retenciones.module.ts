import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UtilsModule} from '../utils/utils.module';

import {RetencionesCompradorBuscarComponent} from './comprador/buscar/retencionescompradorbuscar.component';
import {RetencionesCompradorFormularioComponent} from './comprador/formulario/retencionescompradorformulario.component';
import {RetencionesProveedorBuscarComponent} from './proveedor/buscar/retencionesproveedorbuscar.component';
import {RetencionesProveedorFormularioComponent} from './proveedor/formulario/retencionesproveedorformulario.component';
import {RetencionesRoutes} from './retenciones.routing';

import {A2Edatetimepicker} from '../directives/datepicker.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(RetencionesRoutes),
        FormsModule,
        UtilsModule,
        A2Edatetimepicker
    ],
    declarations: [RetencionesCompradorBuscarComponent,RetencionesProveedorBuscarComponent,
        RetencionesCompradorFormularioComponent,RetencionesProveedorFormularioComponent]
})

export class RetencionesModule {}
