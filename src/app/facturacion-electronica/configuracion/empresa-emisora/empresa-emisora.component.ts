import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EntidadService} from '../../general/services/organizacion/entidad.service';
import {Entidad} from '../../general/models/organizacion/entidad';
import {ArchivoService} from '../../general/services/archivos/archivo.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TipoArchivoRestriccion} from '../../general/directivas/archivo.directive';
import {TranslateService} from '@ngx-translate/core';
import {ArchivoSubir} from '../models/archivoSubir';
import {ColumnaDataTable} from '../../general/data-table/utils/columna-data-table';
import {Accion, Icono} from '../../general/data-table/utils/accion';
import {TipoAccion} from '../../general/data-table/utils/tipo-accion';
import {DatePipe} from '@angular/common';
import {TiposService} from '../../general/utils/tipos.service';
import {DataTableComponent} from '../../general/data-table/data-table.component';
import {ArchivoXml} from '../models/archivo-xml';
import {EstilosServices} from '../../general/utils/estilos.services';


@Component({
  selector: 'app-empresa-emisora',
  templateUrl: './empresa-emisora.component.html',
  styleUrls: ['./empresa-emisora.component.css']
})
export class EmpresaEmisoraComponent implements OnInit {
  public empresaEmisoraFormGroup: FormGroup;
  titulo= '';
  public entidad: Entidad;

  columnasTabla: ColumnaDataTable[];
  accionesTabla: Accion[];
  ordenarPorElCampo: string;
  idModal: string;

  nombreModal: string;

  @ViewChild('tabla') tabla: DataTableComponent<ArchivoXml>;


  @ViewChild('imagen_cloud') imagenCloud: ElementRef;

  certificadoSeleccionado: BehaviorSubject<FileList>;
  archivoPlantillaSeleccionado: BehaviorSubject<FileList>;
  logoSeleccionado: BehaviorSubject<FileList>;

  public puntero: string;
  public listaitemsmasiva: ArchivoSubir[];

  tiposArchivosPermitidosImagen: TipoArchivoRestriccion;
  tiposArchivosPermitidosCertificado: TipoArchivoRestriccion;
  tiposArchivosPermitidosGeneral: TipoArchivoRestriccion;


  tituloModalGeneral: string;
  tituloModalCertificado: string;

  public plantillaFormGroup: FormGroup;
  public imagenFormGroup: FormGroup;
  public certificadoFormGroup: FormGroup;
  constructor( private router: Router,
               private dataPipe: DatePipe,
               private _estilosService: EstilosServices,
               private _tiposService: TiposService,
               private route: ActivatedRoute,
               private organizaciones: EntidadService,
               private archivos: ArchivoService,
               private _translateService: TranslateService
  ) {
    this.titulo = 'empresaEmisora';
    this.nombreModal = 'modal';
    this.entidad = new Entidad();
    this.columnasTabla = [
      new ColumnaDataTable('comprobante', 'comprobante'),
      new ColumnaDataTable('archivosubido', 'plantillaInterfaz', {'text-align': 'left'}),
      new ColumnaDataTable('fecha', 'plantillaTiempoFecha'),
      new ColumnaDataTable('hora', 'plantillaTiempoHora')
    ];
    this.ordenarPorElCampo = 'comprobante';
    this.idModal = 'id';
    this.accionesTabla = [
      new Accion('subir', new Icono('file_upload', 'btn-info'), TipoAccion.SUBIR, 'id',
        [
          this._tiposService.TIPO_DOCUMENTO_FACTURA,
          this._tiposService.TIPO_DOCUMENTO_BOLETA,
          this._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO,
          this._tiposService.TIPO_DOCUMENTO_NOTA_DEBITO,
          this._tiposService.TIPO_DOCUMENTO_PERCEPCION,
          this._tiposService.TIPO_DOCUMENTO_RETENCION
        ]),
      new Accion('descargar', new Icono('file_download', 'btn-info'), TipoAccion.DESCARGAR, 'plantillaInterfaz'),
      new Accion('agregar', new Icono('add_circle', 'btn-info'), TipoAccion.AGREGAR)
    ];
    this.puntero = '';
    this.listaitemsmasiva = [];

    let seleccionarPlantillaXML = '';
    this._translateService.get('seleccionarPlantilla', {tipoArchivo: 'XML'}).take(1).subscribe( traducir => seleccionarPlantillaXML = traducir);
    this.tituloModalGeneral = seleccionarPlantillaXML;
    let seleccionarPlantillaPFX = '';
    this._translateService.get('seleccionarPlantilla', {tipoArchivo: 'PFX'}).take(1).subscribe( traducir => seleccionarPlantillaPFX = traducir);
    this.tituloModalCertificado = seleccionarPlantillaPFX;

    this.tiposArchivosPermitidosImagen = ['image/png', 'image/jpeg'];
    this.tiposArchivosPermitidosCertificado = ['application/x-pkcs12'];
    this.tiposArchivosPermitidosGeneral = ['application/xml', 'text/xml'];
    this.archivoPlantillaSeleccionado = new BehaviorSubject(null);
    this.certificadoSeleccionado = new BehaviorSubject(null);
    this.logoSeleccionado = new BehaviorSubject(null);
    this.plantillaFormGroup = new FormGroup({
      plantilla: new FormControl('', [Validators.required])
    });
    this.imagenFormGroup = new FormGroup({
      imagen: new FormControl('')
    });
    this.certificadoFormGroup = new FormGroup({
      certificado: new FormControl('')
    });
  }

