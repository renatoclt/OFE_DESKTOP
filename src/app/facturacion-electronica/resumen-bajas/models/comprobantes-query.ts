export class ComprobantesQuery {
  inIdcomprobantepago: string;
  vcSerie: string;
  vcCorrelativo: string;
  inIdorganizacionproveedora: string;
  vcOrgproveedoraDocumento: string;
  vcOrgproveedoraDenominacion: string;
  chMonedacomprobantepago: number;
  dePagomontopagado: number;
  vcIdtablatipocomprobante: string;
  vcIdregistrotipocomprobante: string;
  tsFechaemision: string;
  tsFechaenvio: string;
  deDctomonto: string;
  chEstadocomprobantepagocomp: string;
  parametros: Parametros[] = [];
  entidadcompradora: EntidadComprador;
  vcTipoDocumento: string;
  vcParamTicket: string;
  serieCorrelativo: string;
  vcIdregistroestadocomp:string;
  eventos: Evento [] = [];
  constructor() {
    // this.entidadcompradora = new EntidadComprador();
  }
}
class EntidadComprador {
  public vcDocumento: string;
  public vcTipoDocumento: string;
  constructor() {}
}

class Parametros {
  public inIdocparametro: string;
  public inIcomprobantepago: string;
  public inIparamDoc: any;
  public vcJson: string;
  public inTipo: string;
  public vcValor: string ;
  public auxEntero: string;
  public auxImporte: string;
  public auxFecha: string;
  public auxCaracter: string;
  constructor() {}
}

export class Evento {
  public seIdocevento: number;
  inIdcomprobante: string;
  inIdevento: number;
  inIidioma: number
  vcDescripcionEvento: string;
  vcObservacionEvento: string;
  inEstadoEvento: number;
  fechaCreacion: string;
  usuarioCreacion: string;
  constructor() {}
}
