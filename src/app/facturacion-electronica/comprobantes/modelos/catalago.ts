export class ItemCatalogo {
  codigo: string;
  descripcion: string;
  constructor(codigo: string, descripcion: string) {
    this.codigo = codigo;
    this.descripcion = descripcion;
  }
}

export class Catalogo {
  tipo: string;
  items: ItemCatalogo[];
  constructor(tipo:string, items: ItemCatalogo[]) {
    this.tipo = tipo;
    this.items = items;
  }
  getItem(codigo: string) {
    return this.items.find(item => item.codigo === codigo);
  }
}

export class Catalogos {
  catalogos: Catalogo[];
  constructor() {
  }

  getCatalogo(tipo: string) {
    return this.catalogos.find(item => item.tipo === tipo);
  }
}
