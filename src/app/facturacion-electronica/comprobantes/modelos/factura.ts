import {Cliente} from './cliente';
import {Item} from './item';
import {Catalogo} from './catalago';

export class Factura {
  fechaEmision: Date; //YYYY-MM-DD
  cliente: Cliente;
  serie: string;
  correlativo: string;
  usuario: Cliente;
  items: Item[];
  ventaOperGravadas: VentaOperGravadas;
  ventaOperInafectas: VentaOperInafectas;
  ventaOperOnerosas: VentaOperOnerosas;

  constructor() {

  }

}

export class VentaOperGravadas {
  tipoMonto: Catalogo;
  monto: number; //n(12,2)
}

export class VentaOperInafectas {
  tipoMonto: Catalogo;
  monto: number; //n(12,2)
}

export class VentaOperOnerosas {
  tipoMonto: Catalogo;
  monto: number; //n(12,2)
}

