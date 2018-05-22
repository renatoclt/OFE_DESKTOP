import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject} from 'rxjs/Rx';
import {TABLA_MAESTRA_UNIDADES_MEDIDA, TablaMaestra} from '../../../general/models/documento/tablaMaestra';
import {TablaMaestraService} from '../../../general/services/documento/tablaMaestra.service';
import {TipoCalculoIscService} from '../../../general/services/configuracionDocumento/tipoCalculoIsc.service';
import {TipoCalculoIsc} from '../../../general/models/configuracionDocumento/tipoCalculoIsc';
import {TipoBienServicio} from '../../models/tipoBienServicio';
import {TiposService} from '../../../general/utils/tipos.service';
import {ProductosIndividuales} from '../../models/productosIndividuales';
import {ProductoServices} from '../../../general/services/inventario/producto.services';
import {EstilosServices} from '../../../general/utils/estilos.services';
import {ProductoQry} from '../../../general/models/productos/producto';
import {ProductoUpdate} from '../../../general/models/productos/producto-update';
declare var $, swal: any;

@Component({
  selector: 'app-bienes-servicios-individual',
  templateUrl: './bienes-servicios-individual.component.html',
  styleUrls: ['./bienes-servicios-individual.component.css']
})
export class BienesServiciosIndividualComponent implements OnInit {

  public productosIndividualformGroup: FormGroup;
  public unidadesDeMedida: BehaviorSubject<TablaMaestra[]>;
  public tipoCalculoIsc: BehaviorSubject<TipoCalculoIsc[]>;
  public tipoBienServicios: TipoBienServicio[];
  public productoIndividual: ProductosIndividuales;
  public productoEditar: ProductoQry;
  public productoUpdate: ProductoUpdate;

  esEditable: boolean;
  txtBotonEditar: string;

  constructor(private httpClient: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              private _tablaMaestraService: TablaMaestraService,
              private _tipoCalculoIscService: TipoCalculoIscService,
              private _tipos: TiposService,
              private _estilosServices: EstilosServices,
              private productosServices: ProductoServices) {
    this.iniciarVariables();
    this.productoIndividual = new ProductosIndividuales();
    this.productoEditar = new ProductoQry();
    this.productoUpdate = new ProductoUpdate();
  }

  ngOnInit() {
    this.initform();
    this.leerParametros();
  }

  leerParametros() {
    this.esEditable = this.route.snapshot.data['esEditable'];
    if (this.esEditable) {
     if (this.productosServices.itemAEditar.value) {
       this.productoEditar = this.productosServices.itemAEditar.value;
       this.cargarItemEnForm();
       this.convertirProductoQryAProductoUpdate();
     } else {
       this.regresar();
     }
    }
  }

  cargarItemEnForm() {
    this.productosIndividualformGroup.controls['txtcodigo'].setValue(this.productoEditar.codigo);
    this.productosIndividualformGroup.controls['txtdescripcion'].setValue(this.productoEditar.descripcion);
    this.productosIndividualformGroup.controls['cmbtipo'].setValue(this.productoEditar.tipoProducto);
    this._estilosServices.eliminarEstiloInput('cmbtipo', 'is-empty');
    this.productosIndividualformGroup.controls['cmbunidadmedida'].setValue(this.productoEditar.unidadMedida);
    this._estilosServices.eliminarEstiloInput('cmbunidadmedida', 'is-empty');
    this.productosIndividualformGroup.controls['txtvalorunitario'].setValue(this.productoEditar.precioUnitario);
    this.productosIndividualformGroup.controls['cmbcalculoISC'].setValue(this.productoEditar.idTipoCalc);
    this._estilosServices.eliminarEstiloInput('cmbcalculoISC', 'is-empty');
    this.productosIndividualformGroup.controls['txtISC'].setValue(this.productoEditar.montoIsc);
    this.productosIndividualformGroup.disable(true);
  }

