import { Injectable } from '@angular/core';
import { Injectable } from '@angular/core';
import { PersistenceService, StorageType } from 'angular-persistence';
import {Entidad} from '../../general/models/organizacion/entidad';


@Injectable()
export class PersistenciaEntidadService {

  public documentoEntidad: Entidad = new Entidad();

  constructor(private persistenceService: PersistenceService) {
  }


  public  setEntidad(entidad: Entidad) {
    this.persistenceService.remove('entidad', StorageType.LOCAL);
    this.persistenceService.set('entidad', entidad, {type: StorageType.LOCAL, timeout: 3600000});
  }
  public  getEntidad(): Entidad {
    let item: Entidad;
    item = this.persistenceService.get('entidad', StorageType.LOCAL);
    if ( item == undefined ) {
      return null;
    }
    return item;
  }

  public  eliminar() {
    this.persistenceService.remove('entidad', StorageType.LOCAL);
  }
}
