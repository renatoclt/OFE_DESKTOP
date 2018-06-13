import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Servidores} from '../servidores';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SpinnerService} from '../../../../service/spinner.service';
import {ProductosIndividuales} from '../../../bienes-servicios/models/productosIndividuales';
import {BasePaginacion} from '../base.paginacion';
import {ProductoQry} from '../../models/productos/producto';
import {PrecioPipe} from '../../pipes/precio.pipe';
import {ProductoUpdate} from '../../models/productos/producto-update';
declare var swal: any;
@Injectable()

export class ProductoServices {
  private pathProductoCmd: string;
  private urlProductoCmd: string;

  private pathProductos: string;
  private pathSearch: string;
  private pathFiltros: string;
  private pathCodigos: string;
  private pathEliminarProductos: string;

  private paginaBusqueda: number;
  private limiteBusqueda: number;

  private urlCodigoQry: string;
  private urlFiltroQry: string;
  private urlEliminarProductos: string;

  public TIPO_ATRIBUTO_FILTRO_QRY: string;

  public itemAEditar: BehaviorSubject<ProductoQry>;

  constructor( private httpClient: HttpClient,
               private servidores: Servidores,
               private _spinnerService: SpinnerService,
               private _precioPipe: PrecioPipe) {
    this.itemAEditar = new BehaviorSubject(null);
    this.pathProductoCmd = '/productos';
    this.urlProductoCmd = this.servidores.HOSTLOCAL + this.pathProductoCmd;

    this.pathProductos = '/productos';
    this.pathSearch = '/search';
    this.pathFiltros = '/filtros';
    this.pathCodigos = '/codigos';
    this.pathEliminarProductos = '/productos';

    this.paginaBusqueda = 0;
    this.limiteBusqueda = 10;

    this.TIPO_ATRIBUTO_FILTRO_QRY = 'productos';

    this.urlCodigoQry = servidores.HOSTLOCAL + this.pathProductos + this.pathSearch + this.pathCodigos;
    this.urlFiltroQry = this.servidores.HOSTLOCAL + this.pathProductos + this.pathSearch + this.pathFiltros;
    this.urlEliminarProductos = this.servidores.HOSTLOCAL + this.pathEliminarProductos;
  }

  subirProcutoIndividual(producto: ProductosIndividuales) {
    this._spinnerService.set(true);
    this.httpClient.post(this.urlProductoCmd, producto)
      .subscribe(
        data => {
          this._spinnerService.set(false);
          swal({
            type: 'success',
            title: 'Acción Exitosa',
            html:
              '<div class="text-center">El Producto se creó exitósamente.</div>',
            confirmButtonClass: 'btn btn-success',
            confirmButtonText: 'Sí',
            buttonsStyling: false
          });
        },
        error => {
          this._spinnerService.set(false);
          swal({
            type: 'error',
            title: error.error.message,
            confirmButtonClass: 'btn btn-danger',
            buttonsStyling: false
          });
        }
      );
  }

  buscarPorCodigo(codigo: string, pagina: number = this.paginaBusqueda, limite: number = this.limiteBusqueda): BehaviorSubject<ProductoQry[]> {
    const productosLista = new BehaviorSubject<ProductoQry[]>([]);
    const parametros = new HttpParams()
      .set('codigo', codigo)
      .set('pagina', pagina.toString())
      .set('limite', limite.toString())
    this.httpClient.get<ProductoQry[]>(this.urlCodigoQry, {
      params: parametros
    }).subscribe(
      data => {
        productosLista.next(data['_embedded']['productos']);
      }
    );
    return productosLista;
  }

