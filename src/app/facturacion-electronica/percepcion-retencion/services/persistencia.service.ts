import { Injectable } from '@angular/core';
import { PersistenceService, StorageType } from 'angular-persistence';
import {Retencionebiz} from '../models/retencionebiz';

@Injectable()
export class PersistenciaServiceRetencion {

    public lista: Retencionebiz[] = [];
    constructor (
        private persistenceService: PersistenceService
    ) {}

    public agregarProducto( item: Retencionebiz ) {
        this.lista = this.getListaProductos();
        item.id =  this.lista.length.toString();
        this.lista.push( item );
        this.persistenceService.remove('listaretencion', StorageType.LOCAL);
        this.persistenceService.set('listaretencion', this.lista,  {type: StorageType.LOCAL, timeout: 3600000});
    }

    public getListaProductos(): any {
        let lista: Retencionebiz[];
        lista = this.persistenceService.get('listaretencion', StorageType.LOCAL);
        if ( lista === undefined ) {
            return [];
        }
        return lista;
    }

  public setListaProductos( lista: Retencionebiz[] ) {
    this.persistenceService.remove('listaretencion', StorageType.LOCAL);
    this.persistenceService.set('listaretencion', lista,  {type: StorageType.LOCAL, timeout: 3600000}, );
  }

  public getItemProducto( index: number ): Retencionebiz {
    this.lista = this.getListaProductos();
    return this.lista[index];
  }

  public editarProducto( item: Retencionebiz, posicion: number ) {
    this.lista = this.getListaProductos();
    if ( this.lista.length === 0 ) {
      return;
    }
    item.id = this.lista[ posicion ].id;
    this.lista[ posicion ] = item;
    this.persistenceService.remove('listaretencion', StorageType.LOCAL);
    this.persistenceService.set('listaretencion', this.lista,  {type: StorageType.LOCAL}, );
  }

    public mostrar() {
    }

    public eliminar( listaTmp: Retencionebiz[] ) {
        this.persistenceService.remove('listaretencion', StorageType.LOCAL);
        this.persistenceService.set('listaretencion', listaTmp,  {type: StorageType.LOCAL});
    }

    public vaciar_data() {
      this.persistenceService.remove('listaretencion', StorageType.LOCAL);
    }
    /**
     * Metodo que envia UUID de Retencion de Consultas
     */
    public setUUIDConsultaRetencion ( uuid: string ) {
        this.persistenceService.remove('UUIDConsultaRetencion', StorageType.LOCAL);
        this.persistenceService.set('UUIDConsultaRetencion', uuid, {type: StorageType.LOCAL, timeout: 3600000});
    }
    public getUUIDConsultaRetenecion (): string {
        let uuid: string;
        uuid = this.persistenceService.get('UUIDConsultaRetencion', StorageType.LOCAL);
        if ( uuid === undefined ) {
            return null;
        }
        return uuid;
    }
}
