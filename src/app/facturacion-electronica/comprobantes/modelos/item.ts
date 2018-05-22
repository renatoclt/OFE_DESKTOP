import {Catalogo} from './catalago';

export class Item {
  unidadMedida: Catalogo;
  cantidad: number; //n(12,3)
  descripcion: string; //250
  valoUnitario: number; //n(12,3)
  ventaUnitario: VentaUnitario;
  afectacionIGV: AfectacionIGV;
  sistemaISC: SistemaISC; //n(12,3)

}


export class VentaUnitario {
  precio: number; //n(12,3)
  tipo: Catalogo;
}


export class AfectacionIGV {
  montoTotal: number; //n(12,3)
  montoSubTotal: number; //n(12,3)
  tipoAfectacion: Catalogo;
  tipoTributo: Catalogo;

}

export class SistemaISC {
  montoTotal: number; //n(12,3)
  montoSubTotal: number; //n(12,3)
  tipoISC: Catalogo;
  tipoTributo: Catalogo;
}
