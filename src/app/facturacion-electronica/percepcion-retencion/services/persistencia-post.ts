import { Injectable } from '@angular/core';
import { PersistenceService, StorageType } from 'angular-persistence';
import {RetencionCabecera} from '../models/retencion-cabecera';
import {Post_retencion} from '../models/post_retencion';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Entidad} from '../../general/models/organizacion/entidad';


@Injectable()
export class PersistenciaPost {

  public postpersistencia: Post_retencion = new Post_retencion();

  constructor(private persistenceService: PersistenceService) {
  }


  public setPostRetencion(post: Post_retencion) {
    this.persistenceService.remove('post_retencion', StorageType.LOCAL);
    this.persistenceService.set('post_retencion', post, {type: StorageType.LOCAL, timeout: 3600000});
  }
  public  getPostRetencion(): BehaviorSubject<Post_retencion> {
    let item: Post_retencion;
    const DataPost: BehaviorSubject<Post_retencion> = new BehaviorSubject<Post_retencion>(new Post_retencion());

    item = this.persistenceService.get('post_retencion', StorageType.LOCAL);
    if ( item == undefined ) {
      return null;
    }
    DataPost.next(item);
    return DataPost;
  }

  public  getPostNormal(): Post_retencion {
    let item: Post_retencion;
    item = this.persistenceService.get('post_retencion', StorageType.LOCAL);
    if ( item == undefined ) {
      return null;
    }
    return item;
  }

  public removePostRetencion() {
    this.persistenceService.remove('post_retencion', StorageType.LOCAL);
  }
}