  ngOnInit() {
    this.initform();
  }

  private initform() {
    this.empresaEmisoraFormGroup = new FormGroup({
      'txtRuc': new FormControl({value: '', disabled: true}, [Validators.required]),
      'txtRazonSocial': new FormControl({value: '', disabled: true}, [Validators.required]),
      'txtNombreComercial': new FormControl({value: '', disabled: true}, [Validators.required]),
      'txtDomicilioFiscal': new FormControl({value: '', disabled: true}, [Validators.required]),
      'txtCorreoElectronico': new FormControl({value: '', disabled: false}, [Validators.required]),
      'txtUsuarioSol': new FormControl({value: '', disabled: false}, [Validators.required]),
      'txtClaveSol': new FormControl({value: '', disabled: false}, [Validators.required]),
      'txtClaveCertificadoDigital': new FormControl({value: '', disabled: false}, [Validators.required]),
      'txtClaveLlave': new FormControl({value: '', disabled: false}, [Validators.required]),
      'checkBoxRecibirNotificaciones': new FormControl(false)
    });
  }

  cambioEntidad() {
    if (
      this.entidad.correoElectronico !== this.empresaEmisoraFormGroup.controls['txtCorreoElectronico'].value ||
      this.entidad.solUsuario !== this.empresaEmisoraFormGroup.controls['txtUsuarioSol'].value ||
      this.entidad.solClave !== this.empresaEmisoraFormGroup.controls['txtClaveSol'].value ||
      this.entidad.certificadoDigitalClave !== this.empresaEmisoraFormGroup.controls['txtClaveCertificadoDigital'].value ||
      this.entidad.certificadoDigitalClaveLlave !== this.empresaEmisoraFormGroup.controls['txtClaveLlave'].value ||
      this.verificarNotificaciones() ||
      this.verificarCertificado() ||
      this.verificarLogo()
    ) {
      return true;
    }
    return false;
  }

  verificarNotificaciones() {
    const recibirNotificaciones = this.empresaEmisoraFormGroup.controls['checkBoxRecibirNotificaciones'].value ? 'S' : 'N';
    return this.entidad.recibirNotificaciones !== recibirNotificaciones;
  }

  verificarCertificado() {
    if (
      this.certificadoSeleccionado.value && this.certificadoSeleccionado.value[0] &&
      this.entidad.certificadoDigitalCloud !== this.certificadoSeleccionado.value[0].name
    ) {
      return true;
    }
    return false;
  }

  verificarLogo() {
    if (
      this.logoSeleccionado.value && this.logoSeleccionado.value[0] &&
      this.entidad.logoCloud !== this.logoSeleccionado.value[0].name
    ) {
      return true;
    }
    return false;
  }

