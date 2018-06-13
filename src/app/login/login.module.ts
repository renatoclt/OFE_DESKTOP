import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { LoginRoutes } from './login.routing';
import { TokenInterceptorService } from 'app/facturacion-electronica/general/services/tokenInterceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TiposService } from '_src/app/facturacion-electronica/general/utils/tipos.service';
import { DirectivasModule } from 'app/facturacion-electronica/general/directivas/directivas.module';

@NgModule({
    imports: [
        DirectivasModule,
        CommonModule,
        RouterModule.forChild(LoginRoutes),
        FormsModule
    ],
    declarations: [LoginComponent],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true
        }
    ]
})

export class LoginModule {}
