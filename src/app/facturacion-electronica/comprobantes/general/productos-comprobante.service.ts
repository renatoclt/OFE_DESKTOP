import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable()
export class ProductosComprobanteService {

    public items: Array<Producto> = [];
    public itemEditar: Producto = new Producto();
    constructor() {
        // this.items = null;
    }

    public agregarItem( item: Producto ) {
        this.items.push( item );
    }
    public getItems(): Array<Producto> {
        return this.items;
    }
    public setItemEditar( item: Producto ) {
        this.itemEditar = item;
    }
    public getItemEditar() {
        return this.itemEditar;
    }

}
