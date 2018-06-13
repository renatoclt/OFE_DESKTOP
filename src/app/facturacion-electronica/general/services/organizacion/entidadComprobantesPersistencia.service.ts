import {Entidad} from '../../models/organizacion/entidad';
import {Injectable} from '@angular/core';
import {PersistenceService, StorageType} from 'angular-persistence';

@Injectable()
export class EntidadComprobantesPersistenciaService {
  entidad: Entidad;

  constructor(private _persistenciaService: PersistenceService) {

  }
  public  setEntidad(entidad: Entidad, nombreGuardadoEnLocal: string) {
    this._persistenciaService.remove(nombreGuardadoEnLocal, StorageType.LOCAL);
    this._persistenciaService.set(nombreGuardadoEnLocal, entidad, {type: StorageType.LOCAL, timeout: 3600000});
  }
  public  getEntidad(nombreGuardadoEnLocal: string): Entidad {
    let item: Entidad;
    item = this._persistenciaService.get(nombreGuardadoEnLocal, StorageType.LOCAL);
    if ( item === undefined ) {
      return null;
    }
    return item;
  }
}
