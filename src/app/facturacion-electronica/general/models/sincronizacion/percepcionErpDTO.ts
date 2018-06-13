import { FacturasAfectadasDTO } from "./FacturasAfectadasDTO";

export class PercepcionErpDTO {
    public idComprobanteOffline: any;
    public numeroComprobante: any;
    public rucComprador: any;
    public razonSocialComprador: any;
    public correoProveedor: any;
    public correoComprador: any;
    public moneda: any;
    public fechaEmision: any;
    public observacionComprobante: any;
    public montoPagado: any;
    public monedaDescuento: any;
    public montoDescuento: any;
    public totalComprobante: any;
    public tipoItem: any;
    public facturasAfectadas: FacturasAfectadasDTO;
    constructor() {

    }
}
export class PercepcionIdDTO{
    public id: any;
    constructor(){

    }
}
export class PercepcionErrorDTO{
    public id: any;
    public error: any;
    constructor(){

    }
}
export class PercepcionActualizarDTO{
    public id: any;
    public chEstadocomprobantepago: any;
    public chEstadocomprobantepagocomp: any;
    public eventos: EventosDTO[];
    constructor() { }
}
export class EventosDTO{
    public fechaCreacion: any;
    public inEstadoEvento: any;
    public inIdcomprobante: any;
    public inIdevento: any;
    public inIidioma: any;
    public seIdocevento: any;
    public usuarioCreacion: any;
    public vcDescripcionEvento: any;
    public vcObservacionEvento: any;
    constructor(){}
}
