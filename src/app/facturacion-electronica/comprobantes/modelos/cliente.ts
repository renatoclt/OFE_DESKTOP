import {DomicilioFiscal} from './domicilioFiscal';
import {Catalogo} from './catalago';

export class Cliente {
  id: number;
  razonSocial: string; //100
  nombreComercial?: string; //100
  domicilioFiscal?: DomicilioFiscal;
  tipoDocumento: Catalogo ;
}
