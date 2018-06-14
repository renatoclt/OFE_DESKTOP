import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {TipoAccion} from '../../general/data-table/utils/tipo-accion';
import {FormControl, FormGroup} from '@angular/forms';
import {Accion, Icono} from '../../general/data-table/utils/accion';
import {EstilosServices} from '../../general/utils/estilos.services';
import {DataTableComponent} from '../../general/data-table/data-table.component';
import {ProductoQry} from '../../general/models/productos/producto';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductoServices} from '../../general/services/inventario/producto.services';
import {ColumnaDataTable} from '../../general/data-table/utils/columna-data-table';
import {TranslateService} from '@ngx-translate/core';
declare var swal;
@Component({
  selector: 'app-consultar-bienes-servicios',
  templateUrl: './consultar-bienes-servicios.component.html',
  styleUrls: ['./consultar-bienes-servicios.component.css']
})
export class ConsultarBienesServiciosComponent implements OnInit {

  titulo: string;

  columnasTabla: ColumnaDataTable[];
  ordenarPorElCampo: string;
  nombreIdDelItem: string;
  parametrosBusqueda: HttpParams;
  acciones: Accion[];
  atributoServicio: string;

  consultaFormGroup: FormGroup;

  @ViewChild('tablaConsultaProductos') tablaConsultaProductos: DataTableComponent<ProductoQry>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _translateService: TranslateService,
              private _estilosService: EstilosServices,
              public _productosService: ProductoServices) { }

  inicializarVariables() {
    this.titulo = 'consultaBienesServicios';

    this.columnasTabla = [
      new ColumnaDataTable('codigo', 'codigo'),
      new ColumnaDataTable('descripcion', 'descripcion', {'text-align': 'left'}),
      new ColumnaDataTable('unidadMedida', 'unidadMedida'),
      new ColumnaDataTable('tipoProducto', 'tipoProducto'),
      new ColumnaDataTable('precioUnitario', 'precioUnitario', {'text-align': 'right'}),
      new ColumnaDataTable('tipoIsc', 'idTipoCalc'),
      new ColumnaDataTable('isc', 'montoIsc', {'text-align': 'right'})
    ];
    this.ordenarPorElCampo = 'codigo';
    this.nombreIdDelItem = 'id';
    this.parametrosBusqueda = new HttpParams()
      .set('codigo', '')
      .set('descripcion', '')
      .set('identidad', localStorage.getItem('id_entidad'))
      .set('estado', '1');
    this.acciones = [
      new Accion('editar', new Icono('edit', 'btn-info'), TipoAccion.EDITAR)
    ];
    this.atributoServicio = this._productosService.TIPO_ATRIBUTO_FILTRO_QRY;
  }

  inicializarForm() {
    this.consultaFormGroup = new FormGroup({
      txtCodigo: new FormControl(''),
      txtDescripcion: new FormControl('')
    });
  }
  ngOnInit() {
    this.inicializarVariables();
    this.inicializarForm();
  }

  iniciarData(evento) {

  }

  ejecutarAccion(evento) {
    const accion = evento[0];
    const item: ProductoQry = evento[1];
    switch (accion) {
      case TipoAccion.EDITAR:
        this._productosService.itemAEditar.next(item);
        this.router.navigate(['../editar/' + item.id], {relativeTo: this.route});
        break;
    }
  }

  limpiar() {
    this._estilosService.agregarEstiloInput('txtCodigo', 'is-empty');
    this._estilosService.agregarEstiloInput('txtDescripcion', 'is-empty');
    this.tablaConsultaProductos.dataTemporal.next([]);
    this.tablaConsultaProductos.iniciar();
    this.tablaConsultaProductos.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.tablaConsultaProductos.dtTrigger.next();
    });
    this.consultaFormGroup.reset();
  }

  verificarForm() {
    return (this.consultaFormGroup.controls['txtCodigo'].value || this.consultaFormGroup.controls['txtDescripcion'].value);
  }

  buscar(actualizar: boolean = false) {
    const codigo = this.consultaFormGroup.controls['txtCodigo'].value ? this.consultaFormGroup.controls['txtCodigo'].value : '';
    const descripcion = this.consultaFormGroup.controls['txtDescripcion'].value ? this.consultaFormGroup.controls['txtDescripcion'].value : '';
    this.parametrosBusqueda = new HttpParams()
      .set('codigo', actualizar ? '' : codigo)
      .set('descripcion', actualizar ? '' : descripcion)
      .set('identidad', localStorage.getItem('id_entidad'))
      .set('estado', '1');
    this.tablaConsultaProductos.setParametros(this.parametrosBusqueda);
    this.tablaConsultaProductos.cargarData();
  }

  eliminarAccion(event) {
    const datos = event;
    const that = this;
    let siText = '';
    this._translateService.get('si').take(1).subscribe(nombre => siText = nombre);
    let noText = '';
    this._translateService.get('no').take(1).subscribe(nombre => noText = nombre);
    let deseaEliminarLosItemsSeleccionados = '';
    this._translateService.get('deseaEliminarLosItemsSeleccionados').take(1).subscribe(nombre => deseaEliminarLosItemsSeleccionados = nombre);
    swal({
      title: deseaEliminarLosItemsSeleccionados,
      padding: '20',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: siText,
      cancelButtonText: noText,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false
    }).then(
      (result) => {
        that._productosService.eliminarEnMasa(datos).subscribe(
          data => {
            if (data) {
              setTimeout(
                () => {
                  that.tablaConsultaProductos.cargarData();
                }, 1200
              );
            }
          }
        );
      }, (dismiss) => {
      });
  }
}
