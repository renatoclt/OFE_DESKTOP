import {
  Component, DoCheck, EventEmitter, OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import {Accion, Icono} from '../../../general/data-table/utils/accion';
import {TipoAccion} from '../../../general/data-table/utils/tipo-accion';
import {ModoVistaAccion} from '../../../general/data-table/utils/modo-vista-accion';
import {DataTableComponent} from '../../../general/data-table/data-table.component';
import {TipoNotaCreditoEditarItemComponent} from '../tipo-nota-credito-editar-item/tipo-nota-credito-editar-item.component';
import {DetalleNotaCredito} from '../modelos/detalleNotaCredito';
import {TiposService} from '../../../general/utils/tipos.service';
import {NotaCreditoService} from '../servicios/nota-credito.service';
import {Subscription} from 'rxjs/Subscription';
import {ColumnaDataTable} from '../../../general/data-table/utils/columna-data-table';

@Component({
  selector: 'app-tipo-nota-credito-datatable',
  templateUrl: './tipo-nota-credito-datatable.component.html',
  styleUrls: ['./tipo-nota-credito-datatable.component.css']
})
export class TipoNotaCreditoDatatableComponent implements OnInit, DoCheck, OnDestroy {

  idModal: string;

  columnasTabla: ColumnaDataTable[];

  acciones: Accion[];
  tipoAccion: ModoVistaAccion;
  ordenarPorElCampo: string;
  nombreIdDelItem: string;

  tipoNotaCredito: string;
  tipoNotaCreditoSubscription: Subscription;
  pasoAVistaPreviaSubscription: Subscription;

  itemAEditar: DetalleNotaCredito;

  detalleListaSubscription: Subscription;
  detalleLista: DetalleNotaCredito[];

  nombreCampoParaPintarFilas: string;
  pintarFilas: boolean;

  @ViewChild('tablaDetalle') tablaDetalle: DataTableComponent<DetalleNotaCredito>;
  @ViewChild('editarItemComponent') editarItemComponent: TipoNotaCreditoEditarItemComponent;
  @Output() estaValidadoNotaCreditoDataTable = new EventEmitter<boolean>();
  @Output() seInicio = new EventEmitter<boolean>();

  constructor(private _tiposService: TiposService,
              private _notaCreditoService: NotaCreditoService) {
    this.idModal = 'modal';
    this.columnasTabla = [
      new ColumnaDataTable('codigo', 'codigoItem'),
      new ColumnaDataTable('descripcion', 'descripcionItem', {'text-align': 'left'}),
      new ColumnaDataTable('cantidad', 'cantidad', {'text-align': 'right'}),
      new ColumnaDataTable('unidadMedida', 'detalle.unidadMedida'),
      new ColumnaDataTable('valorUnitario', 'precioUnitario', {'text-align': 'right'}),
      new ColumnaDataTable('igv', 'detalle.subtotalIgv', {'text-align': 'right'}),
      new ColumnaDataTable('isc', 'detalle.subtotalIsc', {'text-align': 'right'}),
      new ColumnaDataTable('descuento', 'detalle.descuentoOriginal', {'text-align': 'right'})
    ];

    this.ordenarPorElCampo = 'codigoItem';
    this.acciones = [
      new Accion('editar', new Icono('edit', 'btn-info'), TipoAccion.EDITAR),
      new Accion('limpiar', new Icono('clear', 'btn-info'), TipoAccion.LIMPIAR)
    ];
    this.pintarFilas = true;
    this.nombreCampoParaPintarFilas = 'cambioDetalle';
    this.nombreIdDelItem = 'posicion';
    this.tipoAccion = ModoVistaAccion.ICONOS;
    this.detalleLista = [];
  }

  ngOnInit() {
    this.detalleListaSubscription = new Subscription();
    this.seInicio.next(true);
    this.pasoAVistaPreviaSubscription = this._notaCreditoService.pasoAVistaPrevia.subscribe(
      data => {
        if (data) {
          this.enviarDetalle();
          this.enviarCabecera();
        }
      }
    );
  }

  ngDoCheck() {
    this.estaValidadoDataTable();
  }

  ngOnDestroy() {
    this.seInicio.next(false);
    this.tipoNotaCreditoSubscription.unsubscribe();
    this.detalleListaSubscription.unsubscribe();
  }

  verificarNotaCreditoPermitidos(data) {
    const tiposNotasCreditoPermitidos = [
      this._tiposService.TIPO_NOTA_CREDITO_CORRECCION_DE_LA_DESCRIPCION,
      this._tiposService.TIPO_NOTA_CREDITO_DEVOLUCION_POR_ITEM,
      this._tiposService.TIPO_NOTA_CREDITO_DESCUENTO_POR_ITEM,
      this._tiposService.TIPO_NOTA_CREDITO_DISMINUCION_EN_EL_VALOR
    ];
    return (tiposNotasCreditoPermitidos.findIndex(item => item === data) !== -1);
  }

  verificarColumnas() {
    const indexDescuentoNotaCredito = this.columnasTabla.findIndex( item => item.cabecera === 'descuentoNotaCredito');
    const indexValorVenta = this.columnasTabla.findIndex( item => item.cabecera === 'valorVenta');
    if ( indexValorVenta !== -1 ) {
      this.columnasTabla.pop();
    }
    if (indexDescuentoNotaCredito !== -1) {
      this.columnasTabla.pop();
    }
    if (this.tipoNotaCredito === this._tiposService.TIPO_NOTA_CREDITO_DESCUENTO_POR_ITEM) {
      this.columnasTabla.push(new ColumnaDataTable('descuentoNotaCredito', 'detalle.descuento', {'text-align': 'right'}));
      this.columnasTabla.push(new ColumnaDataTable('valorVenta', 'precioTotal', {'text-align': 'right'}));
    } else {
      this.columnasTabla.push(new ColumnaDataTable('valorVenta', 'precioTotal', {'text-align': 'right'}));
    }
    this.tablaDetalle.actualizarColumnas(this.columnasTabla);
  }
  iniciarData(evento) {
    this.tipoNotaCreditoSubscription = this._notaCreditoService.tipoNotaCredito.subscribe(
      data => {
        if (this.verificarNotaCreditoPermitidos(data)) {
          this.tipoNotaCredito = data;
          if (!this._notaCreditoService.estaUsandoPersistencia.value) {
            this.detalleLista = this._notaCreditoService.obtenerDetalleOriginal();
            this.verificarColumnas();
            this.tablaDetalle.insertarData(this.detalleLista);
          }
        }
      }
    );
    if (this._notaCreditoService.estaUsandoPersistencia.value) {
      this.detalleListaSubscription = this._notaCreditoService.detalleModificadoLista.subscribe(
        dataDetalle => {
          if (this.verificarNotaCreditoPermitidos(this.tipoNotaCredito)) {
            this.detalleLista = this._notaCreditoService.obtenerDetalleOriginal();
            if (this.detalleLista !== null) {
              for (const detalle of dataDetalle) {
                const index = this.detalleLista.findIndex(item => item.posicion === detalle.posicion);
                if (index !== -1) {
                  this.detalleLista[index] = detalle;
                }
              }
            }
            this.tablaDetalle.insertarData(this.detalleLista);
            this._notaCreditoService.estaUsandoPersistencia.next(false);
          }
        }
      );
    }
  }

  enviarDetalle() {
    this.filtrarDetallesModificados();
    this._notaCreditoService.setDetalleDataTable(this.detalleLista);
  }

  enviarCabecera() {
    let ponerValoresEnCero = false;
    if (this.tipoNotaCredito === this._tiposService.TIPO_NOTA_CREDITO_CORRECCION_DE_LA_DESCRIPCION) {
      ponerValoresEnCero = true;
    }
    this._notaCreditoService.setCabeceraDataTable(ponerValoresEnCero);
  }


  filtrarDetallesModificados() {
    this.detalleLista = this.detalleLista.filter(item => item.cambioDetalle);
  }

  ejecutarAccion(evento) {
    const accion = evento[0];
    this.itemAEditar = evento[1];
    switch (accion) {
      case TipoAccion.EDITAR:
        this.abrirEditarModal();
        break;
      case TipoAccion.LIMPIAR:
        this.regresarADetalleOriginal();
        break;
    }
  }

  regresarADetalleOriginal() {
    const detalleOriginal = this._notaCreditoService.obtenerDetalleOriginal().find(item => item.posicion === this.itemAEditar.posicion);
    this.itemAEditar.copiarDetalle(detalleOriginal);
  }

  estaValidadoDataTable() {
    for (const detalle of this.detalleLista) {
      if (detalle.cambioDetalle) {
        this.estaValidadoNotaCreditoDataTable.next(true);
        return;
      }
    }
    this.estaValidadoNotaCreditoDataTable.next(false);
    return;
  }

  abrirEditarModal() {
    this.editarItemComponent.llenarDatosItem(this.itemAEditar);
    this.editarItemComponent.abrirModal();
    if (this.tipoNotaCredito === this._tiposService.TIPO_NOTA_CREDITO_DESCUENTO_POR_ITEM) {
      if (Number(this.itemAEditar.detalle.descuento) === 0) {
        this.regresarADetalleOriginal();
      }
    }
  }
}
