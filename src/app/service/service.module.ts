import { NgModule } from '@angular/core';
import { LoginService } from "./login.service";
import { MasterService } from "./masterservice";
import { ConformidadServicioService } from "./conformidadservicioservice";
import {Servidores} from '../facturacion-electronica/general/services/servidores';

@NgModule({
    declarations: [],
    imports: [],
    providers: [
        LoginService,
        Servidores,
        MasterService,
        ConformidadServicioService
    ],
    exports: []
})
export class ServiceModule {}
