import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class DataTableServicio<T> {
  data: BehaviorSubject<T[]>;

  constructor() {
    this.data = new BehaviorSubject<T[]>([]);
  }

  getData() {
    return this.data.value.slice();
  }

  setData(data: T[]) {
    this.data.next(data);
  }

  getRango(inicio: number, fin: number) {
    return new BehaviorSubject<T[]>(this.getData().slice(inicio,fin));
  }

  ordenar(orden: string) {
    const ordenTemp = orden.split(',');
    const atributo = ordenTemp[0];
    const tipoOrdenamiento= ordenTemp[1];
    if(atributo){
      this.data.value.sort(
        (item1, item2) => {
          if (tipoOrdenamiento == 'desc') {
            const itemTemp = item1;
            item1 = item2;
            item2 = itemTemp;
          }
          if (this.obtenerValorItem(item1, atributo) > this.obtenerValorItem(item2, atributo)) {
            return 1;
          }
          else {
            return -1;
          }
        }
      );
    }
    else{
      this.data.next(this.data.value.reverse());
    }
  }

  obtenerValorItem(item: T, atributo: string) {
    const partes = atributo.split('.');
    const tam = partes.length;
    let valorItem = item[partes[0]];
    let i = 1;
    for(i; i < tam; i++){
      valorItem = valorItem[partes[i]];
    }
    return valorItem;
  }

  eliminarTodos() {
    this.data.next([]);
  }

  eliminarMasa(items: T[], nombreIdDelItem: string) {
    for(let item of items)
      this.eliminarItem(item, nombreIdDelItem);
  }

  eliminarItem(item: T, nombreIdDelItem: string) {
    const index = this.data.value.findIndex(itemTemp => itemTemp[nombreIdDelItem] === item[nombreIdDelItem]);
    this.data.value.splice(index,1);
    const tamanioData = this.data.value.length;
    let posicion = index;
    while( posicion < tamanioData){
      this.data.value[posicion][nombreIdDelItem] = posicion;
      posicion +=1;
    }
  }

}