  busquedaruc() {
      const listaEntidades = this.organizaciones.buscarPorRuc(localStorage.getItem('org_ruc'));
      if (listaEntidades != null) {
        listaEntidades.subscribe(
          data => {
            if (data) {
              this.entidad = data ? data : new Entidad();
              this.empresaEmisoraFormGroup.controls['txtRuc'].setValue(this.entidad.documento);
              this.empresaEmisoraFormGroup.controls['txtRazonSocial'].setValue(this.entidad.denominacion);
              this.empresaEmisoraFormGroup.controls['txtNombreComercial'].setValue(this.entidad.nombreComercial);
              this.empresaEmisoraFormGroup.controls['txtDomicilioFiscal'].setValue(this.entidad.direccionFiscal);
              this.empresaEmisoraFormGroup.controls['txtCorreoElectronico'].setValue(this.entidad.correoElectronico);
              this.empresaEmisoraFormGroup.controls['txtUsuarioSol'].setValue(this.entidad.solUsuario);
              this.empresaEmisoraFormGroup.controls['txtClaveSol'].setValue(this.entidad.solClave);
              this.empresaEmisoraFormGroup.controls['txtClaveCertificadoDigital'].setValue(this.entidad.certificadoDigitalClave);
              this.empresaEmisoraFormGroup.controls['txtClaveLlave'].setValue(this.entidad.certificadoDigitalClaveLlave);
              const habilitarNotificaciones = this.entidad.recibirNotificaciones === 'S' ? true : false;
              this.empresaEmisoraFormGroup.controls['checkBoxRecibirNotificaciones'].setValue(habilitarNotificaciones);
              this.nueva_imagen(this.entidad.logoCloud);
              const factura = new ArchivoXml(
                this._tiposService.TIPO_DOCUMENTO_FACTURA,
                'Factura',
                this.entidad.plantillaFacturaCloud,
                this.entidad.plantillaFacturaInterfaz,
                this.dataPipe.transform(this.entidad.plantillaFacturaTiempo, 'dd/MM/yyyy' ),
                this.dataPipe.transform(this.entidad.plantillaFacturaTiempo, 'h:mm:ss' )
              );
              const boleta = new ArchivoXml(
                this._tiposService.TIPO_DOCUMENTO_BOLETA,
                'Boleta',
                this.entidad.plantillaBoletaCloud,
                this.entidad.plantillaBoletaInterfaz,
                this.dataPipe.transform(this.entidad.plantillaBoletaTiempo, 'dd/MM/yyyy' ),
                this.dataPipe.transform(this.entidad.plantillaBoletaTiempo, 'h:mm:ss' )
              );
              const notaCredito = new ArchivoXml(
                this._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO,
                'Nota de Crédito',
                this.entidad.plantillaNotaCreditoCloud,
                this.entidad.plantillaNotaCreditoInterfaz,
                this.dataPipe.transform(this.entidad.plantillaNotaCreditoTiempo, 'dd/MM/yyyy' ),
                this.dataPipe.transform(this.entidad.plantillaNotaCreditoTiempo, 'h:mm:ss' )
              );
              const notaDebito = new ArchivoXml(
                this._tiposService.TIPO_DOCUMENTO_NOTA_DEBITO,
                'Nota de Débito',
                this.entidad.plantillaNotaDebitoCloud,
                this.entidad.plantillaNotaDebitoInterfaz,
                this.dataPipe.transform(this.entidad.plantillaNotaDebitoTiempo, 'dd/MM/yyyy' ),
                this.dataPipe.transform(this.entidad.plantillaNotaDebitoTiempo, 'h:mm:ss' )
              );
              const retencion = new ArchivoXml(
                this._tiposService.TIPO_DOCUMENTO_RETENCION,
                'Retención',
                this.entidad.plantillaRetencionCloud,
                this.entidad.plantillaRetencionInterfaz,
                this.dataPipe.transform(this.entidad.plantillaRetencionTiempo, 'dd/MM/yyyy' ),
                this.dataPipe.transform(this.entidad.plantillaRetencionTiempo, 'h:mm:ss' )
              );
              const percepcion = new ArchivoXml(
                this._tiposService.TIPO_DOCUMENTO_PERCEPCION,
                'Percepción',
                this.entidad.plantillaPercepcionCloud,
                this.entidad.plantillaPercepcionInterfaz,
                this.dataPipe.transform(this.entidad.plantillaPercepcionTiempo, 'dd/MM/yyyy' ),
                this.dataPipe.transform(this.entidad.plantillaPercepcionTiempo, 'h:mm:ss' )
              );
              const resumenBajasBolestasFacturasNotas = new ArchivoXml(
                this._tiposService.TIPO_DOCUMENTO_COMUNICACION_BAJA_FACTURA_BOLETA_NOTAS,
                'Resumen Bajas Boletas/Facturas/Notas',
                null,
                null,
                null,
                null
              );
              const resumenDiarioBoletas = new ArchivoXml(
                this._tiposService.TIPO_DOCUMENTO_RESUMEN_BOLETAS,
                'Resumen Diario Boletas',
                null,
                null,
                null,
                null
              );
              const resumenBajasPercepcionRetencion = new ArchivoXml(
                this._tiposService.TIPO_DOCUMENTO_COMUNICACION_BAJA_RETENCIONES_PERCEPCIONES,
                'Resumen Bajas Percepción/Retención',
                null,
                null,
                null,
                null
              );
              this.tabla.insertarData(
                [
                  factura,
                  boleta,
                  notaCredito,
                  notaDebito,
                  retencion,
                  percepcion,
                  resumenBajasBolestasFacturasNotas,
                  resumenBajasPercepcionRetencion,
                  resumenDiarioBoletas
                ]
              );
              if (this.entidad.documento) {
                this._estilosService.eliminarEstiloInput('txtRuc', 'is-empty');
              }
              if (this.entidad.denominacion) {
                this._estilosService.eliminarEstiloInput('txtRazonSocial', 'is-empty');
              }
              if (this.entidad.nombreComercial) {
                this._estilosService.eliminarEstiloInput('txtNombreComercial', 'is-empty');
              }
              if (this.entidad.direccionFiscal) {
                this._estilosService.eliminarEstiloInput('txtDomicilioFiscal', 'is-empty');
              }
              if (this.entidad.correoElectronico) {
                this._estilosService.eliminarEstiloInput('txtCorreoElectronico', 'is-empty');
              }
              if (this.entidad.solUsuario) {
                this._estilosService.eliminarEstiloInput('txtUsuarioSol', 'is-empty');
              }
              if (this.entidad.solClave) {
                this._estilosService.eliminarEstiloInput('txtClaveSol', 'is-empty');
              }
              if (this.entidad.certificadoDigitalClave) {
                this._estilosService.eliminarEstiloInput('txtClaveCertificadoDigital', 'is-empty');
              }
              if (this.entidad.certificadoDigitalClaveLlave) {
                this._estilosService.eliminarEstiloInput('txtClaveLlave', 'is-empty');
              }
            }
          }
        );
      }
  }

