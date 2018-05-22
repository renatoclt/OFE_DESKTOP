import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {JsonDocumentoParametroNotaCredito} from '../../nota-credito/modelos/jsonDocumentoParametroNotaCredito';
import {DataTableComponent} from '../../../general/data-table/data-table.component';
import {DocumentoQuery} from '../../../general/models/comprobantes';
import * as WrittenNumber from 'written-number';
import {ComprobantesService} from '../../../general/services/comprobantes/comprobantes.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import {SpinnerService} from '../../../../service/spinner.service';
import {TiposService} from '../../../general/utils/tipos.service';
import {TipoArchivo, TIPOS_ARCHIVOS} from '../../../general/models/archivos/tipoArchivo';
import {ArchivoService} from '../../../general/services/archivos/archivo.service';
import {CorreoService} from '../../../general/services/correo/correo.service';
import {TranslateService} from '@ngx-translate/core';
import {PrecioPipe} from '../../../general/pipes/precio.pipe';
import {ColumnaDataTable} from '../../../general/data-table/utils/columna-data-table';

declare var $, swal: any;
@Component({
    selector: 'comprobante-visualizar-nota-credito-debito',
    templateUrl: './comprobante-visualizar-nota-credito-debito.html',
    styleUrls: ['./comprobante-visualizar-nota-credito-debito.css']
})
export class ComprobanteVisualizarNotaCreditoDebitoComponent implements OnInit, OnDestroy {
  columnasTabla: ColumnaDataTable[];
  tituloComprobante: string;
  tipoNotaTitulo: string;

  tiposArchivos: TipoArchivo[] = TIPOS_ARCHIVOS;

  tipoNotaComprobante: string;

  comprobante: BehaviorSubject<DocumentoQuery>;
  comprobanteSubscription: Subscription;

  @ViewChild(DataTableComponent) dataTable: DataTableComponent<any>;

