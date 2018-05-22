export class ArchivoXml {
  id: string;
  comprobante: string;
  plantillaInterfaz: string;
  plantillaCloud: string;
  plantillaTiempoFecha: string;
  plantillaTiempoHora: string;

  constructor(id: string,
              comprobante: string,
              plantillaInterfaz: string,
              plantillaCloud: string,
              plantillaTiempoFecha: string,
              plantillaTiempoHora: string) {
    this.id = id ;
    this.comprobante = comprobante;
    this.plantillaCloud = plantillaCloud;
    this.plantillaInterfaz = plantillaInterfaz === null ? '-' : plantillaInterfaz;
    this.plantillaTiempoFecha = plantillaTiempoFecha === null ? '-' : plantillaTiempoFecha;
    this.plantillaTiempoHora = plantillaTiempoHora === null ? '-' : plantillaTiempoHora;
  }
}
