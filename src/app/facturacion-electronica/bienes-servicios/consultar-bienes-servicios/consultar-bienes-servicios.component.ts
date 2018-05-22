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
              private _estilosService: EstilosServices,
              public _productosService: ProductoServices) { }

  inicializarVariables() {
    this.titulo = 'consultaBienesServicios';

    this.columnasTabla = [
      new ColumnaDataTable('codigo', 'codigo'),
      new ColumnaDataTable('descripcion', 'descripcion', {'text-align': 'left'}),
      new ColumnaDataTable('unidadMedida', 'unidadMedida'),
      new ColumnaDataTable('precioUnitario', 'precioUnitario', {'text-align': 'right'}),
      new ColumnaDataTable('tipoIsc', 'idTipoCalc'),
      new ColumnaDataTable('isc', 'montoIsc', {'text-align': 'right'})
    ];
    this.ordenarPorElCampo = 'codigo';
    this.nombreIdDelItem = 'id';
    this.parametrosBusqueda = new HttpParams()
      .set('codigo', '')
      .set('descripcion', '')
      .set('id_entidad', localStorage.getItem('id_entidad'))
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
    this.consultaFormGroup.reset();
  }

  verificarForm() {
    return (this.consultaFormGroup.controls['txtCodigo'].value || this.consultaFormGroup.controls['txtDescripcion'].value);
  }

  buscar(actualizar: boolean = false) {
    this.parametrosBusqueda = new HttpParams()
      .set('codigo', actualizar ? '' : this.consultaFormGroup.controls['txtCodigo'].value)
      .set('descripcion', actualizar ? '' : this.consultaFormGroup.controls['txtDescripcion'].value)
      .set('identidad', localStorage.getItem('id_entidad'))
      .set('estado', '1');
    this.tablaConsultaProductos.setParametros(this.parametrosBusqueda);
    this.tablaConsultaProductos.cargarData();
  }

  eliminarAccion(event) {
    const datos = event;
    this._productosService.eliminarEnMasa(datos).subscribe(
      data => {
        if (data) {}
      }
    );
  }
}
