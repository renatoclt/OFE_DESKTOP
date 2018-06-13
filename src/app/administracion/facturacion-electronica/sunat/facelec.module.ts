import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from 'app/utils/utils.module';

import { FacelecFacebizBuscarComponent } from './facebiz/buscar/facelecfacebizbuscar.component';

import { FacelecRoutes } from './facelec.routing';

import { A2Edatetimepicker } from 'app/directives/datepicker.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(FacelecRoutes),
        FormsModule,
        UtilsModule,
        A2Edatetimepicker
    ],
    declarations: [ FacelecFacebizBuscarComponent ]
})

export class FacelecModule {}