  iniciarVariables() {
    this.txtBotonEditar = 'editar';
    this.unidadesDeMedida = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_UNIDADES_MEDIDA);
    this.unidadesDeMedida.subscribe(
      data => {
        if (data) {
        }
      }
    );
    this.tipoCalculoIsc = this._tipoCalculoIscService.obtenerTodosTiposCalculoIsc();
    this.tipoCalculoIsc.subscribe(
      data => {
        if (data) {
        }
      }
    );
    this.tipoBienServicios = [];
    this.tipoBienServicios.push(new TipoBienServicio(1, 'S', 'Servicio') , new TipoBienServicio(2, 'B', 'Bien'));
  }

  private initform() {
    this.productosIndividualformGroup = new FormGroup({
      'txtcodigo': new FormControl('', [Validators.required]),
      'txtdescripcion': new FormControl('', [Validators.required]),
      'cmbtipo': new FormControl('', [Validators.required]),
      'cmbunidadmedida': new FormControl('', [Validators.required]),
      'txtvalorunitario': new FormControl('', [Validators.required, Validators.min(0.01)]),
      'cmbcalculoISC': new FormControl('', [Validators.required]),
      'txtISC': new FormControl('', [Validators.required])
    });

    this.productosIndividualformGroup.controls['txtvalorunitario'].valueChanges.subscribe(
      data => {
        this.productosIndividualformGroup.controls['txtvalorunitario'].markAsTouched();
      }
    );
    this.productosIndividualformGroup.controls['cmbcalculoISC'].valueChanges.subscribe(
      data => {
        this.seleccionarTipoIsc();
      }
    );
  }

  public seleccionarTipoIsc() {
    const tipoIsc = this.productosIndividualformGroup.controls['cmbcalculoISC'].value;
    this.productosIndividualformGroup.controls['txtISC'].reset();
    this.productosIndividualformGroup.controls['txtISC'].setValue('0.00');
    this._estilosServices.eliminarEstiloInput('txtISC', 'is-empty');
    if (tipoIsc === this._tipos.ID_ISC_ID_TIPO_NO_TIENE) {
      this.productosIndividualformGroup.controls['txtISC'].disable(true);
      this.productosIndividualformGroup.controls['txtISC'].setValidators(null);
      $('#' + 'txtISC').parent().children('label').children('span').remove();
    } else {
      this.productosIndividualformGroup.controls['txtISC'].enable(true);
      this.productosIndividualformGroup.controls['txtISC'].setValidators([Validators.required, Validators.min(0.01)]);
      $('#' + 'txtISC').parent().children('label').children('span').remove();
      $('#' + 'txtISC').parent().children('label').append('<span class=\'star\'>*</span>');
    }
    this.productosIndividualformGroup.controls['txtISC'].markAsTouched();
  }

  public fillProducto() {
    this.productoIndividual.codigo = this.productosIndividualformGroup.get('txtcodigo').value;
    this.productoIndividual.descripcion = this.productosIndividualformGroup.get('txtdescripcion').value;
    this.productoIndividual.unidadMedida = this.productosIndividualformGroup.get('cmbunidadmedida').value;
    this.productoIndividual.idEntidad = localStorage.getItem('id_entidad');
    this.productoIndividual.idTipoCalculoIsc = this.productosIndividualformGroup.get('cmbcalculoISC').value;
    this.productoIndividual.precioUnitario = this.productosIndividualformGroup.get('txtvalorunitario').value;
    this.productoIndividual.montoIsc = this.productosIndividualformGroup.get('txtISC').value;
    this.productoIndividual.tipoProducto = this.productosIndividualformGroup.get('cmbtipo').value;
  }

  public subirData() {
    this.fillProducto();
    this.productosServices.subirProcutoIndividual(this.productoIndividual);
    this.limpiar();
  }

  limpiar() {
    this.productosIndividualformGroup.reset();
    this._estilosServices.agregarEstiloInput('txtcodigo', 'is-empty');
    this._estilosServices.agregarEstiloInput('txtdescripcion', 'is-empty');
    this._estilosServices.agregarEstiloInput('cmbtipo', 'is-empty');
    this._estilosServices.agregarEstiloInput('cmbunidadmedida', 'is-empty');
    this._estilosServices.agregarEstiloInput('txtvalorunitario', 'is-empty');
    this._estilosServices.agregarEstiloInput('cmbcalculoISC', 'is-empty');
    this._estilosServices.agregarEstiloInput('txtISC', 'is-empty');
  }

  regresar() {
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  public fillProductoUpdate() {
    this.productoUpdate.codigo = this.productosIndividualformGroup.get('txtcodigo').value;
    this.productoUpdate.descripcion = this.productosIndividualformGroup.get('txtdescripcion').value;
    this.productoUpdate.unidadMedida = this.productosIndividualformGroup.get('cmbunidadmedida').value;
    this.productoUpdate.idEntidad = Number(localStorage.getItem('id_entidad'));
    this.productoUpdate.idTipoCalculoIsc = this.productosIndividualformGroup.get('cmbcalculoISC').value;
    this.productoUpdate.precioUnitario = this.productosIndividualformGroup.get('txtvalorunitario').value;
    this.productoUpdate.montoIsc = this.productosIndividualformGroup.get('txtISC').value;
    this.productoUpdate.tipoProducto = this.productosIndividualformGroup.get('cmbtipo').value;
  }

  convertirProductoQryAProductoUpdate() {
    this.productoUpdate.montoIsc = this.productoEditar.montoIsc.toString();
    this.productoUpdate.idTipoCalculoIsc = this.productoEditar.idTipoCalc.toString();
    this.productoUpdate.codigo = this.productoEditar.codigo;
    this.productoUpdate.precioUnitario = this.productoEditar.precioUnitario.toString();
    this.productoUpdate.unidadMedida = this.productoEditar.unidadMedida;
    this.productoUpdate.descripcion = this.productoEditar.descripcion;
    this.productoUpdate.afectaDetraccion = this.productoEditar.afectaDetraccion;
    this.productoUpdate.estado = this.productoEditar.estado;
    this.productoUpdate.idEntidad = this.productoEditar.idEntidad;
    this.productoUpdate.tipoProducto = this.productoEditar.tipoProducto;
    this.productoUpdate.id = this.productoEditar.id;
  }

  editar() {
    if (this.txtBotonEditar === 'editar') {
      this.productosIndividualformGroup.enable(true);
      this.txtBotonEditar = 'guardar';
    } else {
      this.fillProductoUpdate();
      this.productosServices.actualizarProducto(this.productoUpdate);
    }
  }
}
