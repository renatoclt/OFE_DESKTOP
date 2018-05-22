import {Person} from '../../comprobantes/factura/factura.component';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {BasePaginacion} from './base.paginacion';
import {Servidores} from './servidores';

@Injectable()
export class PersonService{
  data: BehaviorSubject<Person[]>;
  url: string = '/people';

  constructor(private httpClient: HttpClient,
              private servidores: Servidores,
              public paginacion: BasePaginacion) {
    this.url = this.servidores.server+ this.url;
    this.data = new BehaviorSubject<Person[]>([]);
    this.paginacion = new BasePaginacion();
  }

  get(params: HttpParams, url: string = this.url){
    const that = this;
    this.httpClient.get<Person[]>(url, {
      params: params
    }).take(1).
    subscribe(
      (data) => {
        that.data.next(data['_embedded']['people']);
        that.paginacion.pagina.next(data['page']['number']);
        that.paginacion.totalItems.next(data['page']['totalElements']);
        that.paginacion.totalPaginas.next(data['page']['totalPages'] - 1);
        if (data['_links']['next']) {
          that.paginacion.next.next(data['_links']['next']['href']);
        }
        else{
          that.paginacion.next.next('');
        }
        if (data['_links']['last']) {
          that.paginacion.last.next(data['_links']['last']['href']);
        }
        else{
          that.paginacion.last.next('');
        }
        if (data['_links']['first']){
          that.paginacion.first.next(data['_links']['first']['href']);
        }
        else{
          that.paginacion.first.next('');
        }
        if(data['_links']['prev']) {
          that.paginacion.previous.next(data['_links']['prev']['href']);
        }
        else{
          that.paginacion.previous.next('');
        }
      }
    );
  }
}
