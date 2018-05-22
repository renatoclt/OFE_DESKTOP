import {Injectable} from '@angular/core';
import {PersistenceService, StorageType} from 'angular-persistence';

@Injectable()
export class PersistenciaDatosService<T> {
  nombrePersistencia: string;

  constructor(private _persistenciaService: PersistenceService) {
    this.nombrePersistencia = '';
  }

  public agregar(data: T| T[]) {
    this.eliminar();
    this._persistenciaService.set(this.nombrePersistencia, data, {type: StorageType.LOCAL, timeout: 3600000});
  }

  public obtener(): T | T[] {
    const data = this._persistenciaService.get(this.nombrePersistencia, StorageType.LOCAL);
    if ( data === undefined ) {
      return null;
    }
    return data;
  }

  public eliminar() {
    this._persistenciaService.remove(this.nombrePersistencia, StorageType.LOCAL);
  }

  public agregarItem(item: T) {
    const nuevaData = this.obtener();
    if (nuevaData instanceof Array) {
      nuevaData.push(item);
    }
    this.agregar(nuevaData);
  }
}