  iniciarDataTabla() {
    this.busquedaruc();
  }

  ejecutarAccion(event: [TipoAccion, ArchivoXml]) {
    const accion = event[0];
    const archivo = event[1];
    switch (accion) {
      case TipoAccion.AGREGAR:
        this.irASeries(archivo.id);
        break;
      case TipoAccion.DESCARGAR:
        this.archivos.downloadArchivo(archivo.plantillaInterfaz);
        break;
      case TipoAccion.SUBIR:
        this.abrirModalPlantilla(archivo.comprobante, archivo.id);
        break;
    }
  }
  nueva_imagen (imagen: string) {
    this.archivos.searcharchivo(imagen)
      .subscribe(
        data => {
          if (data) {
              this.imagenCloud.nativeElement.src = 'data:image/png;base64,' + data;
          }
        }
      );
  }

  abrirModalPlantilla(tipo: string, id: string) {
    this.plantillaFormGroup.reset();
    this.archivoPlantillaSeleccionado.next(null);
    $('#' + this.idModal).modal('show');
    this.puntero = id;
  }

  cambioPlantilla(event) {
    this.archivoPlantillaSeleccionado.next(event.target.files);
  }

  cambioLogo(event) {
    this.logoSeleccionado.next(event.target.files);
  }
  cambioCertificado(event) {
    this.certificadoSeleccionado.next(event.target.files);
  }

  eliminarPlantilla() {
    this.plantillaFormGroup.reset();
    this.archivoPlantillaSeleccionado.next(null);
  }

  eliminarCertificado() {
    this.certificadoFormGroup.reset();
    this.certificadoSeleccionado.next(null);
  }

  eliminarLogo() {
    this.imagenFormGroup.reset();
    this.logoSeleccionado.next(null);
  }


  public irASeries(tipo: string) {
    this.router.navigate(['configuracion/empresa-emisora/series/', tipo]);
  }

