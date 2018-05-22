import { DtoUsuarioEbiz } from "./dtoUsuarioEbiz";

export class UsuarioOfflineDTO{

    statuscode:any;
    message: any;
    draw: any;
    recordsTotal: any;
    recordsFiltered: any;
    usuarios : DtoUsuarioEbiz;
    ruc_emisor: any;
    constructor(){}
}