export class TipoBienServicio {
  id: number;
  codigo: string;
  descripcion: string;
  constructor(id: number, codigo: string, descripccion: string) {
    this.id = id;
    this.codigo = codigo;
    this.descripcion = descripccion;
  }
}
