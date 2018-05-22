import {Component, DoCheck, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Accion, Icono} from '../../../general/data-table/utils/accion';
import {TiposService} from '../../../general/utils/tipos.service';
import {ModoVistaAccion} from '../../../general/data-table/utils/modo-vista-accion';
import {TipoAccion} from '../../../general/data-table/utils/tipo-accion';
import {Subscription} from 'rxjs/Subscription';
import {DataTableComponent} from '../../../general/data-table/data-table.component';
import {DetalleNotaDebito} from '../modelos/detalleNotaDebito';
import {NotaDebitoService} from '../servicios/nota-debito-service';
import {TipoNotaDebitoEditarItemComponent} from '../tipo-nota-debito-editar-item/tipo-nota-debito-editar-item.component';
import {ColumnaDataTable} from '../../../general/data-table/utils/columna-data-table';

@Component({
  selector: 'app-tipo-nota-debito-datatable',
  templateUrl: './tipo-nota-debito-datatable.component.html',
  styleUrls: ['./tipo-nota-debito-datatable.component.css']
})
export class TipoNotaDebitoDatatableComponent implements OnInit, DoCheck, OnDestroy {

  idModal: string;

  columnasTabla: ColumnaDataTable[];

  acciones: Accion[];
  tipoAccion: ModoVistaAccion;
  ordenarPorElCampo: string;
  nombreIdDelItem: string;

  tipoNotaDebito: string;
  tipoNotaDebitoSubscription: Subscription;
  pasoAVistaPreviaSubscription: Subscription;

  itemAEditar: DetalleNotaDebito;

  detalleListaSubscription: Subscription;
  detalleLista: DetalleNotaDebito[];

  nombreCampoParaPintarFilas: string;
  pintarFilas: boolean;

  @ViewChild('tablaDetalle') tablaDetalle: DataTableComponent<DetalleNotaDebito>;
  @ViewChild('editarItemComponent') editarItemComponent: TipoNotaDebitoEditarItemComponent;
  @Output() estaValidadoNotaDebitoDataTable = new EventEmitter<boolean>();
  @Output() seInicio = new EventEmitter<boolean>();

  constructor(private _tiposService: TiposService,
              private _notaDebitoService: NotaDebitoService) {
    this.idModal = 'modal';
    this.columnasTabla = [
      new ColumnaDataTable('codigo', 'codigoItem'),
      new ColumnaDataTable('descripcion', 'descripcionItem', {'text-align': 'left'}),
      new ColumnaDataTable('cantidad', 'cantidad', {'text-align': 'right'}),
      new ColumnaDataTable('unidadMedida', 'detalle.unidadMedida'),
      new ColumnaDataTable('valorUnitario', 'precioUnitario', {'text-align': 'right'}),
      new ColumnaDataTable('igv', 'detalle.subtotalIgv', {'text-align': 'right'}),
      new ColumnaDataTable('isc', 'detalle.subtotalIsc', {'text-align': 'right'}),
      new ColumnaDataTable('descuento', 'detalle.descuento', {'text-align': 'right'}),
      new ColumnaDataTable('valorVenta', 'precioTotal', {'text-align': 'right'})
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
    this.pasoAVistaPreviaSubscription = this._notaDebitoService.pasoAVistaPrevia.subscribe(
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
    this.tipoNotaDebitoSubscription.unsubscribe();
    this.detalleListaSubscription.unsubscribe();
  }

  verificarNotaDebitoPermitidos(data) {
    const tiposNotasDebitoPermitidos = [
      this._tiposService.TIPO_NOTA_DEBITO_AUMENTO_EN_EL_VALOR
    ];
    return (tiposNotasDebitoPermitidos.findIndex(item => item === data) !== -1);
  }

  iniciarData(evento) {
    this.tipoNotaDebitoSubscription = this._notaDebitoService.tipoNotaDebito.subscribe(
      data => {
        if (this.verificarNotaDebitoPermitidos(data)) {
          this.tipoNotaDebito = data;
          if (!this._notaDebitoService.estaUsandoPersistencia.value) {
            this.detalleLista = this._notaDebitoService.obtenerDetalleOriginal();
            this.tablaDetalle.insertarData(this.detalleLista);
          }
        }
      }
    );
    if (this._notaDebitoService.estaUsandoPersistencia.value) {
      this.detalleListaSubscription = this._notaDebitoService.detalleModificadoLista.subscribe(
        dataDetalle => {
          if (this.verificarNotaDebitoPermitidos(this.tipoNotaDebito)) {
            this.detalleLista = this._notaDebitoService.obtenerDetalleOriginal();
            if (this.detalleLista !== null) {
              for (const detalle of dataDetalle) {
                const index = this.detalleLista.findIndex(item => item.posicion === detalle.posicion);
                if (index !== -1) {
                  this.detalleLista[index] = detalle;
                }
              }
            }
            this.tablaDetalle.insertarData(this.detalleLista);
            this._notaDebitoService.estaUsandoPersistencia.next(false);
          }
        }
      );
    }
  }

  enviarDetalle() {
    this.filtrarDetallesModificados();
    this._notaDebitoService.setDetalleDataTable(this.detalleLista);
  }

  enviarCabecera() {
    this._notaDebitoService.setCabeceraDataTable(false);
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
    const detalleOriginal = this._notaDebitoService.obtenerDetalleOriginal().find(item => item.posicion === this.itemAEditar.posicion);
    this.itemAEditar.copiarDetalle(detalleOriginal);
  }

  estaValidadoDataTable() {
    for (const detalle of this.detalleLista) {
      if (detalle.cambioDetalle) {
        this.estaValidadoNotaDebitoDataTable.next(true);
        return;
      }
    }
    this.estaValidadoNotaDebitoDataTable.next(false);
    return;
  }

  abrirEditarModal() {
    this.editarItemComponent.llenarDatosItem(this.itemAEditar);
    this.editarItemComponent.abrirModal();
    if (this.tipoNotaDebito === this._tiposService.TIPO_NOTA_DEBITO_AUMENTO_EN_EL_VALOR) {
      if (Number(this.itemAEditar.precioUnitario) === 0) {
        this.regresarADetalleOriginal();
      }
    }
  }
}
