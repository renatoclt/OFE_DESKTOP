export class Entidad {
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: string;
  fechaModificacion: string;
  estado: string;
  id: string;
  idTipoEntidad: string;
  descripcionTipoEntidad: string;
  idEntidad: string;
  idTipoDocumento: string;
  tipoDocumento: string;
  recibirNotificaciones: string;
  ubigeo: string;
  pais: string;
  departamento: string;
  provincia: string;
  distrito: string;
  documento: string;
  denominacion: string;
  nombreComercial: string;
  direccionFiscal: string;
  correo: string;
  idComprobante: string;
  correoElectronico: string;
  solUsuario: string;
  solClave: string;
  certificadoDigitalClave: string;
  certificadoDigitalClaveLlave: string;
  logoCloud: string;
  logoTiempo: string;
  certificadoDigitalCloud: string;
  certificadoDigitalTiempo: string;
  plantillaFacturaInterfaz: string;
  plantillaFacturaCloud: string;
  plantillaFacturaTiempo: string;
  plantillaBoletaInterfaz: string;
  plantillaBoletaCloud: string;
  plantillaBoletaTiempo: string;
  plantillaNotaCreditoInterfaz: string;
  plantillaNotaCreditoCloud: string;
  plantillaNotaCreditoTiempo: string;
  plantillaNotaDebitoInterfaz: string;
  plantillaNotaDebitoCloud: string;
  plantillaNotaDebitoTiempo: string;
  plantillaGuiaRemisionInterfaz: string;
  plantillaGuiaRemisionCloud: string;
  plantillaGuiaRemisionTiempo: string;
  plantillaRetencionInterfaz: string;
  plantillaRetencionCloud: string;
  plantillaRetencionTiempo: string;
  plantillaPercepcionInterfaz: string;
  plantillaPercepcionCloud: string;
  plantillaPercepcionTiempo: string;
  constructor() {}
}


export class OrganizacionDTO{
  ruc: string;
  nombreComercial: string;
  correo: string;
  direccion: string;
  idTipoDocumento: string;
  tipoDocumento: string;
  constructor(){}
}