  get<T>(
    parametros: HttpParams, url: string = this.urlFiltroQry, nombreKeyJson: string = this.TIPO_ATRIBUTO_FILTRO_QRY
  ): BehaviorSubject<[BasePaginacion, T[]]> {
    this._spinnerService.set(true);
    const number = Number(url);
    if (number >= 0) {
      parametros = parametros.set('pagina', number.toString());
    } else {
      parametros = parametros.set('pagina', parametros.get('page'));
    }
    parametros = parametros.set('limite', parametros.get('size'));
    parametros = parametros.set('ordenar', 'codigo');
    parametros = parametros.delete('page');
    parametros = parametros.delete('size');
    parametros = parametros.delete('sort');
    let nuevaUrl = this.urlFiltroQry;
    if ( nombreKeyJson === this.TIPO_ATRIBUTO_FILTRO_QRY) {
      nuevaUrl = this.urlFiltroQry;
    }
    const basePaginacion: BasePaginacion = new BasePaginacion();
    const dataRetornar: BehaviorSubject<[BasePaginacion, T[]]> = new BehaviorSubject<[BasePaginacion, T[]]>([basePaginacion, []]);
    this.httpClient.get<T[]>( nuevaUrl, {
      params: parametros
    })
      .take(1)
      .map(
        data => {
          data['_embedded'][nombreKeyJson].map(
            item => {
              item['precioUnitario'] = this._precioPipe.transform(item['precioUnitario']);
              item['montoIsc'] = this._precioPipe.transform(item['montoIsc']);
              item['unidadMedida'] = item['unidadMedida'].trim();
            }
          );
          return data;
        }
      )
      .subscribe(
      (data) => {
        this._spinnerService.set(false);
        const totalPaginas = data['page']['totalPages'] - 1;
        const paginaActual = data['page']['number'];

        basePaginacion.pagina.next( paginaActual );
        basePaginacion.totalItems.next(data['page']['totalElements']);
        basePaginacion.totalPaginas.next(totalPaginas);

        if ( (paginaActual + 1) <= totalPaginas) {
          basePaginacion.next.next((paginaActual + 1).toString());
        } else {
          basePaginacion.next.next('');
        }
        basePaginacion.last.next((totalPaginas).toString());
        basePaginacion.first.next('0');
        if ( (paginaActual - 1) >= 0) {
          basePaginacion.previous.next((paginaActual - 1).toString());
        } else {
          basePaginacion.previous.next('');
        }
        dataRetornar.next([basePaginacion, data['_embedded'][nombreKeyJson]]);
      },
      error => {
        this._spinnerService.set(false);
      }
    );
    return dataRetornar;
  }

  actualizarProducto(productoUpdate: ProductoUpdate) {
    this._spinnerService.set(true);
    this.httpClient.put<ProductoUpdate>(this.urlProductoCmd, JSON.stringify(productoUpdate)).subscribe(
      data => {
        this._spinnerService.set(false);
        swal({
          type: 'success',
          title: 'Acción Exitosa',
          html:
            '<div class="text-center">El Producto se guardo exitósamente.</div>',
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'Sí',
          buttonsStyling: false
        });
      },
      error => {
        this._spinnerService.set(false);
        swal({
          type: 'error',
          title: 'No se pudo guardar el producto. Inténtelo en otro momento.',
          confirmButtonClass: 'btn btn-danger',
          buttonsStyling: false
        });
      }
    );
  }

  eliminarEnMasa(productos: ProductoQry[]) {
    let idsProductos = '';
    for (const producto of productos) {
      idsProductos += producto.id + ',';
    }
    const respuesta = new BehaviorSubject<boolean>(false);
    idsProductos = idsProductos.slice(0, -1);

    this._spinnerService.set(true);
    const parametros = new HttpParams()
      .set('ids', idsProductos);
    this.httpClient.delete(this.urlEliminarProductos, {
      params: parametros
    } ).subscribe(
      data => {
        this._spinnerService.set(false);
        swal({
          type: 'success',
          title: 'Acción Exitosa',
          html:
            '<div class="text-center">Se eliminaron los productos.</div>',
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'Sí',
          buttonsStyling: false
        });
        respuesta.next(true);
      },
      error => {
        this._spinnerService.set(false);
        swal({
          type: 'error',
          title: 'No se pudo eliminar el(los) producto(s). Inténtelo en otro momento.',
          confirmButtonClass: 'btn btn-danger',
          buttonsStyling: false
        });
        respuesta.next(false);
      }
    );
    return respuesta;
  }

}
