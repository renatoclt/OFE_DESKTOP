export class ArchivoSubir {
  documento: string;
  denominacion: string;
  direccion: string;
  correoElectronico: string;
  idTipoDocumento: string;
  pais: string;
  ubigeo: string;
  certificadoDigitalData: string;
  certificadoDigitalClave: string;
  certificadoDigitalTiempo: string;
  certificadoDigitalClaveLlave: string;
  plantillaFacturaData: string;
  plantillaFacturaTiempo: number;
  plantillaFacturaNombre: string;
  plantillaBoletaData: string;
  plantillaBoletaTiempo: number;
  plantillaBoletaNombre: string;
  plantillaNotaCreditoData: string;
  plantillaNotaCreditoTiempo: number;
  plantillaNotaCreditoNombre: string;
  plantillaNotaDebitoData: string;
  plantillaNotaDebitoTiempo: number;
  plantillaNotaDebitoNombre: string;
  plantillaPercepcionData: string;
  plantillaPercepcionTiempo: number;
  plantillaPercepcionNombre: string;
  plantillaRetencionData: string;
  plantillaRetencionTiempo: number;
  plantillaRetencionNombre: string;
  logoData: string;
  logoTiempo: string;
  solUsuario: string;
  solClave: string;
  recibirNotificaciones: string;
  estado: string;

  constructor() {}

  cargarCertificado(documento: string, certificadoDigitalData: string) {
    this.documento = documento;
    this.certificadoDigitalData = certificadoDigitalData;
  }

  cargarFactura(documento: string, plantillaFacturaData: string, fecha: number, nombre_archivo: string) {
    this.documento = documento;
    this.plantillaFacturaData = plantillaFacturaData;
    this.plantillaFacturaTiempo = fecha;
    this.plantillaFacturaNombre = nombre_archivo;
  }

  cargarBoleta(documento: string, plantillaBoletaData: string, fecha: number, nombre_archivo: string) {
    this.documento = documento;
    this.plantillaBoletaData = plantillaBoletaData;
    this.plantillaBoletaTiempo = fecha;
    this.plantillaBoletaNombre = nombre_archivo;
  }

  cargarNotaCredito(documento: string, plantillaNotaCreditoData: string, fecha: number, nombre_archivo: string) {
    this.documento = documento;
    this.plantillaNotaCreditoData = plantillaNotaCreditoData;
    this.plantillaNotaCreditoTiempo = fecha;
    this.plantillaNotaCreditoNombre = nombre_archivo;
  }

  cargarNotaDebito(documento: string, plantillaNotaDebitoData: string, fecha: number, nombre_archivo: string) {
    this.documento = documento;
    this.plantillaNotaDebitoData = plantillaNotaDebitoData;
    this.plantillaNotaDebitoTiempo = fecha;
    this.plantillaNotaDebitoNombre = nombre_archivo;
  }

  cargarPercepcion(documento: string, plantillaPercepcionData: string, fecha: number, nombre_archivo: string) {
    this.documento = documento;
    this.plantillaPercepcionData = plantillaPercepcionData;
    this.plantillaPercepcionTiempo = fecha;
    this.plantillaPercepcionNombre = nombre_archivo;
  }

  cargarRetencion(documento: string, plantillaRetncionData: string, fecha: number, nombre_archivo: string) {
    this.documento = documento;
    this.plantillaRetencionData = plantillaRetncionData;
    this.plantillaRetencionTiempo = fecha;
    this.plantillaRetencionNombre = nombre_archivo;
  }

  cargarLogo(documento: string, logoData: string) {
    this.documento = documento;
    this.logoData = logoData;
  }

  cargarDatosEmpresa(documento: string, correoElectronico: string, solUsuario: string, solClave: string,
                     certificadoDigitalClave: string, certificadoDigitalClaveLlave: string, recibirNotificaciones: string) {
    this.documento = documento;
    this.correoElectronico = correoElectronico;
    this.solUsuario = solUsuario;
    this.solClave = solClave;
    this.certificadoDigitalClave = certificadoDigitalClave;
    this.certificadoDigitalClaveLlave = certificadoDigitalClaveLlave;
    this.recibirNotificaciones = recibirNotificaciones;
  }

}

