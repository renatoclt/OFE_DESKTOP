import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ArchivoMasiva, ArchivoMasivaEntrada} from '../../../percepcion-retencion/models/archivoMasiva';
import {ProductoMasivoService} from '../../../general/services/inventario/producto-masivo.service';
import {Accion, Icono} from '../../../general/data-table/utils/accion';
import {DataTableComponent} from '../../../general/data-table/data-table.component';
import {TipoAccion} from '../../../general/data-table/utils/tipo-accion';
import {ModoVistaAccion} from '../../../general/data-table/utils/modo-vista-accion';
import {TIPO_ARCHIVO_CSV} from '../../../general/models/archivos/tipoArchivo';
import {ArchivoService} from '../../../general/services/archivos/archivo.service';
import {TiposService} from '../../../general/utils/tipos.service';
import {ColumnaDataTable} from '../../../general/data-table/utils/columna-data-table';
import {FormControl, FormGroup, Validators} from '@angular/forms';
declare var $, swal: any;

@Component({
  selector: 'app-bienes-servicios-masiva',
  templateUrl: './bienes-servicios-masiva.component.html',
  styleUrls: ['./bienes-servicios-masiva.component.css']
})
export class BienesServiciosMasivaComponent implements OnInit {

  public archivo: File | FileList | undefined;

  public columnasTabla: ColumnaDataTable[];
  public ordenarPorElCampoMasiva: string;
  public tipomasiva: any;
  public accionesMasiva: Accion[];
  public parametrosMasiva: HttpParams;
  tipoMetodoMasiva: string;
  urlArchivoMasivaService: string;
  pathFormatoArchivoMasivo: string;
  @ViewChild('tablamasiva') tablamasiva: DataTableComponent<ArchivoMasiva>;

  urlCatalogoSunat: string;

  @ViewChild('inputArchivoMasivo') inputArchivoMasivo: ElementRef;

  productoMasivoFormGroup: FormGroup;
  productoMasivoSeleccionado: BehaviorSubject<FileList>;

  archivoSeleccionado: BehaviorSubject<FileList>;
  constructor(private httpClient: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              private _archivoService: ArchivoService,
              private _tiposService: TiposService,
              private _translateService: TranslateService,
              public _productoMasivoService: ProductoMasivoService) {
    this.archivoSeleccionado = new BehaviorSubject<FileList>(null);
  }

  ngOnInit() {
    this.inicializarVariables();
  }

  inicializarVariables() {
    this.productoMasivoFormGroup = new FormGroup({
      productoMasivo: new FormControl('', Validators.required)
    });
    this.productoMasivoSeleccionado = new BehaviorSubject(null);
    this.urlCatalogoSunat = 'http://contenido.app.sunat.gob.pe/insc/ComprobantesDePago+Electronicos/Detalle+CATALOGO+2,3,4+13.pdf';
    this.ordenarPorElCampoMasiva = 'fecha';
    this.columnasTabla = [
      new ColumnaDataTable('usuario', 'usuario'),
      new ColumnaDataTable('fecha', 'fecha'),
      new ColumnaDataTable('nombreArchivo', 'nombreArchivo'),
      new ColumnaDataTable('tamañoArchivo', 'tamanhoArchivo'),
      new ColumnaDataTable('estado', 'estado')
    ];
    this.tipoMetodoMasiva = this._productoMasivoService.TIPO_ATRIBUTO_DOCUMENTO_MASIVO_QRY;
    this.parametrosMasiva = new HttpParams()
      .set('id_entidad', localStorage.getItem('id_entidad'))
      .set('tipo_doc', this._tiposService.TIPO_PRODUCTO_MASIVA_CODIGO);

    this.urlArchivoMasivaService = this._productoMasivoService.urlProductoMasivoQry;
    this.pathFormatoArchivoMasivo = this._archivoService.pathFormatoArchivoMasivo;
    this.archivoSeleccionado = new BehaviorSubject<FileList>(null);
    this.tipomasiva = ModoVistaAccion.ICONOS;
    this.accionesMasiva = [
      new Accion('visualizar', new Icono('visibility', 'btn-info'), TipoAccion.VISUALIZAR),
      new Accion('descargar', new Icono('file_download', 'btn-info'), TipoAccion.DESCARGAR)
    ];
  }

