import { Injectable } from '@angular/core';
import { PersistenceService, StorageType } from 'angular-persistence';

import {RetencionCabecera} from '../models/retencion-cabecera';
import {ConsultaDocumentoRelacionado} from '../../general/models/consultaDocumentoRelacionado';

@Injectable()
export class RetencionpersiscabeceraService {

  public listacabecera: RetencionCabecera = new RetencionCabecera();

  constructor(private persistenceService: PersistenceService) {
  }


  public  setCabeceraRetencion(cabecera: RetencionCabecera) {
    this.persistenceService.remove('retencioncabecera', StorageType.LOCAL);
    this.persistenceService.set('retencioncabecera', cabecera, {type: StorageType.LOCAL, timeout: 3600000});
  }
  public  getCabeceraRetencion(): RetencionCabecera {
    let item: RetencionCabecera;
    item = this.persistenceService.get('retencioncabecera', StorageType.LOCAL);
    if ( item == undefined ) {
      return null;
    }
    return item;
  }

  public vaciar_data() {
    this.persistenceService.remove('retencioncabecera', StorageType.LOCAL);
  }
}
