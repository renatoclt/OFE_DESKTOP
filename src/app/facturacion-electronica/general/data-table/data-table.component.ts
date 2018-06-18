import {
  AfterViewInit,
  Component, EventEmitter,
  Input, OnDestroy,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {DataTableDirective} from 'angular-datatables';
import {DataTableServicio} from './servicios/dataTableServicio';
import {Subject} from 'rxjs/Subject';
import {BasePaginacion} from '../services/base.paginacion';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Accion} from './utils/accion';
import {ModoVistaAccion} from './utils/modo-vista-accion';
import {TipoAccion} from './utils/tipo-accion';
import {TipoBotonAgregar} from './utils/tipoBotonAgregar';
import {TipoProducto, TiposProductos} from './utils/tipoProducto';
import {TranslateService} from '@ngx-translate/core';
import {ColumnaDataTable} from './utils/columna-data-table';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  TIPOS_ESTADOS: string[];

  itemsSeleccionados: T[];
  checkTodos: boolean;

  dataTemporal: BehaviorSubject<T[]>;

  @Input() columnas: ColumnaDataTable[];

  @Input() ordenarPorElCampo: string;
  @Input() ordenarAscendente: boolean;

  @Input('idTabla') idTabla: string;

  @Input() nombreIdDelItem: string;
  @Output() iniciarData = new EventEmitter<boolean>();

  @Input() usaServicio: boolean;
  @Input() servicio: any;
  @Input() parametros: HttpParams;
  @Input() tipoAtributoServicio: string;
  @Input() urlServicio: string;

  @Input() habilitarCheckBox: boolean;
  @Input() habilitarAcciones: boolean;
  ModoVistaAccion = ModoVistaAccion;
  @Input() tipoAccion: ModoVistaAccion = ModoVistaAccion.ICONOS;
  @Input() acciones: Accion[];

  @Input() agregarEventoClick: boolean;
  @Input() atributosConEvento: string[];

  @Input() habilitarAgregar: boolean;
  @Input() habilitarEliminar: boolean;
  @Input() habilitarSeleccionar: boolean;
  @Input() habilitarBotonGenerico: boolean;
  //  Valor por defecto false, para que no este deshabilitado por ser un boton de uso general
  @Input() habilitarFuncionalidadGenerico: boolean;
  //  @Input() habilitarFuncionalidadSeleccionar: boolean;
  @Input() habilitarFuncionalidadAgregar: boolean;
  @Input() botonGenericoLabel: string;
  TipoBotonAgregar = TipoBotonAgregar;
  @Input() tipoBotonAgregar = TipoBotonAgregar.NORMAL;
  tiposProductos: TipoProducto[] = TiposProductos;
  @Output() tipoProductoSeleccionado = new EventEmitter<TipoProducto>();

  @Output() eliminar = new EventEmitter<T[]>();
  @Output() bitacora = new EventEmitter<number>();
  @Output() agregar = new EventEmitter<boolean>();
  @Output() accion = new EventEmitter<[TipoAccion, T]>();
  @Output() eventoLanzado = new EventEmitter<[T, string]>();
  @Output() generico = new EventEmitter<T[]>();
  @Output() seleccionarItemsTabla = new EventEmitter<T[]>();

  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<T[]> = new Subject<T[]>();

  ordenarIndexAscendente: boolean;
  iteradorAtributoTipoDeAccion: number;

  TipoAccion = TipoAccion;

  paginacion: BasePaginacion;

  @Input() pintarFilas: boolean;
  @Input() nombreCampoParaPintarFilas: string;

  constructor(public dataTableServicio: DataTableServicio<T>,
              public translateService: TranslateService) {
    this.dataTableServicio = new DataTableServicio<T>();
    this.dataTemporal = new BehaviorSubject<T[]>([]);
    this.TIPOS_ESTADOS = ['procesado', 'conError', 'enProceso', 'errorSesion', 'errorSunat'];
    this.itemsSeleccionados = [];
    this.parametros = new HttpParams();
    this.paginacion = new BasePaginacion();
    this.iteradorAtributoTipoDeAccion = 0;
    this.checkTodos = false;
    this.nombreIdDelItem = 'id';
    this.usaServicio = false;
    this.tipoAtributoServicio = '';
    this.urlServicio = '';
    this.habilitarCheckBox = false;
    this.habilitarAcciones = false;
    this.habilitarAgregar = false;
    this.habilitarSeleccionar = false;
    //  this.habilitarFuncionalidadSeleccionar = false;
    this.habilitarFuncionalidadAgregar = true;
    this.habilitarFuncionalidadGenerico = false;
    this.habilitarEliminar = false;
    this.habilitarBotonGenerico = false;
    this.ordenarIndexAscendente = true;
    this.pintarFilas = false;
    this.nombreCampoParaPintarFilas = '';
    this.parametros = new HttpParams();
    this.botonGenericoLabel = 'Ingrese Nombre Boton';
    this.ordenarAscendente = false;
  }

  ngOnInit() {
    this.iniciar();
  }

  ngOnDestroy() {
    this.dataTableServicio = new DataTableServicio<T>();
    this.paginacion = new BasePaginacion();
  }
  ngAfterViewInit() {
    this.dtTrigger.next();
    setTimeout((() => {
      this.iniciarData.emit(true);
    }), 0);

    this.eventosDataTable();
  }

  eventosDataTable() {
    const that = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('order', function () {
        const order = dtInstance.order();
        if ( order !== [] && order[0] !== undefined) {
          const atributo = Number(order[0][0]);
          let len: number = that.columnas.length + 1;
          if (that.habilitarCheckBox) {
            len += 1;
            if (atributo > 0 && atributo < len) {
              if (atributo - 2 >= 0) {
                that.paginacion.orden.next(that.columnas[(atributo - 2)].atributo + ',' + order[0][1]);
                that.ordenarIndexAscendente = true;

              } else {
                that.paginacion.orden.next(',' + order[0][1]);
                that.ordenarIndexAscendente = !that.ordenarIndexAscendente;
              }
            }
          } else {
            if (atributo >= 0 && atributo < len) {
              that.paginacion.orden.next(that.columnas[(atributo - 1)].atributo + ',' + order[0][1]);
            }
          }
          that.cargarData();
        }
      } );
      dtInstance.on('length', function (e, settings, len) {
        const total = that.paginacion.totalItems.getValue();
        if (len === -1) {
          that.paginacion.tamanio.next(total);
          that.paginacion.pagina.next(0);
        } else {
          that.paginacion.tamanio.next(len);
          that.paginacion.pagina.next(0);
        }
        that.cargarData();
      });
    });
  }
  iniciar() {
    const that = this;
    let orden = this.columnas.findIndex( item => item.atributo === this.ordenarPorElCampo);
    orden = orden === -1 ? 0 : orden;
    const tamanio = that.paginacion.tamanio.value;
    this.dtOptions = {
      lengthMenu: [[10, 20, 30, -1], [10, 20, 30, 'Todos']],
      responsive: true,
      pagelenght: tamanio,
      processing: false,
      paging: true,
      info: true,
      searching: false,
      serverSide: false,
      order: [that.habilitarCheckBox ? orden + 2 : orden + 1 , that.ordenarAscendente ? 'asc' : 'desc'],
        'infoCallback': function() {
        return that.redibujarPieDePagina();
      }
    };
    this.inicializarPaginacion();
  }

  redibujarPieDePagina(): string {

    const pagina = this.paginacion.pagina.getValue();
    const tamanio = this.paginacion.tamanio.getValue();
    const totalItems = this.paginacion.totalItems.getValue();
    let final = (pagina + 1) * tamanio;
    let comienzo =  pagina * tamanio + 1;
    if (final > totalItems) {
      final = totalItems;
      if ( pagina === 0 ) {
        if ( totalItems === 0) {
          comienzo = 0;
        } else {
          comienzo = 1;
        }
      }
    } else {
      if (totalItems === 0) {
        final = 0;
      }
    }
    let nuevoPieDePagina = '';
    this.translateService.get('infoMiDataTable', {inicio: comienzo, fin: final, total: totalItems}).subscribe(
      data => {
        nuevoPieDePagina = data;
      }
    );
    return nuevoPieDePagina;
  }


  inicializarPaginacion() {
    this.paginacion.pagina.next(0);
    this.paginacion.totalPaginas.next(0);
    this.paginacion.tamanio.next(this.dtOptions.pagelenght);
    this.paginacion.totalItems.next(0);
    if (this.ordenarPorElCampo != null) {
      this.paginacion.orden.next(this.ordenarPorElCampo + ',' + this.ordenarAscendente ? 'asc' : 'desc');
    } else {
      this.paginacion.orden.next(this.columnas[0].atributo + this.ordenarAscendente ? 'asc' : 'desc');
    }
  }

  cargarData() {
   if ( this.usaServicio ) {
     this.cargarDataServicio(this.urlServicio);
   } else {
       this.dataTableServicio.ordenar(this.paginacion.orden.value);
       this.paginacion.totalItems.next(this.dataTableServicio.getData().length);
       this.paginacion.totalPaginas.next(Math.ceil(this.paginacion.totalItems.getValue() / this.paginacion.tamanio.getValue()));
       this.cargarDataLocal();
   }
  }

  setParametros(parametros: HttpParams) {
    this.parametros = parametros;
  }

  cargarDataServicio(urlServicio: string) {
    const params = this.parametros
      .set('size', this.paginacion.tamanio.getValue().toString())
      .set('page', this.paginacion.pagina.getValue().toString())
      .set('sort', this.paginacion.orden.getValue().toString());
      this.servicio.get(params, urlServicio, this.tipoAtributoServicio).subscribe(
        data => {
          if ( data[1] !== undefined) {
            this.checkTodos = false;
            this.dataTemporal.next(data[1]);
            const tamanio = this.paginacion.tamanio.value;
            const orden = this.paginacion.orden.value;
            this.paginacion = data[0];
            this.paginacion.tamanio.next(tamanio);
            this.paginacion.orden.next(orden);

            // this.paginacion.pagina.next(this.servicio.paginacion.pagina.value);
            // this.paginacion.totalItems.next(this.servicio.paginacion.totalItems.value);
            // this.paginacion.totalPaginas.next(this.servicio.paginacion.totalPaginas.value);
            // this.paginacion.next.next(this.servicio.paginacion.next.value);
            // this.paginacion.previous.next(this.servicio.paginacion.previous.value);
            // this.paginacion.first.next(this.servicio.paginacion.first.value);
            // this.paginacion.last.next(this.servicio.paginacion.last.value);
            this.reDibujarDataTableServicio();
          }
        }
      );
  }

  cargarDataLocal() {
    const inicio: number = this.paginacion.pagina.value * this.paginacion.tamanio.value;
    const fin: number = this.paginacion.tamanio.value;
    this.dataTemporal = this.dataTableServicio.getRango(inicio, (inicio + fin));
    this.reDibujarDataTableLocal();
  }

  seleccionarTodos() {
    this.checkTodos = !this.checkTodos;
    if ( !this.checkTodos ) {
      this.eliminarDataTemporalEnItemSeleccionados();
    } else {
      // this.dataTemporal.subscribe(
      //   data => {
      //     this.itemsSeleccionados.push(...data);
      //   }
      // );
      this.itemsSeleccionados.push(...this.dataTemporal.value);
    }
  }

  eliminarDataTemporalEnItemSeleccionados() {
    this.dataTemporal.value.forEach(
      itemDataTemporal => {
        const index = this.itemsSeleccionados.findIndex(item => item[this.nombreIdDelItem] === itemDataTemporal[this.nombreIdDelItem]);
        if (index !== -1) {
          this.itemsSeleccionados.splice(index, 1);
        }
      }
    );
    // this.dataTemporal.subscribe(
    //   data => {
    //     data.forEach(
    //       itemDataTemporal => {
    //         const index = this.itemsSeleccionados.findIndex(item => item[this.nombreIdDelItem] === itemDataTemporal[this.nombreIdDelItem]);
    //         if (index !== -1) {
    //           this.itemsSeleccionados.splice(index, 1);
    //         }
    //       }
    //     );
    //   }
    // );
  }

  seleccionar(itemData: T) {
    const index = this.itemsSeleccionados.findIndex(item => item[this.nombreIdDelItem] === itemData[this.nombreIdDelItem]);
    if (index !== -1) {
      this.itemsSeleccionados.splice(index, 1);
    } else {
      this.itemsSeleccionados.push(itemData);
    }
    // this.checkTodos = this.itemsSeleccionados.length >= this.paginacion.totalItems.getValue();
  }

  verificarSeleccion(itemData: T) {
    const index = this.itemsSeleccionados.findIndex(item => item[this.nombreIdDelItem] === itemData[this.nombreIdDelItem]);
    if (index !== -1) {
      return true;
    } else {
      return false;
    }
  }

  reDibujarDataTableLocal() {
    let orden = this.columnas.findIndex( item => item.atributo === this.ordenarPorElCampo);
    orden = orden === -1 ? 0 : orden;
    const that = this;
    const tamanio = that.paginacion.tamanio.value;
    this.checkTodos = false;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      that.datatableElement.dtOptions = {
        lengthMenu: [[10, 20, 30, -1], [10, 20, 30, 'Todos']],
        pageLength: tamanio === that.paginacion.totalItems.value ? -1 : tamanio,
        processing: false,
        paging: true,
        info: true,
        searching: false,
        serverSide: false,
        order: [this.habilitarCheckBox ? orden + 2 : orden + 1, this.ordenarAscendente ? 'asc' : 'desc'],
        'infoCallback': function () {
          return that.redibujarPieDePagina();
        },
        'drawCallback': function () {
          if (that.paginacion.totalPaginas.getValue() >= that.paginacion.pagina.getValue() && that.paginacion.pagina.getValue() >= 0) {
            $('#' + that.idTabla + '_paginate .pagination li').removeClass('disabled');
            $('#' + that.idTabla + '_paginate .pagination .active a').text(that.paginacion.pagina.value + 1);
            if (that.paginacion.pagina.getValue() + 1 <= that.paginacion.totalPaginas.getValue()) {
              $('#' + that.idTabla + '_next').on('click', function () {
                that.paginacion.pagina.next(that.paginacion.pagina.getValue() + 1);
                that.cargarDataLocal();
              });
            } else {
              $('#' + that.idTabla + '_next').addClass('disabled');
            }
            if (that.paginacion.pagina.getValue() - 1 >= 0) {
              $('#' + that.idTabla + '_previous').on('click', () => {
                that.paginacion.pagina.next(that.paginacion.pagina.getValue() - 1);
                that.cargarDataLocal();
              });
            } else {
              $('#' + that.idTabla + '_previous').addClass('disabled');
            }
            if (that.paginacion.pagina.getValue() !== 0) {
              $('#' + that.idTabla + '_first').on('click', () => {
                that.paginacion.pagina.next(0);
                that.cargarDataLocal();
              });
            } else {
              $('#' + that.idTabla + '_first').addClass('disabled');
            }
            if (that.paginacion.pagina.getValue() !== that.paginacion.totalPaginas.getValue()) {
              $('#' + that.idTabla + '_last').on('click', () => {
                that.paginacion.pagina.next(that.paginacion.totalPaginas.getValue() - 1);
                that.cargarDataLocal();
              });
            } else {
              $('#' + that.idTabla + '_last').addClass('disabled');
            }
          }
        }
      };
      this.dtTrigger.next();
    });
  }

  reDibujarDataTableServicio() {
    let orden = this.columnas.findIndex( item => item.atributo === this.ordenarPorElCampo);
    orden = orden === -1 ? 0 : orden;
    const that = this;
    const tamanio = that.paginacion.tamanio.value;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      that.datatableElement.dtOptions = {
        lengthMenu: [[10, 20, 30, -1], [10, 20, 30, 'Todos']],
        pageLength: tamanio === that.paginacion.totalItems.value ? -1 : tamanio,
        processing: false,
        paging: true,
        info: true,
        searching: false,
        serverSide: false,
        order: [this.habilitarCheckBox ? orden + 2 : orden + 1 , this.ordenarAscendente ? 'asc' : 'desc'],
        'infoCallback': function() {
          return that.redibujarPieDePagina();
        },
        'drawCallback': function () {
          if (that.paginacion.totalPaginas.getValue() >= that.paginacion.pagina.getValue() && that.paginacion.pagina.getValue() >= 0) {
            $('#' + that.idTabla + '_paginate .paginate_button').removeClass('disabled');
            $('#' + that.idTabla + '_paginate .pagination .active a').text(that.paginacion.pagina.getValue() + 1);
            if (that.paginacion.pagina.getValue() + 1 <= that.paginacion.totalPaginas.getValue()) {
              $('#' + that.idTabla + '_next').on('click', function () {
                that.cargarDataServicio(that.paginacion.next.getValue());
              });
            } else {
              $('#' + that.idTabla + '_next').addClass('disabled');
            }
            if (that.paginacion.pagina.getValue() - 1 >= 0) {
              $('#' + that.idTabla + '_previous').on('click', () => {
                that.cargarDataServicio(that.paginacion.previous.getValue());
              });
            } else {
              $('#' + that.idTabla + '_previous').addClass('disabled');
            }
            if (that.paginacion.pagina.getValue() !== 0) {
              $('#' + that.idTabla + '_first').on('click', () => {
                that.cargarDataServicio(that.paginacion.first.getValue());
              });
            } else {
              $('#' + that.idTabla + '_first').addClass('disabled');
            }
            if (that.paginacion.pagina.getValue() !== that.paginacion.totalPaginas.getValue()) {
              $('#' + that.idTabla + '_last').on('click', () => {
                that.cargarDataServicio(that.paginacion.last.getValue());
              });
            } else {
              $('#' + that.idTabla + '_last').addClass('disabled');
            }
          }
        }
      };
      this.dtTrigger.next();
    });

  }

  ejecutarAccionSelect(item: T, event) {
    const index = event.target.value;
    event.target.selectedIndex = 0;
    const accion: Accion = this.acciones[index];
    this.accion.emit([accion.tipoAccion, item]);
  }

  ejecutarAccionButton(item: T, index: number) {
    const accion: Accion = this.acciones[index];
    this.accion.emit([accion.tipoAccion, item]);
  }

  ejecutarAccionCabecera(item, accion: Accion) {
    this.accion.emit([accion.tipoAccion, item]);
  }

  eventoBotonGenerico() {
    this.generico.emit([]);
  }

  eliminarItems() {
    if (this.checkTodos) {
      if (this.usaServicio) {
        this.eliminar.emit(this.itemsSeleccionados);
        // this.dataTemporal.next([]);
        this.itemsSeleccionados = [];
      } else {
        this.checkTodos = false;
        this.dataTableServicio.eliminarTodos();
        const dataNueva = this.dataTableServicio.getData();
        this.inicializarPaginacion();
        this.insertarData(dataNueva);
        this.itemsSeleccionados = [];
        this.eliminar.emit(this.dataTableServicio.getData());
      }
    } else {
      if (this.usaServicio) {
        this.eliminar.emit(this.itemsSeleccionados);
        // this.dataTemporal.next([]);
        this.itemsSeleccionados = [];
      } else {
        this.dataTableServicio.eliminarMasa(this.itemsSeleccionados, this.nombreIdDelItem);
        const dataNueva = this.dataTableServicio.getData();
        this.paginacion.totalItems.next(dataNueva.length);
        this.insertarData(dataNueva);
        this.itemsSeleccionados = [];
        this.eliminar.emit(this.dataTableServicio.getData());
      }
    }
  }
  public seleccionarItems() {
    this.seleccionarItemsTabla.emit(this.itemsSeleccionados);
  }

  insertarData(data: T[]) {
    if (!this.usaServicio) {
      this.dataTableServicio.setData(data);
      this.cargarDataLocal();
    }
  }

  habilitarBotonEliminar() {
    return (this.itemsSeleccionados.length === 0 && !this.checkTodos);
  }

  habilitarBotonSeleccionar() {
    return (this.itemsSeleccionados.length === 0 && !this.checkTodos);
  }

  getData() {
    if (this.usaServicio) {

    } else {
      return this.dataTableServicio.getData();
    }
  }

  getItemsSeleccionados() {
    return this.itemsSeleccionados;
  }

  esTipoDeAccionElAtributo(atributo: any) {
    return typeof atributo === 'number';
  }

  obtenerTipoDeAccionDelAtributo(): Accion[] {
    const tamanio = this.acciones.length;
    if ( this.iteradorAtributoTipoDeAccion >= tamanio) {
      this.iteradorAtributoTipoDeAccion = 0;
    }
    return [this.acciones[this.iteradorAtributoTipoDeAccion++]];
  }

  obtenerValorItem(item: T, atributo: any) {
    const partes = atributo.split('.');
    const tam = partes.length;
    let valorItem = item[partes[0]];
    let i = 1;
    if (atributo === 'estado' && typeof valorItem === 'number') {
      let nuevoValor = '';
      if (this.TIPOS_ESTADOS[valorItem]) {
        this.translateService.get(this.TIPOS_ESTADOS[valorItem]).subscribe(
          data => {
            nuevoValor = data;
          }
        );
        return nuevoValor;
      }
    } else {
      if ( valorItem != null && valorItem !== undefined) {
        for (i; i < tam && valorItem != null; i++) {
          valorItem = valorItem[partes[i]];
        }
      }
      return valorItem;
    }
  }

  agregarItem() {
    this.agregar.emit(true);
  }

  habilitarAccionPorItem(item: T, accion: Accion) {
    if (accion.atributoItemAComparar) {
      const valorItemAtributo = this.obtenerValorItem(item, accion.atributoItemAComparar);
      if ( valorItemAtributo !== undefined && valorItemAtributo !== null && valorItemAtributo !== '-') {
        const tipoEstado = valorItemAtributo;
        if (accion.paraEstarHabilitado !== undefined && accion.paraEstarHabilitado !== null) {
          const index = accion.paraEstarHabilitado.findIndex(estado => estado == tipoEstado);
          if (index !== -1) {
            return true;
          }
          return false;
        } else {
         return true;
        }
      }
      return false;
    }
    return true;
  }
  ejecutarTipoSeleccionadoDeBotonAgregar(producto: TipoProducto) {
    this.tipoProductoSeleccionado.emit(producto);
  }

  obtenerEstiloFilaPintada(item: T) {
    if (this.pintarFilas) {
      if (item[this.nombreCampoParaPintarFilas]) {
        return {'color': '#FFFFFF', 'background-color': '#0079BF'};
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  seDebeAgregarEvento(atributo: string) {
    if (this.agregarEventoClick) {
      const index = this.atributosConEvento.findIndex(item => item === atributo);
      if (index !== -1) {
        return true;
      }
      return false;
    }
    return false;
  }

  ejecutarAccionPorEvento(item: T, atributo: string, esLanzado: boolean) {
    if (esLanzado) {
      this.eventoLanzado.emit([item, atributo]);
    }
  }

  setUrlServicio(url: string) {
    this.urlServicio = url;
  }

  comprobarTipoItemValor(itemValor) {
    if (typeof itemValor === 'number' && itemValor > 0) {
      return true;
    }
    return false;
  }

  setAcciones (acciones: Accion[]) {
    this.acciones = acciones;
  }

  actualizarColumnas(columnas: ColumnaDataTable[]) {
    this.columnas = columnas;
  }
}
