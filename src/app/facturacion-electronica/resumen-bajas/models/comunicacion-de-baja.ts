import {DetalleBajaConsulta} from './detalle-baja-consulta';

export class ComunicacionDeBaja {
  idTipoComprobante: string;
  idEntidad: string;
  rucProveedor: string;
  tipoDocumento: string;
  razonSocialProveedor: string;
  fechaEmisionDocumentoBaja: number;
  correo: string;
  tipoSerie: number;
  detalleBaja: DetalleBajaConsulta[];
}
