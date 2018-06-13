export class Guia {
  constructor(){

    this.fechaemision= null;
    this.fechainiciotraslado= null;
    this.fechaprobablearribo= null;
    this.articulos= [];
    this.docadjuntos= [];
  }
  id: string;
  nroguia: string;
  nroguia1: string;
  nroguia2: string;
  rucproveedor: string;
  razonsocialproveedor: string;
  ruccliente: string;
  razonsocialcliente: string;
  fechaemision: Date;
  fechainiciotraslado: Date;
  fechaprobablearribo: Date;
  motivoguia: string;
  observaciones: string;
  tipodoctransporte: string;
  rucdnitransporte: string;
  razonsocialnombretransporte: string;
  placatransporte: string;
  direcciontransporte: string;
  codigomtctransporte: string;
  tipotransporte: string;
  puntopartida: string;
  puntollegada: string;
  alamcendestino: string;
  totalbultos: string;
  totalvolumen: string;
  totalvolumenund: string;
  totalpesobruto: string;
  totalpesobrutound: string;
  tara: string;
  taraund: string;
  totalpesoneto: string;
  totalpesonetound: string;
  nroerpdocmaterial: string;

  articulos:Articulo[];
  docadjuntos?: Archivo[];
}

export class Articulo {
  nroitem: number;  
  nrooc: string;
  nroitemoc: string;
  codproducto: string;
  descproducto: string;
  cantpedida: string;
  cantaceptada: string;
  cantregistradaproveedor: string;
  unidadmedida: string;
  pesoneto: string;
  coddestino: string;
  destino: string;

}

export class Archivo {
  id: number;
  nombre: string;
  descripcion: string;

}
export class GuiaBuscar {
  id: number;
  nroguia: string;  
  estado: string;
  proveedor: string;
  fechaemision: string;
  fechainiciotraslado: string;
  fechaprobablearribo: string;
  documentoerp: string;

}

export class GuiaFiltros {
  nroguia?: string;
  nrooc?: string;
  nroerp?: string;
 
  fechaemisioninicio?: Date;
  fechaemisionfin?: Date;

}
