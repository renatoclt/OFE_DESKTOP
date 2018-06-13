import {Catalogo, Catalogos} from './catalago';

export class DomicilioFiscal {
  ubigeo: Catalogo;
  direccion: string; //100
  urbanizacion: string; //25
  provinica: string; //30
  departamento: string; //30
  distrito: string; //30
  pais: Catalogo;
}