  cambioProductoMasivo(event) {
    this.productoMasivoSeleccionado.next(event.target.files);
  }

  eliminarProductoMasivo() {
    this.productoMasivoFormGroup.reset();
    this.productoMasivoSeleccionado.next(null);
  }

  public cargarmasiva() {
    const that = this;
    let deseaCargarArchivo = '';
    that._translateService.get('deseaCargarArchivo').take(1).subscribe(data => deseaCargarArchivo = data);
    let deseaCargarArchivos = '';
    that._translateService.get('deseaCargarArchivos').take(1).subscribe(data => deseaCargarArchivos = data);
    let siText = '';
    that._translateService.get('si').take(1).subscribe(data => siText = data);
    let noText = '';
    that._translateService.get('no').take(1).subscribe(data => noText = data);
    let accionCancelada = '';
    that._translateService.get('accionCancelada').take(1).subscribe(data => accionCancelada = data);
    let archivoNoSubido = '';
    that._translateService.get('archivoNoSubido').take(1).subscribe(data => archivoNoSubido = data);
    swal({
      title: deseaCargarArchivo,
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
        this.cargarMasivaArchivo();
      }, (dismiss) => {
        swal(
          accionCancelada,
          '',
          'error'
        );
      });
  }

  public cargarMasivaArchivo() {
    const archivoReader = new FileReader();
    const archivo = this.inputArchivoMasivo.nativeElement.files[0];
    archivoReader.readAsDataURL(archivo);
    let archivoBase64 = '';
    const that = this;
    archivoReader.onload = function (event) {
      archivoBase64 = archivoReader.result.split(',')[1];
      const nombreArchivo: string = archivo.name;
      const tamanhoArchivo: string = ((archivo.size / 1024).toFixed(2)).toString() + 'KB';
      const data: string = archivoBase64;
      const archivoMasivaEntrada: ArchivoMasivaEntrada = new ArchivoMasivaEntrada();
      archivoMasivaEntrada.crearArchivoMasivaEntrada(
        nombreArchivo,
        tamanhoArchivo,
        data
      );


      that._productoMasivoService.cargarProductoMasivo(archivoMasivaEntrada).subscribe(
        data => {
          if (data) {
            setTimeout(
              () => {
                that.productoMasivoFormGroup.reset();
                that.productoMasivoSeleccionado.next(null);
                that.tablamasiva.cargarData();
              }
              , 1000);
          }
        }
      );

    };
  }

  iniciarDataMasiva(evento) {

  }

  ejecutarAccionMasiva(evento: [TipoAccion, ArchivoMasiva]) {
    const tipoAccion = evento[0];
    const archivoMasiva: ArchivoMasiva = evento[1];
    switch (tipoAccion) {
      case TipoAccion.VISUALIZAR:
        this.router.navigate(['bienes-servicios/crear/masiva/detalle/', archivoMasiva.idDocumentoMasivo], {
          queryParams: {
            idDocumentoMasivo: archivoMasiva.idDocumentoMasivo,
            totalRegistros: archivoMasiva.totalRegistros,
            nombreArchivo: archivoMasiva.nombreArchivo,
            totalErrores: archivoMasiva.totalRegistrosErroneos,
          }, skipLocationChange: true
        });
        break;
      case TipoAccion.DESCARGAR:
        this._archivoService.descargararchivotipo(archivoMasiva.nombreArchivo, TIPO_ARCHIVO_CSV.idArchivo);
        break;
    }
  }

  descargarFormatoMasiva() {
    this._archivoService.descargarFormatoProductoMasiva();
  }

  abrirEnlace() {
    window.open(this.urlCatalogoSunat, '_blank', 'width=800,height=800');
    return false;
  }
}
