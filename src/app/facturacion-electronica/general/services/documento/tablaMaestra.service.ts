import {Injectable} from '@angular/core';
import {Servidores} from '../servidores';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TABLA_MAESTRA_TIPO_DOCUMENTO, ID_ENTIDAD_DEFECTO , TablaMaestra, TABLA_MAESTRA_UNIDADES_MEDIDA} from '../../models/documento/tablaMaestra';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { error } from 'util';
import { SpinnerService } from 'app/service/spinner.service';

@Injectable()
export class TablaMaestraService {
  private url: string = '/maestra';
  private buscar: string = '/search';
  private filtro: string = '/filtros';
  private filtrosEspeciales: string = '/filtros';

  constructor(private servidores: Servidores,
              private httpClient: HttpClient,
              private _spinner: SpinnerService
            ) {
    this.url = this.servidores.HOSTLOCAL + this.url;
  }

  obtenerTodoTablaMaestra(): BehaviorSubject<TablaMaestra[]> {
  const listaTablaMaestra: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
    this.httpClient.get<TablaMaestra[]>(this.url).take(1).subscribe(
      data => {
          listaTablaMaestra.next(data['_embedded']['maestraRedises']);
      }
    );

    return listaTablaMaestra;
  }

  obtenerPorIdTabla(id: number): BehaviorSubject<TablaMaestra[]> {
    const listaTablaMaestra: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
    // const parametros = new HttpParams()
    //   .set('tabla', id.toString())
    //   .set('idEntidadDefecto', ID_ENTIDAD_DEFECTO);

    let parametros;
    let urlConsulta: string;
    if (id === TABLA_MAESTRA_UNIDADES_MEDIDA) {
        parametros = new HttpParams()
            .set('tabla', id.toString())
            .set('idEntidadDefecto', ID_ENTIDAD_DEFECTO)
        urlConsulta = this.url + this.buscar + this.filtrosEspeciales;
    } else {
        parametros = new HttpParams()
            .set('tabla', id.toString());
        urlConsulta = this.url + this.buscar + this.filtro;
    }
    this._spinner.set(true);
    this.httpClient.get<TablaMaestra[]>(urlConsulta, {
      params: parametros
    }).take(1).subscribe(
      data => {
        listaTablaMaestra.next(data['_embedded']['maestraRedises']);
        this._spinner.set(false);
      },
      error => {
        this._spinner.set(false);
      }
    );
    return listaTablaMaestra;
  }

  obtenerPorCodigosDeTablaMaestra(listaItems: BehaviorSubject<TablaMaestra[]>, listaCodigos: string[]): BehaviorSubject<TablaMaestra[]> {
    const listaNuevaItems: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
    listaItems.map(
      items => items.filter(item => listaCodigos.includes(item.codigo))
    ).subscribe(
      data => {
        listaNuevaItems.next( data);
      }
    );
    return listaNuevaItems;
  }

  obtenerPorCodigosDeTablaMaestraHardCode(listaItems: BehaviorSubject<TablaMaestra[]>, listaCodigos: string[]): BehaviorSubject<TablaMaestra[]> {
    const listaNuevaItems: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
    listaItems.map(
      items => items.filter(item => listaCodigos.includes(item.codigo))
    ).subscribe(
      data => {
        const facturaAnticipo = new TablaMaestra();
        facturaAnticipo.habilitado = true;
        facturaAnticipo.tabla = TABLA_MAESTRA_TIPO_DOCUMENTO;
        facturaAnticipo.codigo = 'AF';
        facturaAnticipo.descripcionCorta = 'Factura de Anticipo';
        facturaAnticipo.descripcionLarga = 'Factura de Anticipo';
        const boletaAnticipo = new TablaMaestra();
        boletaAnticipo.habilitado = true;
        boletaAnticipo.tabla = TABLA_MAESTRA_TIPO_DOCUMENTO;
        boletaAnticipo.codigo = 'AB';
        boletaAnticipo.descripcionCorta = 'Boleta de Anticipo';
        boletaAnticipo.descripcionLarga = 'Boleta de Anticipo';
        data.push(facturaAnticipo);
        data.push(boletaAnticipo);
        listaNuevaItems.next( data);
      }
    );
    return listaNuevaItems;
  }

  obtenerPorCodigoDeTablaMaestra(listaItems: BehaviorSubject<TablaMaestra[]>, codigo: string): BehaviorSubject<TablaMaestra> {
    const itemRetornar: BehaviorSubject<TablaMaestra> = new BehaviorSubject<TablaMaestra>(null);
    listaItems.map(
      items => items.filter(item => item.codigo === codigo)
    ).subscribe(
      data => {
        if (data) {
          itemRetornar.next(data[0]);
        }
      }
    );
    return itemRetornar;
  }

  obtenerPorAtributoDeTablaMaestra(listaItems: BehaviorSubject<TablaMaestra[]>, listaCodigos: string[], atributo: string): BehaviorSubject<TablaMaestra[]> {
    const listaNuevaItems: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
    listaItems.map(
      items => items.filter(item => listaCodigos.includes(item[atributo]))
    ).subscribe(
      data => {
        listaNuevaItems.next( data);
      }
    );
    return listaNuevaItems;
  }


}
