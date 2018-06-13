export class TipoProducto{
  nombre: string;
  codigo: number;

  constructor( nombre: string, codigo: number) {
    this.nombre = nombre;
    this.codigo = codigo;
  }
}

export const TIPO_PRODUCTO_BIEN = new TipoProducto('bien', 3);
export const TIPO_PRODUCTO_SERVICIO = new TipoProducto('servicio', 4);

export const TiposProductos = [
  TIPO_PRODUCTO_BIEN,
  TIPO_PRODUCTO_SERVICIO
];