  fechaEmision: Date;
  formatoFechaEmision: string;
  ordenarPorElCampo: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _comprobantesService: ComprobantesService,
              private _spinnerService: SpinnerService,
              private _tiposService: TiposService,
              private _archivoService: ArchivoService,
              private _correoService: CorreoService,
              private _translateService: TranslateService,
              private _precioPipe: PrecioPipe) {
    this.leerParametrosUrl();
  }

  inicializarVariables() {
    this.tituloComprobante = '';
    this.columnasTabla = [
      new ColumnaDataTable('codigo', 'vcCodigoProducto'),
      new ColumnaDataTable('descripcion', 'vcDescripcionitem', {'text-align': 'left'}),
      new ColumnaDataTable('cantidad', 'deCantidaddespachada', {'text-align': 'right'}),
      new ColumnaDataTable('unidadMedida', 'vcUnidadmedida'),
      new ColumnaDataTable('valorUnitario', 'dePreciounitarioitem', {'text-align': 'right'}),
      new ColumnaDataTable('igv', 'nuSubtotalIgv', {'text-align': 'right'}),
      new ColumnaDataTable('isc', 'nuSubtotalIsc', {'text-align': 'right'}),
      new ColumnaDataTable('descuento', 'nuDescuento', {'text-align': 'right'}),
      new ColumnaDataTable('valorVenta', 'dePreciototalitem', {'text-align': 'right'})
    ];
    this.ordenarPorElCampo = 'producto.vcCodigo';
    this.fechaEmision = new Date();
    this.formatoFechaEmision = this.obtenerFecha();
  }

  obtenerFecha(): string {
    const dateConvertido = new Date();
    const dia = dateConvertido.getDate();
    const mes = dateConvertido.getMonth() + 1;
    const anio = dateConvertido.getFullYear();
    return anio + '-' + this.ponerCeros(mes, 2) + mes + '-' + this.ponerCeros(dia, 2) + dia;
  }

  ponerCeros(numero: number , cantidadZeros: number) {
    return '0'.repeat(cantidadZeros - numero.toString().length);
  }

  leerParametrosUrl() {
    this.route.params.subscribe(
      (params) => {
        this.comprobante = this._comprobantesService.buscarPorUuid(params['id']);
        this._spinnerService.set(true);
        this.comprobanteSubscription = this.comprobante
          .subscribe(
         comprobanteData => {
           if (comprobanteData) {
              this.inicializarVariables();
              this.cargarData();
              this._spinnerService.set(false);
           }
         },
         error2 => {
           this._spinnerService.set(false);
           this.regresar();
         }
       );
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.comprobanteSubscription.unsubscribe();
  }

  cargarData() {
    if (this.comprobante.value.chIdtipocomprobante === this._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO) {
      this.tituloComprobante = 'notaCreditoElectronica';
      this.tipoNotaTitulo = 'tipoNotaCredito';
    } else {
      this.tituloComprobante = 'notaDebitoElectronica';
      this.tipoNotaTitulo = 'tipoNotaDebito';
    }
    const documentoParametroAux = this.comprobante.value.parametros.find(
      item => item.auxCaracter === this.comprobante.value.chIdtipocomprobante);
    if (documentoParametroAux) {
      const jsonDocumentoParametroAux: JsonDocumentoParametroNotaCredito = JSON.parse(documentoParametroAux.vcJson);
      this.tipoNotaComprobante = jsonDocumentoParametroAux.valor;
    }
    const arr = this.comprobante.value.deTotalcomprobantepago.toString().split('.');
    const entero = arr[0];
    const decimal = arr[1];
  }

  iniciarDataTable(evento) {
    this.comprobante.value.detalle.map(
      dataDetalle => {
        dataDetalle.vcCodigoProducto = dataDetalle.vcCodigoProducto ? dataDetalle.vcCodigoProducto : '-';
        dataDetalle.vcDescripcionitem = dataDetalle.vcDescripcionitem ? dataDetalle.vcDescripcionitem : '-';
        dataDetalle.vcUnidadmedida = dataDetalle.vcUnidadmedida ? dataDetalle.vcUnidadmedida : '-';
        dataDetalle.deCantidaddespachada = this._precioPipe.transform(dataDetalle.deCantidaddespachada);
        dataDetalle.dePreciounitarioitem = this._precioPipe.transform(dataDetalle.dePreciounitarioitem);
        dataDetalle.nuSubtotalIgv = this._precioPipe.transform(dataDetalle.nuSubtotalIgv);
        dataDetalle.nuSubtotalIsc = this._precioPipe.transform(dataDetalle.nuSubtotalIsc);
        dataDetalle.nuDescuento = this._precioPipe.transform(dataDetalle.nuDescuento);
        dataDetalle.dePreciototalitem = this._precioPipe.transform(dataDetalle.dePreciototalitem);
      }
    );
    this.dataTable.insertarData(this.comprobante.value.detalle);
  }

  regresar() {
    this.router.navigate(['../../../'], { relativeTo: this.route});
  }

  imprimir() {
    this._archivoService.retornarArchivoRetencionPercepcionbase(this.comprobante.value.inIdcomprobantepago)
      .subscribe(
        data => {
          if (data) {
            const winparams = 'dependent = yes, locationbar = no, menubar = yes, resizable, screenX = 50,' +
              ' screenY = 50, width = 800, height = 800';
            const htmlPop = '<embed width=100% height=100% type="application/pdf" src="data:application/pdf;base64,' + data + '"> </embed>';
            const printWindow = window.open('', 'PDF', winparams);
            printWindow.document.write(htmlPop);
          }
        }
      );
  }

  enviarCorreo() {
    const that = this;
    let agregarCorreosElectronicos = '';
    this._translateService.get('agregarCorreosElectronicos').take(1).subscribe(data => agregarCorreosElectronicos = data);
    let correosElectronicos = '';
    this._translateService.get('correosElectronicos').take(1).subscribe(data => correosElectronicos = data);
    let mensajeRestriccionCorreosElectronicos = '';
    this._translateService.get('mensajeRestriccionCorreosElectronicos').take(1).subscribe(
      data => mensajeRestriccionCorreosElectronicos = data
    );
    let si = '';
    this._translateService.get('si').take(1).subscribe(data => si = data);
    let no = '';
    this._translateService.get('no').take(1).subscribe(data => no = data);
    swal({
      title: agregarCorreosElectronicos,
      html: '<div class="form-group label-floating" xmlns="http://www.w3.org/1999/html">' +
      '<label class="control-label">' + correosElectronicos + '<span class="star">*</span> </label>' +
      '<textarea id="correos" type="text" class="form-control"/></textarea> ' +
      '<label>' + mensajeRestriccionCorreosElectronicos + '</label>' +
      '</div>',
      allowOutsideClick: false,
      preConfirm: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            let bandera = true;
            const regExp =
              /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            let correos = $('#correos').val();
            correos = correos.split(',');
            const correosInvalidos = correos.filter(function(correo){
              if (!regExp.test(correo)) {
                bandera = false;
                return true;
              } else {
                return false;
              }
            });

            if (!bandera) {
              swal.showValidationError();
              reject(new Error(correosInvalidos));
            }else {
              resolve(correos);
            }
          }, 500);
        });
      },
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: si,
      cancelButtonText: no,
      buttonsStyling: false
    }).then(function(correos) {
      if (that.comprobante !== undefined) {
        const serie = that.comprobante.value.vcSerie;
        const correlativo = that.comprobante.value.vcCorrelativo;
        const tipoComprobante = that.comprobante.value.vcTipocomprobante;
        // const fechaEmision = new Date(that.comprobante.value.tsFechaemision).toISOString();
        const fechaEmision = that.comprobante.value.tsFechacreacion;
        const ubicacion = that.comprobante.value.inIdcomprobantepago + '-1.pdf';
        const ubicacionXml = that.comprobante.value.inIdcomprobantepago + '-2.xml';
        that._correoService.enviarNotificacion(correos, tipoComprobante, serie, correlativo, fechaEmision, ubicacion, ubicacionXml);
      }
    });
  }

  guardarArchivo(archivo: TipoArchivo) {
    this._archivoService.descargararchivotipo(this.comprobante.value.inIdcomprobantepago, archivo.idArchivo);
  }
}
