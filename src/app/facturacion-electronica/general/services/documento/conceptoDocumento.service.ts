import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Servidores} from '../servidores';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ConceptoDocumento} from '../../models/documento/conceptoDocumento';
import {TablaMaestra} from '../../models/documento/tablaMaestra';
import { OrganizacionDTO } from '../../models/organizacion/entidad';

@Injectable()
export class ConceptoDocumentoService {
  url: string = '/concepto';

  constructor( private httpClient: HttpClient,
               private servidores: Servidores) {
    this.url = this.servidores.HOSTLOCAL + this.url;
  }

  obtenerTodosConceptosDocumentos(): BehaviorSubject<ConceptoDocumento[]> {
    const conceptoDocumento: BehaviorSubject<ConceptoDocumento[]> = new BehaviorSubject<ConceptoDocumento[]>([]);
    this.httpClient.get<ConceptoDocumento[]>(this.url).subscribe(
      data => {
        conceptoDocumento.next(data['_embedded']['conceptoRedises']);
      }
    );
    return conceptoDocumento;
  }

  obtenerPorCodigos(listaItems: BehaviorSubject<ConceptoDocumento[]>, listaCodigos: string[]): BehaviorSubject<ConceptoDocumento[]> {
    const listaNuevaItems: BehaviorSubject<ConceptoDocumento[]> = new BehaviorSubject<ConceptoDocumento[]>([]);
    listaItems.map(
      items => items.filter(item => listaCodigos.includes(item.codigo))
    ).subscribe(
      data => {
        listaNuevaItems.next( data);
      }
    );
    return listaNuevaItems;
  }

  public guardarOrganizacion(organizacion : OrganizacionDTO){
    let urlGuardarOrganizacion: string =  this.servidores.HOSTLOCAL + '/entidad/guardarEntidad';
    let organizacionRpta: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    this.httpClient.post<OrganizacionDTO>(urlGuardarOrganizacion, organizacion ).subscribe();
    return organizacionRpta;
  }
}