  public cargarPlantilla(tipoCarga: string) {
    if (this.archivoPlantillaSeleccionado.value) {
      const fecha = new Date().getTime();
      const archivoReader = new FileReader();
      const archivo = this.archivoPlantillaSeleccionado.value[0];
      archivoReader.readAsDataURL(archivo);
      let archivoBase64 = '';
      const that = this;
      archivoReader.onload = function (event) {
        archivoBase64 = archivoReader.result.split(',')[1];
        const documento: string = localStorage.getItem('org_ruc');
        const data: string = archivoBase64;
        const archivoEntrada: ArchivoSubir = new ArchivoSubir();
        switch (tipoCarga) {
          case that._tiposService.TIPO_DOCUMENTO_FACTURA:
            archivoEntrada.cargarFactura(documento, data, fecha, archivo.name);
            break;
          case that._tiposService.TIPO_DOCUMENTO_BOLETA:
            archivoEntrada.cargarBoleta(documento, data, fecha, archivo.name);
            break;
          case that._tiposService.TIPO_DOCUMENTO_NOTA_DEBITO:
            archivoEntrada.cargarNotaDebito(documento, data, fecha, archivo.name);
            break;
          case that._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO:
            archivoEntrada.cargarNotaCredito(documento, data, fecha, archivo.name);
            break;
          case that._tiposService.TIPO_DOCUMENTO_PERCEPCION:
            archivoEntrada.cargarPercepcion(documento, data, fecha, archivo.name);
            break;
          case that._tiposService.TIPO_DOCUMENTO_RETENCION:
            archivoEntrada.cargarRetencion(documento, data, fecha, archivo.name);
            break;
        }
        that.organizaciones.actualizar_entidad(archivoEntrada).subscribe(
          data2 => {
            if (data2) {
              that.plantillaFormGroup.reset();
              that.archivoPlantillaSeleccionado.next(null);
              setTimeout(function () {
                that.busquedaruc();
              }, 3000);
              $('#' + that.idModal).modal('hide');
            }
          },
          error => {
            console.log(error);
          }

        );

      };
    }
  }


  public cargarImagen(archivoEntrada: ArchivoSubir) {
    if (this.logoSeleccionado.value) {
      const archivoReaderCertificado = new FileReader();
      const archivoimg = this.logoSeleccionado.value[0];
      archivoReaderCertificado.readAsDataURL(archivoimg);
      let archivoBase64img = '';

      archivoReaderCertificado.onload = function (event) {
        archivoBase64img = archivoReaderCertificado.result.split(',')[1];
        const documento: string = localStorage.getItem('org_ruc');
        const data: string = archivoBase64img;
        archivoEntrada.cargarLogo(documento, data);
      };
    }
  }

  public cargarCertificadoDigital(archivoEntrada: ArchivoSubir) {
    if (this.certificadoSeleccionado.value) {
      const archivoReaderCertificado = new FileReader();
      const archivoCertificado = this.certificadoSeleccionado.value[0];
      archivoReaderCertificado.readAsDataURL(archivoCertificado);
      let archivoBase64img = '';

      archivoReaderCertificado.onload = function (event) {
        archivoBase64img = archivoReaderCertificado.result.split(',')[1];
        const documento: string = localStorage.getItem('org_ruc');
        const data: string = archivoBase64img;
        archivoEntrada.cargarCertificado(documento, data);
      };
    }
  }

  cargarDatosFormulario(archivoEntrada: ArchivoSubir) {
    archivoEntrada.cargarDatosEmpresa(
      localStorage.getItem('org_ruc'),
      this.empresaEmisoraFormGroup.controls['txtCorreoElectronico'].value,
      this.empresaEmisoraFormGroup.controls['txtUsuarioSol'].value,
      this.empresaEmisoraFormGroup.controls['txtClaveSol'].value,
      this.empresaEmisoraFormGroup.controls['txtClaveCertificadoDigital'].value,
      this.empresaEmisoraFormGroup.controls['txtClaveLlave'].value,
      this.empresaEmisoraFormGroup.controls['checkBoxRecibirNotificaciones'].value ? 'S' : 'N'
    );
  }

  public actualizarEntidad() {
    const archivoEntrada: ArchivoSubir = new ArchivoSubir();
    this.cargarDatosFormulario(archivoEntrada);
    this.cargarImagen(archivoEntrada);
    this.cargarCertificadoDigital(archivoEntrada);
    const that = this;
    setTimeout(
      () => {
        this.organizaciones.actualizar_entidad(archivoEntrada).subscribe(
          data => {
            if (data) {
              this.imagenFormGroup.reset();
              this.certificadoFormGroup.reset();

              this.certificadoSeleccionado.next(null);
              this.logoSeleccionado.next(null);
              // setTimeout(function () {
                that.busquedaruc();
              // }, 3000);
            }
          },
          error => {
            console.log(error);
          }

        );
      }, 1000
    );
  }
}
