import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { DetalleOrdenCompra } from 'app/model/detalleordencompra';
import { BuscarOrdenCompra } from 'app/model/buscarordencompra';
import { ClienteBuscar } from 'app/model/cliente';

import { DetalleFactura, Factura, ClienteFiltros, GuiaFiltros } from 'app/model/factura/cl-factura';
import { ConformidadServicioFiltros } from 'app/model/conformidadservicio';
import { TransporteServicioFiltros } from 'app/model/transporteservicio';

import { GuiaBuscar } from 'app/model/sm-guia';
import { Archivo } from 'app/model/archivo';
import { AppUtils } from 'app/utils/app.utils';
import { MasterService } from 'app/service/masterservice';
import { AdjuntoService } from 'app/service/adjuntoservice';
import { ComboItem } from 'app/model/comboitem';
import { FacturaService } from 'app/service/factura/cl-facturaservice';
import { GuiaService } from 'app/service/guiaservice';
import { ConformidadServicioService } from 'app/service/conformidadservicioservice';
import { TransporteServicioService } from 'app/service/transporteservicioservice';

import 'app/../assets/js/plugins/jquery.PrintArea.js';
import { BASE_URL, URL_BUSCAR_ORGANIZACION, URL_BUSCAR_GUIA, URL_BUSCAR_HAS, URL_BUSCAR_TRANSPORTE } from 'app/utils/app.constants';

import { } from 'app/utils/app.constants';
import { Usuario } from 'app/model/usuario';
import { LoginService } from 'app/service/login.service';
import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}
declare var moment, swal, saveAs: any;
declare var $,numeral: any;
declare var DatatableFunctions: any;
var oFacturaProveedorFormularioComponent: FacturaProveedorFormularioComponentPre,
    dtArticulos, dtArticulosHAS, dtClientes, dtGuias, dtBuscarAceptacionServicio, dtBuscarTicketTransporte,
    dtArchivos, archivo: Archivo;

@Component({
  moduleId: module.id,
  selector: 'facturaproveedorformulario-cmp',
  templateUrl: 'facturaproveedorformulario.component.html',
  providers: [AdjuntoService, MasterService, FacturaService, LoginService,
              GuiaService, ConformidadServicioService, TransporteServicioService]
})

export class FacturaProveedorFormularioComponentPre implements OnInit, OnChanges, AfterViewInit {

  public listPaises: ComboItem[];
  public listEstadoGuia: ComboItem[];
  public listEstadoHAS: ComboItem[];
  public listEstadoCombo: ComboItem[];
  public listTipoComprobante: ComboItem[];
  public step: number;
  public id: string;
  public esBorrador: string;
  public id_doc: string;
  public toggleButton: boolean;
  private activatedRoute: ActivatedRoute;
  public factura: Factura;

  public filtroCliente: ClienteFiltros;
  public filtroGuia: GuiaFiltros;
  public usuarioActual: Usuario;
  public filtrohas: ConformidadServicioFiltros;
  public filtroticket: TransporteServicioFiltros;

  public ticket_igv: string;
  public ticket_subtotal: string;
  public ticket_importetotal: string;

  util: AppUtils;

  public archivo: Archivo;

  public btnSeleccionar: boolean;

  public listMonedaCombo: ComboItem[];
  public listDetraccionCombo: ComboItem[];
  public botonImprimir: Boton = new Boton();
  public botonEdicion: Boton = new Boton();
  public botonDescartar: Boton = new Boton();
  public botonGuardar: Boton = new Boton();
  public botonEnviar: Boton = new Boton();
  public botonRegistar: Boton = new Boton();

  public url_main_module_page = '/cl-factura/proveedor/buscar';
  public deshabilitarTipoDocumento: boolean;
  public porcentajeIGV: number;
  public anteriorBaseFactura: string;

  constructor(private router: Router, private route: ActivatedRoute,
              private _masterService: MasterService, private _dataServiceAdjunto: AdjuntoService,
              private _dataService: FacturaService, private _dataGuiaService: GuiaService,
              private _dataHASService: ConformidadServicioService, private _dataTicketService: TransporteServicioService,
              private _securityService: LoginService, private cdRef: ChangeDetectorRef) {
      this.filtroClienteDefecto();
      this.filtroGuiaDefecto();
      this.filtroDefectoHAS();
      this.filtroDefectoTicket();

      this.activatedRoute = route;

      this.util = new AppUtils(this.router, this._masterService);
      this.archivo = new Archivo();
      this.factura = new Factura();
      this.deshabilitarTipoDocumento = false;
      this.porcentajeIGV = 0.18;
      this.btnSeleccionar = false;

      this.ticket_igv = '';
      this.ticket_subtotal = '';
      this.ticket_importetotal = '';

      this.step = 1;
      this.id = '0';
      this.esBorrador = '0';
      this.id_doc = '';
      this.toggleButton = true;

      this.factura.detallefactura = [];

      this.factura.basefactura='guia';
      this.anteriorBaseFactura='guia';
  }

  ngOnInit() {
    /*
        var oTable = $('#dtArticulos').dataTable();
        oTable.fnDestroy();

        var oTable = $('#dtArticulosHAS').dataTable();
        oTable.fnDestroy();
    */

    $('#mdlBuscarCliente').on('hidden.bs.modal', function () {
        oFacturaProveedorFormularioComponent.btnSeleccionar = false;
    });
    $('#mdlBuscarCliente').on('shown.bs.modal', function () {
        oFacturaProveedorFormularioComponent.btnSeleccionar = false;
    });
    $('#mdlGuias').on('hidden.bs.modal', function () {
        oFacturaProveedorFormularioComponent.btnSeleccionar = false;
    });
    $('#mdlGuias').on('shown.bs.modal', function () {
        oFacturaProveedorFormularioComponent.btnSeleccionar = false;
    });

    this.usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    //  this.factura = new Factura();

    this.activatedRoute.params.subscribe((params: Params) => {
        this.id = params['id'];
        this.esBorrador = params['b'];
        this.id_doc = params['c'];
    });

    if (this.id != '0') {
        this.step = 2;
        this.toggleButton = true;
        $('#btnAgregarItemOC').addClass('disabled');
        $('#btnEliminarItemOC').addClass('disabled');
        $('#secCabecera').hide();
        $('#secFactura').show();
        $('.rowEditar').show();
    } else {
        this.toggleButton = false;
        this.esBorrador = '1';
        $('#secCabecera').show();
        $('#secFactura').hide();
        $('.rowEditar').hide();

        this.factura.razonsocialproveedor = localStorage.getItem('org_nombre');
        this.factura.rucproveedor = localStorage.getItem('org_ruc').replace('PE', '');

        this.factura.tipodocumento = 'Factura';
    }

    oFacturaProveedorFormularioComponent = this;

    this.util.listEstadoGuia(function (data: ComboItem[]) {
        oFacturaProveedorFormularioComponent.listEstadoGuia = data.filter(e => e.valor == 'GACEP' || e.valor == 'GFPAR');
    });

    this.util.listEstadoHAS(function (data: ComboItem[]) {
        // || e.valor == "HANUL" || e.valor == "HFACT"
        oFacturaProveedorFormularioComponent.listEstadoHAS = data.filter(e => e.valor == 'HACEP' || e.valor == 'HFPAR');
    });

    this.util.listPaises(function (data: ComboItem[]) {
        oFacturaProveedorFormularioComponent.listPaises = data;
    });

    this.util.listMonedas(function (data: ComboItem[]) {
        oFacturaProveedorFormularioComponent.listMonedaCombo = data;
    });

    this.util.listEstadoCP(function (data: ComboItem[]) {
        oFacturaProveedorFormularioComponent.listEstadoCombo = data;
    });

    this.util.listTipoComprobante(function (data: ComboItem[]) {
        oFacturaProveedorFormularioComponent.listTipoComprobante = data;

    });

    this.util.listUnidadMedida(function (data: ComboItem[]) {
    });

    this.util.listDetraccion(function(data: ComboItem[]){
        oFacturaProveedorFormularioComponent.listDetraccionCombo = data;
    })

  }

  public navigate(nav) {
      this.router.navigate(nav, { relativeTo: this.activatedRoute });
  }

  filtroGuiaDefecto() {
      const fechacreacioni = new Date();
      fechacreacioni.setMonth(fechacreacioni.getMonth() - 1);
      this.filtroGuia = {
          nroguia: '',
          estado: 'NONE',
          fechaemitidadesde: fechacreacioni,
          fechaemitidahasta: new Date(),
      }
  }

  filtroClienteDefecto() {
      this.filtroCliente = {
          ruccodigo: '',
          ruc: '',
          razonsocial: '',
      }
  }

  filtroDefectoHAS() {
      const fechacreacioni = new Date();
      fechacreacioni.setDate(fechacreacioni.getDate() - 30);
      this.filtrohas = {
          nroconformidadservicio: '',
          nroordenservicio: '',
          estado: 'NONE',
          fechacreacioninicio: fechacreacioni,
          fechacreacionfin: new Date(),
          nroerp: '',
      }
  }

  filtroDefectoTicket() {
      const fechacreacioni = new Date();
      fechacreacioni.setDate(fechacreacioni.getDate() - 30);
      this.filtroticket = {
          documentoERP: '',
          estado: 'NONE',
          fechacreacioninicio: fechacreacioni,
          fechacreacionfin: new Date(),
          nroguia: ''
      }
  }


  obtenerBotones() {
      const botonesCache = this._securityService.ObtenerBotonesCache(this.url_main_module_page) as Boton[];
      if (botonesCache) {
        console.log('ObtenerBotonesCache', botonesCache);
        this.configurarBotones(botonesCache);
      }else {
          this._securityService.obtenerBotones(this.url_main_module_page).subscribe(
          botones => {
              console.log('obtenerBotones', botones);
              oFacturaProveedorFormularioComponent.configurarBotones(botones);
              oFacturaProveedorFormularioComponent._securityService.guardarBotonesLocalStore(this.url_main_module_page, botones);
          },
          e => console.log(e),
          () => { });
      }
  }

  configurarBotones(botones: Boton[]) {
      if (botones && botones.length > 0) {
          this.botonImprimir = botones.find(a => a.nombre === 'imprimir') ? botones.find(a => a.nombre === 'imprimir') : this.botonImprimir;
          this.botonDescartar = botones.find(a => a.nombre === 'descartarborrador') ? botones.find(a => a.nombre === 'descartarborrador') : this.botonDescartar;
          this.botonEdicion = botones.find(a => a.nombre === 'habilitaredicion') ? botones.find(a => a.nombre === 'habilitaredicion') : this.botonEdicion;
          this.botonEnviar = botones.find(a => a.nombre === 'enviar') ? botones.find(a => a.nombre === 'enviar') : this.botonEnviar;
          this.botonGuardar = botones.find(a => a.nombre === 'guardar') ? botones.find(a => a.nombre === 'guardar') : this.botonGuardar;      
          this.botonRegistar = botones.find(a => a.nombre === 'registrarcomprobante') ? botones.find(a => a.nombre === 'registrarcomprobante') : this.botonRegistar;
      }
  }

  agregarArchivo(event) {
      this.archivo = new Archivo();
      this.archivo.nombreblob = 'org/' + localStorage.getItem('org_ruc') + '/cp/' + DatatableFunctions.newUUID();
      $('#btnEliminarAA').click();

      $('#txtArchivo').val(null);
      event.preventDefault();
  }



  BuscarHasClicked(event) {
      if (this.validarfiltrosHAS()){
          dtBuscarAceptacionServicio.ajax.reload();
      }
      event.preventDefault();
  }

  BuscarTicketClicked(event) {
      if (this.validarfiltrosTicket()){
          dtBuscarTicketTransporte.ajax.reload();
      }
      event.preventDefault();
  }

  validarfiltrosHAS() {
      oFacturaProveedorFormularioComponent.filtrohas.nroconformidadservicio = oFacturaProveedorFormularioComponent.filtrohas.nroconformidadservicio.trim();
      oFacturaProveedorFormularioComponent.filtrohas.nroerp = oFacturaProveedorFormularioComponent.filtrohas.nroerp.trim();

      if (this.filtrohas.nroconformidadservicio == '') {
            if (this.filtrohas.fechacreacioninicio == null || this.filtrohas.fechacreacioninicio.toString() == "") {
                swal({
                    text: 'Fecha de Aceptación inicio es un campo requerido.',
                    type: 'warning',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-warning'
                });
                return false;
            }

            if (this.filtrohas.fechacreacionfin == null || this.filtrohas.fechacreacionfin.toString() == "") {
                swal({
                    text: 'Fecha de Aceptación fin es un campo requerido.',
                    type: 'warning',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-warning'
                });
                return false;
            }

            if (this.filtrohas.fechacreacioninicio != null && this.filtrohas.fechacreacioninicio.toString() != "" && this.filtrohas.fechacreacionfin != null && this.filtrohas.fechacreacionfin.toString() != "") {
                  let fechaemisioninicio = DatatableFunctions.ConvertStringToDatetime(oFacturaProveedorFormularioComponent.filtrohas.fechacreacioninicio);
                  let fechaemisionfin = DatatableFunctions.ConvertStringToDatetime(oFacturaProveedorFormularioComponent.filtrohas.fechacreacionfin);

                  if (moment(fechaemisionfin).diff(fechaemisioninicio, 'days') > 30) {
                      swal({
                        text: 'El filtro de búsqueda "Fecha de Aceptación" debe tener un rango máximo de 30 días entre la Fecha Inicial y la Fecha Fin.',
                        type: 'warning',
                        buttonsStyling: false,
                        confirmButtonClass: "btn btn-warning"
                      });

                      return false;
                  }

                  let fechaemisioninicio_str = DatatableFunctions.FormatDatetimeForMicroService(fechaemisioninicio);
                  let fechaemisionfin_str = DatatableFunctions.FormatDatetimeForMicroService(fechaemisionfin);

                  if (fechaemisioninicio_str > fechaemisionfin_str) {
                      swal({
                        text: "El rango de Fechas de Aceptación seleccionado no es correcto. La Fecha Inicial es mayor a la Fecha Fin.",
                        type: 'warning',
                        buttonsStyling: false,
                        confirmButtonClass: "btn btn-warning"
                      });

                      return false;
                  }
            }
      }
      return true;
  }

  validarfiltrosTicket() {
    oFacturaProveedorFormularioComponent.filtrohas.nroconformidadservicio = oFacturaProveedorFormularioComponent.filtrohas.nroconformidadservicio.trim();
    oFacturaProveedorFormularioComponent.filtrohas.nroerp = oFacturaProveedorFormularioComponent.filtrohas.nroerp.trim();

    if (this.filtrohas.nroconformidadservicio == '') {
          if (this.filtrohas.fechacreacioninicio == null || this.filtrohas.fechacreacioninicio.toString() == "") {
              swal({
                  text: 'Fecha de Aceptación inicio es un campo requerido.',
                  type: 'warning',
                  buttonsStyling: false,
                  confirmButtonClass: 'btn btn-warning'
              });
              return false;
          }

          if (this.filtrohas.fechacreacionfin == null || this.filtrohas.fechacreacionfin.toString() == "") {
              swal({
                  text: 'Fecha de Aceptación fin es un campo requerido.',
                  type: 'warning',
                  buttonsStyling: false,
                  confirmButtonClass: 'btn btn-warning'
              });
              return false;
          }

          if (this.filtrohas.fechacreacioninicio != null && this.filtrohas.fechacreacioninicio.toString() != "" && this.filtrohas.fechacreacionfin != null && this.filtrohas.fechacreacionfin.toString() != "") {
                let fechaemisioninicio = DatatableFunctions.ConvertStringToDatetime(oFacturaProveedorFormularioComponent.filtrohas.fechacreacioninicio);
                let fechaemisionfin = DatatableFunctions.ConvertStringToDatetime(oFacturaProveedorFormularioComponent.filtrohas.fechacreacionfin);

                if (moment(fechaemisionfin).diff(fechaemisioninicio, 'days') > 30) {

                  swal({
                    text: 'El filtro de búsqueda "Fecha de Aceptación" debe tener un rango máximo de 30 días entre la Fecha Inicial y la Fecha Fin.',
                    type: 'warning',
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-warning"
                  });

                  return false;
                }

                let fechaemisioninicio_str = DatatableFunctions.FormatDatetimeForMicroService(fechaemisioninicio);
                let fechaemisionfin_str = DatatableFunctions.FormatDatetimeForMicroService(fechaemisionfin);

                if (fechaemisioninicio_str > fechaemisionfin_str) {
                  swal({
                    text: "El rango de Fechas de Aceptación seleccionado no es correcto. La Fecha Inicial es mayor a la Fecha Fin.",
                    type: 'warning',
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-warning"
                  });

                  return false;
                }
          }
    }
    return true;
}
















  async  AgregarArticulosGuia(event) {
    this.btnSeleccionar = true;

    event.preventDefault();
    const checkboxGuias = $('#dtBuscarGuia').find('.checkboxGuia:checked');
    if (checkboxGuias.length <= 0) {
        swal({
            text: 'Debe seleccionar una Guía.',
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-warning'
        });
        this.btnSeleccionar = false;
        return false;
    }

    for (const checkboxGuia of checkboxGuias) {
        // oFacturaProveedorFormularioComponent.factura.detallefactura
        const id_doc = $(checkboxGuia).val();
        const oc = await this._dataGuiaService
                           .obtener(id_doc).toPromise();

        let arrArticulos = null;
        try {
          arrArticulos = oFacturaProveedorFormularioComponent.factura.detallefactura.filter(a => a.IdGuia == id_doc);
        } catch(e) {};

        if (arrArticulos != null && oc.articulos.length == arrArticulos.length) {
            swal({
              text: 'No se puede volver a agregar la Guía #' + $(checkboxGuia).attr('numguia') + '.',
              type: 'warning',
              buttonsStyling: false,
              confirmButtonClass: 'btn btn-warning'
            });
            this.btnSeleccionar = false;
            return false;
        }
    }

    let lista_ordenado: DetalleFactura[] = [];
    if (oFacturaProveedorFormularioComponent.factura.detallefactura != null) {
        lista_ordenado = oFacturaProveedorFormularioComponent.factura.detallefactura.sort((n, n1): number => {
            this.btnSeleccionar = false;
            if (n.noitem < n1.noitem) {return -1};
            if (n.noitem > n1.noitem) {return 1};
            return 0;
        });
    } else {
        oFacturaProveedorFormularioComponent.factura.detallefactura = [];
    }

    let max_nroitem = 1;
    if (lista_ordenado.length > 0) {
      max_nroitem = DatatableFunctions.StringToNumber(lista_ordenado[lista_ordenado.length - 1].noitem) + 1;
    }

    let subtotalitemoc = 0;
    let subtotal = 0;
    subtotal = DatatableFunctions.StringToNumber(oFacturaProveedorFormularioComponent.factura.subtotal);

    for (const checkboxGuia of checkboxGuias) {
          const id_doc = $(checkboxGuia).val();
          const oc = await this._dataGuiaService
                             .obtener(id_doc).toPromise();

          for (const producto of oc.articulos) {

                if (oFacturaProveedorFormularioComponent.factura.detallefactura.find(a => a.IdProdxGuia == producto.IdProdxGuia) != null) {
                  continue;
                }

                // alert(producto.IdRegistroUnidad);

                const item_pos: number = max_nroitem++;
                oFacturaProveedorFormularioComponent.factura.detallefactura.push({
                    // noitem: item_pos,
                    noitem: producto.NumeroMaterial,
                    IdGuia: oc.id,
                    IdOc: oc.id,
                    noguia: oc.nroguia,
                    nooc: producto.nrooc,
                    noitemoc: producto.nroitemoc,
                    noparte: producto.nroparte,
                    descproducto: producto.descproducto,
                    preciounitreferencial: DatatableFunctions.FormatNumber(producto.precioitemoc),
                    cantidad: DatatableFunctions.FormatNumber(producto.cantidadatendida),
                    // importetotalitem: DatatableFunctions.FormatNumber(producto.subtotalitemoc),
                    importetotalitem: DatatableFunctions.FormatNumber(producto.subtotalitemguia),
                    subtotalitemguia: DatatableFunctions.FormatNumber(producto.subtotalitemguia),
                    IdProdxGuia: producto.IdProdxGuia,
                    posicion: item_pos.toString(),
                    CodigoGuiaERP: producto.CodigoGuiaERP,
                    EjercicioGuia: producto.EjercicioGuia,
                    IdTablaUnidad: producto.IdTablaUnidad,
                    IdRegistroUnidad: producto.IdRegistroUnidad,
                    unidadmedida: producto.unidadmedida,
                    estado: producto.estado
                });

                // subtotalitemoc = DatatableFunctions.StringToNumber(producto.subtotalitemoc);
                subtotalitemoc = DatatableFunctions.StringToNumber(producto.subtotalitemguia);
                subtotal = subtotal + subtotalitemoc;
          }

    }

        oFacturaProveedorFormularioComponent.factura.igv = numeral(0).format('0,0.0000');
        oFacturaProveedorFormularioComponent.factura.isc = numeral(0).format('0,0.0000');
        oFacturaProveedorFormularioComponent.factura.importetotal = numeral(0).format('0,0.0000');

        oFacturaProveedorFormularioComponent.factura.subtotal = DatatableFunctions.FormatNumber(subtotal);
        oFacturaProveedorFormularioComponent.factura.impuesto1 = DatatableFunctions.FormatNumber(subtotal * 0.18);

        if(this.esBorrador=='0'){
            oFacturaProveedorFormularioComponent.factura.importetotal = DatatableFunctions.FormatNumber(DatatableFunctions.StringToNumber(oFacturaProveedorFormularioComponent.factura.subtotal) +
            DatatableFunctions.StringToNumber(oFacturaProveedorFormularioComponent.factura.impuesto1) + DatatableFunctions.StringToNumber((oFacturaProveedorFormularioComponent.factura.impuesto2 == null ? 0 : oFacturaProveedorFormularioComponent.factura.impuesto2)) +
            DatatableFunctions.StringToNumber((oFacturaProveedorFormularioComponent.factura.impuesto3 == null ? 0 : oFacturaProveedorFormularioComponent.factura.impuesto3)));
        }

        setTimeout(function () {
            $('input').each(function () {
              $(this).keydown();
              if (!$(this).val() && $(this).val() == '') {
                  $(this.parentElement).addClass('is-empty');
              }
            });

            dtArticulos.ajax.reload( function ( json ) {
                SumarIGVdeArticulosDeGuia();
            } );
            $('#mdlGuias').modal('toggle');
        }, 500);

  }//// async  AgregarArticulosGuia(event)


  async  AgregarArticulosHAS(event) {
      event.preventDefault();
      const checkboxGuias = $('#dtBuscarAceptacionServicio').find('.checkboxAceptacionServicio:checked');

      if (checkboxGuias.length <= 0) {
          swal({
            text: 'Debe seleccionar una Aceptación de Servicio',
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-warning'
          });
          return false;
      }

      for (const checkboxGuia of checkboxGuias) {
          // oFacturaProveedorFormularioComponent.factura.detallefactura
          const id_doc = $(checkboxGuia).val();
          const oc = await this._dataHASService
            .obtener(id_doc).toPromise();

          let arrArticulos = null;
          try{
              arrArticulos = oFacturaProveedorFormularioComponent.factura.detallefactura.filter(a => a.IdGuia == id_doc);
          } catch(e) {};

          if (arrArticulos != null && oc.productos.length == arrArticulos.length) {
            swal({
                text: 'No se puede volver a agregar la HAS #' + $(checkboxGuia).attr('numhas') + '.',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning'
            });
            return false;
          }
      }

      let lista_ordenado: DetalleFactura[] = [];
      if (oFacturaProveedorFormularioComponent.factura.detallefactura != null) {
          lista_ordenado = oFacturaProveedorFormularioComponent.factura.detallefactura.sort((n, n1): number => {
              if (n.noitem < n1.noitem) {return -1};
              if (n.noitem > n1.noitem) {return 1};
              return 0;
          });
      } else {
          oFacturaProveedorFormularioComponent.factura.detallefactura = [];
      }

      let max_nroitem = 1;
      if (lista_ordenado.length > 0) {
          max_nroitem = DatatableFunctions.StringToNumber(lista_ordenado[lista_ordenado.length - 1].noitem) + 1;
      }

      let valorrecibido = 0;
      let subtotal = 0;
      subtotal = DatatableFunctions.StringToNumber(oFacturaProveedorFormularioComponent.factura.subtotal);

      for (const checkboxGuia of checkboxGuias) {
              const id_doc = $(checkboxGuia).val();
              const oc = await this._dataHASService
                                .obtener(id_doc).toPromise();

              for (const producto of oc.productos) {
                    //    console.log(oFacturaProveedorFormularioComponent.factura);

                    if (oFacturaProveedorFormularioComponent.factura.detallefactura.find(a => a.IdProdxGuia == producto.IdServicioxHAS) != null) {
                      continue;
                    }

                    const item_pos: number = max_nroitem++;
                    oFacturaProveedorFormularioComponent.factura.detallefactura.push({
                      // noitem: DatatableFunctions.FormatNumber(item_pos),
                      noitem: producto.nroitemhas,
                      IdGuia: producto.IdHAS,// oc.id,
                      IdOc: id_doc,// oc.id,
                      noguia: oc.nroconformidadservicio,
                      nooc: producto.nroordenservicio,
                      noitemoc: producto.nroitemordenservicio,
                      noparte: producto.NumeroParte,// producto.nroparte,
                      descproducto: producto.descripcion,
                      preciounitreferencial: DatatableFunctions.FormatNumber(producto.PrecioItem),//// producto.preciounitario,
                      cantidad: DatatableFunctions.FormatNumber(producto.cantidadatendida),
                      importetotalitem: DatatableFunctions.FormatNumber(producto.valorrecibido),
                      ////subtotalitemguia: '',
                      subtotalitemguia: DatatableFunctions.FormatNumber(producto.valorrecibido),
                      IdProdxGuia: producto.IdServicioxHAS,////producto.IdProdxGuia,
                      posicion: item_pos.toString(),
                      CodigoGuiaERP: oc.nroerpdocmaterial,////oc.CodigoHASERP,//producto.CodigoGuiaERP,
                      EjercicioGuia: oc.EjercicioHAS,// producto.EjercicioGuia,
                      IdTablaUnidad: '10000',// producto.IdTablaUnidad,//producto.IdTablaUnidad,
                      IdRegistroUnidad: '0000045',// producto.IdRegistroUnidad,//producto.IdRegistroUnidad
                      unidadmedida: producto.unidad,
                      estado: producto.estado
                    });

                    valorrecibido = DatatableFunctions.StringToNumber(producto.valorrecibido);

                    subtotal = subtotal + valorrecibido;
              }
      }

      oFacturaProveedorFormularioComponent.factura.igv = numeral(0).format('0,0.0000');
      oFacturaProveedorFormularioComponent.factura.isc = numeral(0).format('0,0.0000');
      oFacturaProveedorFormularioComponent.factura.importetotal = numeral(0).format('0,0.0000');

      oFacturaProveedorFormularioComponent.factura.subtotal = DatatableFunctions.FormatNumber(subtotal);
      oFacturaProveedorFormularioComponent.factura.impuesto1 = DatatableFunctions.FormatNumber(subtotal * 0.18);

      if(this.esBorrador=='0'){
          oFacturaProveedorFormularioComponent.factura.importetotal = DatatableFunctions.FormatNumber(DatatableFunctions.StringToNumber(oFacturaProveedorFormularioComponent.factura.subtotal) +
          DatatableFunctions.StringToNumber(oFacturaProveedorFormularioComponent.factura.impuesto1) + DatatableFunctions.StringToNumber((oFacturaProveedorFormularioComponent.factura.impuesto2 == null ? 0 : oFacturaProveedorFormularioComponent.factura.impuesto2)) +
          DatatableFunctions.StringToNumber((oFacturaProveedorFormularioComponent.factura.impuesto3 == null ? 0 : oFacturaProveedorFormularioComponent.factura.impuesto3)));
      }

      setTimeout(function () {
            $('input').each(function () {
              $(this).keydown();
              if (!$(this).val() && $(this).val() == '') {
                  $(this.parentElement).addClass('is-empty');
              }
            });

          /*
          dtArticulosHAS.ajax.reload( function ( json ) {
            //SumarIGVdeArticulosDeGuia();
          } );
          */
          dtArticulos.ajax.reload( function ( json ) {
            SumarIGVdeArticulosDeGuia();
          } );
          $('#mdlConformidadServicio').modal('toggle');
      }, 500);

  }//// async  AgregarArticulosHAS(event)



  async  AgregarArticulosTicket(event) {
      let id_doc = '';
      let doc = null;

      this.btnSeleccionar = true;
      const checkboxTickets = $('#dtBuscarTicketTransporte').find('.checkboxTicketTransporte:checked');

      if (checkboxTickets.length <= 0) {
          swal({
            text: 'Debe seleccionar un Ticket de Transporte',
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-warning'
          });
          return false;
      }

      for (const checkboxTicket of checkboxTickets) {
          // oFacturaProveedorFormularioComponent.factura.detallefactura
          const id_doc = $(checkboxTicket).val();
          const doc = await this._dataTicketService.obtener(id_doc).toPromise();

          let arrArticulos = null;
          try {
              arrArticulos = oFacturaProveedorFormularioComponent.factura.detallefactura.filter(a => a.IdGuia == id_doc);
          } catch(e) {};

          if (arrArticulos != null && doc.productos.length == arrArticulos.length) {
            swal({
                text: 'No se puede volver a agregar el Ticket de Transporte #' + $(checkboxTicket).attr('numticket') + '.',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning'
            });
            return false;
          }
      }

      let lista_ordenado: DetalleFactura[] = [];
      if (oFacturaProveedorFormularioComponent.factura.detallefactura != null) {
          lista_ordenado = oFacturaProveedorFormularioComponent.factura.detallefactura.sort((n, n1): number => {
              if (n.noitem < n1.noitem) {return -1};
              if (n.noitem > n1.noitem) {return 1};
              return 0;
          });
      } else {
          oFacturaProveedorFormularioComponent.factura.detallefactura = [];
      }

      let max_nroitem = 1;
      if (lista_ordenado.length > 0) {
          max_nroitem = DatatableFunctions.StringToNumber(lista_ordenado[lista_ordenado.length - 1].noitem) + 1;
      }

      let valorrecibido = 0;
      let subtotal = 0;
      subtotal = DatatableFunctions.StringToNumber(oFacturaProveedorFormularioComponent.factura.subtotal);








      for (const checkboxTicket of checkboxTickets) {
        id_doc = $(checkboxTicket).val();
        doc = await this._dataTicketService
                          .obtener(id_doc).toPromise();

        console.log(doc);

        for (const producto of doc.productos) {
              //    console.log(oFacturaProveedorFormularioComponent.factura);

              if (oFacturaProveedorFormularioComponent.factura.detallefactura.find(a => a.IdProdxGuia == producto.idtransporte) != null) {
                continue;
              }

              const item_pos: number = max_nroitem++;
              oFacturaProveedorFormularioComponent.factura.detallefactura.push({
                // noitem: DatatableFunctions.FormatNumber(item_pos),
                noitem: item_pos.toString(),
                IdGuia: producto.idtransporte,
                noguia: '-',
                IdOc: '0',
                nooc: '-',
                noitemoc: '-',
                noparte: '-',
                descproducto: producto.numerotransporte,
                preciounitreferencial: DatatableFunctions.FormatNumber(producto.costoproveedor),
                cantidad: '1',  // DatatableFunctions.FormatNumber(producto.cantidadatendida),
                importetotalitem: DatatableFunctions.FormatNumber(producto.costoproveedor),

                subtotalitemguia: DatatableFunctions.FormatNumber(producto.costoproveedor),
                IdProdxGuia: '00000000-0000-0000-0000-000000000000',
                posicion: item_pos.toString(),
                CodigoGuiaERP: '',
                EjercicioGuia: '',
                IdTablaUnidad: '10000',
                IdRegistroUnidad: '0000045',
                unidadmedida: producto.unidadpesototal,
                estado: ''
              });

              valorrecibido = DatatableFunctions.StringToNumber(producto.costoproveedor);

              subtotal = subtotal + valorrecibido;
        }
}

      // oFacturaProveedorFormularioComponent.factura.subtotal = DatatableFunctions.FormatNumber(subtotal);
      // oFacturaProveedorFormularioComponent.factura.impuesto1 = DatatableFunctions.FormatNumber(subtotal * 0.18);

      // oFacturaProveedorFormularioComponent.factura.igv = numeral(0).format('0,0.0000');
      // oFacturaProveedorFormularioComponent.factura.isc = numeral(0).format('0,0.0000');
      this.ticket_igv=doc.impuesto;
      this.ticket_subtotal=doc.subtotal;
      this.ticket_importetotal=doc.total;
     // alert(this.ticket_importetotal);

      oFacturaProveedorFormularioComponent.factura.subtotal = numeral(doc.subtotal).format('0,0.0000');
      oFacturaProveedorFormularioComponent.factura.igv= numeral(doc.impuesto).format('0,0.0000');
      oFacturaProveedorFormularioComponent.factura.importetotal = numeral(doc.total).format('0,0.0000');
      oFacturaProveedorFormularioComponent.factura.impuesto1 = DatatableFunctions.FormatNumber(doc.impuesto);

      // oFacturaProveedorFormularioComponent.factura.importetotal = doc.total;

      // oFacturaProveedorFormularioComponent.factura.impuesto1 = '0';
      // oFacturaProveedorFormularioComponent.factura.total = '114';

      if(this.esBorrador=='0') {
          oFacturaProveedorFormularioComponent.factura.importetotal = DatatableFunctions.FormatNumber(DatatableFunctions.StringToNumber(oFacturaProveedorFormularioComponent.factura.subtotal) +
          DatatableFunctions.StringToNumber(oFacturaProveedorFormularioComponent.factura.impuesto1) + 
          DatatableFunctions.StringToNumber((oFacturaProveedorFormularioComponent.factura.impuesto2 == null ? 0 : oFacturaProveedorFormularioComponent.factura.impuesto2)) +
          DatatableFunctions.StringToNumber((oFacturaProveedorFormularioComponent.factura.impuesto3 == null ? 0 : oFacturaProveedorFormularioComponent.factura.impuesto3)));
      }

      setTimeout(function () {
          $('input').each(function () {
              $(this).keydown();
              if (!$(this).val() && $(this).val() == '') {
                $(this.parentElement).addClass('is-empty');
              }
          });

          dtArticulos.ajax.reload( function ( json ) {
              // SumarIGVdeArticulosDeGuia();
          });
          $('#mdlTicketTransporte').modal('toggle');
      }, 500);
  }//// async  AgregarArticulosTicket(event)




  eliminarArticulos(event) {
    event.preventDefault();
    let checkboxArticulos;

    checkboxArticulos = $('#dtArticulos').find('.checkboxArticulos:checked');
    /*
    if (oFacturaProveedorFormularioComponent.factura.esguiamaterial) {
        checkboxArticulos = $('#dtArticulos').find('.checkboxArticulos:checked');
    } else {
        checkboxArticulos = $('#dtArticulosHAS').find('.checkboxArticulos:checked');
    }
    */

    if (checkboxArticulos.length <= 0) {
        swal({
          text: "Debe seleccionar un Articulo.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
        return false;
    } else {
        let mensaje = "¿Desea eliminar el artículo seleccionado?";
        if (checkboxArticulos.length > 1) {
            mensaje = "¿Desea eliminar los artículos seleccionados?";
        }
        swal({
            text: mensaje,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
            buttonsStyling: false,
            confirmButtonClass: "btn btn-default",
            cancelButtonClass: "btn btn-warning",
        }).then(function () {
            let lista = oFacturaProveedorFormularioComponent.factura.detallefactura as DetalleFactura[];
            for (const checkbox of checkboxArticulos) {
              const nroitem = $(checkbox).val();
              lista = lista.filter(a => a.noitem != nroitem);

            }

        oFacturaProveedorFormularioComponent.factura.detallefactura = JSON.parse(JSON.stringify(ActualizarCorrelativos(lista)));

        let subtotal = 0;
        let valorrecibido = 0;

        for (const articulo of oFacturaProveedorFormularioComponent.factura.detallefactura) {
            valorrecibido = DatatableFunctions.StringToNumber(articulo.importetotalitem);
            // subtotal = DatatableFunctions.StringToNumber(oFacturaProveedorFormularioComponent.factura.importetotal);
            subtotal = subtotal + valorrecibido;
        }

        oFacturaProveedorFormularioComponent.factura.subtotal = DatatableFunctions.FormatNumber(subtotal);
        oFacturaProveedorFormularioComponent.factura.impuesto1 = DatatableFunctions.FormatNumber(subtotal * 0.18);

        oFacturaProveedorFormularioComponent.factura.importetotal = DatatableFunctions.FormatNumber(DatatableFunctions.StringToNumber(oFacturaProveedorFormularioComponent.factura.subtotal) +
        DatatableFunctions.StringToNumber(oFacturaProveedorFormularioComponent.factura.impuesto1) + DatatableFunctions.StringToNumber((oFacturaProveedorFormularioComponent.factura.impuesto2 == null ? 0 : oFacturaProveedorFormularioComponent.factura.impuesto2)) +
        DatatableFunctions.StringToNumber((oFacturaProveedorFormularioComponent.factura.impuesto3 == null ? 0 : oFacturaProveedorFormularioComponent.factura.impuesto3)));


        setTimeout(function () {
            dtArticulos.ajax.reload();
            /*
            if (oFacturaProveedorFormularioComponent.factura.esguiamaterial) {
              dtArticulos.ajax.reload();
            } else {
              dtArticulosHAS.ajax.reload();
            }
            */
        }, 500);
      }, function (dismiss) {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'

      }

        );

    }



  }

  onEsFisicoChange($event) {
    this.factura.esfisico = true;
    this.factura.eselectronico = false;
    $("#nocomprobantepago1").attr("maxlength", 3);
    $("#nocomprobantepago2").attr("maxlength", 7);
    if( $("#nocomprobantepago1").val() != "" || $("#nocomprobantepago2").val() != ""  ){
        swal({
            title: "Cambio en Tipo de Emisión",
            html: "<p class='text-center'>Se borrará el número ingresado</p>",
            type:'warning',
            showCancelButton: true,
            confirmButtonClass:"btn-danger",
            confirmButtonText: "Si, Borrado",
            cancelButtonText: "No, cancelar",
            closeOnConfirm: true,
            closeOnCancel: false
        }).then(function(e){
            swal("Borrado", "", "success")
            $("#nocomprobantepago1").val('');
            $("#nocomprobantepago2").val('');
        });
    }
  }

  onEsElectronicolChange($event) {
    this.factura.esfisico = false;
    this.factura.eselectronico = true;
    $("#nocomprobantepago1").attr("maxlength", 4);
    $("#nocomprobantepago2").attr("maxlength", 8);
    if( $("#nocomprobantepago1").val() != "" || $("#nocomprobantepago2").val() != ""  ){
        swal({
            title: "Cambio en Tipo de Emisión",
            html: "<p class='text-center'>Se borrara el numero ingresado</p>",
            type:'warning',
            showCancelButton: true,
            confirmButtonClass:"btn-danger",
            confirmButtonText: "Si, Borrado",
            cancelButtonText: "No, cancelar",
            closeOnConfirm: true,
            closeOnCancel: false
        }).then(function(e){
            swal("Borrado", "", "success")
            $("#nocomprobantepago1").val('');
            $("#nocomprobantepago2").val('');
        });
    }
  }


  onCambioDeBaseFactura($event) {

        if( this.factura.detallefactura.length>0 ) {
            swal({
                title: 'Cambio en Tipo de Factura',
                html: '<p class="text-center">Para cambiar el tipo de factura debe eliminar los artículos agregados hasta el momento.</p>',
                type: 'warning',
                confirmButtonText: 'Aceptar'
            })
            .then(
                (result) => {
                    if( this.anteriorBaseFactura==='guia' ) {
                        $('input[name="tipofactura"][value="guia"]').prop( 'checked', true );
                    } else if( this.anteriorBaseFactura==='has' ) {
                        $('input[name="tipofactura"][value="has"]').prop( 'checked', true );
                    } else if( this.anteriorBaseFactura==='ticket' ) {
                        $('input[name="tipofactura"][value="ticket"]').prop( 'checked', true );
                    }

                }, (dismiss) => {
                    if( this.anteriorBaseFactura==='guia' ) {
                        $('input[name="tipofactura"][value="guia"]').prop( 'checked', true );
                    } else if( this.anteriorBaseFactura==='has' ) {
                        $('input[name="tipofactura"][value="has"]').prop( 'checked', true );
                    } else if( this.anteriorBaseFactura==='ticket' ) {
                        $('input[name="tipofactura"][value="ticket"]').prop( 'checked', true );
                    }
            });
        } else {
            this.anteriorBaseFactura= this.factura.basefactura;
        }
        /*
        else {
            this.factura.esguiamaterial = true;
            this.factura.eshas = false;
        }
        */
  }

/*
  onEsMaterialChange($event) {
    // alert(this.factura.basefactura);
        if(this.factura.eselectronico && ( this.factura.detallefactura.length>0 ) ){  
            swal({
                title: 'Cambio en Tipo de Factura',
                html: '<p class="text-center">Para cambiar el tipo de factura debe eliminar los artículos agregados hasta el momento.</p>',
                type: 'warning',
                confirmButtonText: 'Aceptar'
            })
            .then(
                (result) => {
                    $('input[name="tipofactura"][value="has"]').prop( "checked", true );
                    this.factura.esguiamaterial = false;
                    this.factura.eshas = true;
                }, (dismiss) => {
                    $('input[name="tipofactura"][value="has"]').prop( "checked", true );
                    this.factura.esfisico = false;
                    this.factura.eselectronico = true;
            });
        } else {
            this.factura.esguiamaterial = true;
            this.factura.eshas = false;
        }
  }
*/


  /*
  onEsHasChange($event) {
      // alert(this.factura.basefactura);
      if(this.factura.eselectronico && ( this.factura.detallefactura.length>0 ) ) {
          swal({
              title: 'Cambio en Tipo de Factura',
              html: '<p class="text-center">Para cambiar el tipo de factura debe eliminar los artículos agregados hasta el momento.</p>',
              type: 'warning',
              confirmButtonText: 'Aceptar'
          })
          .then(
              (result) => {
                  $('input[name="tipofactura"][value="guia"]').prop( 'checked', true );
                  this.factura.esguiamaterial = true;
                  this.factura.eshas = false;
              }, (dismiss) => {
                  $('input[name="tipofactura"][value="guia"]').prop( 'checked', true );
                  this.factura.esguiamaterial = true;
                  this.factura.eshas = false;
          });
      } else {
          this.factura.esguiamaterial = false;
          this.factura.eshas = true;
      }

  };
*/



  /*
  onEsTicketChange($event) {
    // alert(this.factura.basefactura);
    if(this.factura.esticket && ( this.factura.detallefactura.length>0 ) ){  
        swal({
            title: 'Cambio en Tipo de Factura',
            html: '<p class="text-center">Para cambiar el tipo de factura debe eliminar los artículos agregados hasta el momento.</p>',
            type: 'warning',
            confirmButtonText: 'Aceptar'
        })
        .then(
            (result) => {
                $('input[name="tipofactura"][value="guia"]').prop( "checked", true );
                this.factura.esguiamaterial = true;
                this.factura.eshas = false;
            }, (dismiss) => {
                $('input[name="tipofactura"][value="guia"]').prop( "checked", true );
                this.factura.esguiamaterial = true;
                this.factura.eshas = false;
        });
    } else {
        this.factura.esguiamaterial = false;
        this.factura.eshas = true;
    }

  }
*/

  ngAfterViewInit() {

    DatatableFunctions.ModalSettings();

    if (this.id != '0') {
      let publicada = true;
      // this.step = 2;

      if (this.esBorrador === '1'){
          publicada = false;
      }

      this._dataService
          .obtener(this.id, 'P', publicada)
          .subscribe(
                      p => {
                        this.factura = p;
                        this.factura.id_doc = this.id_doc;
                        this.factura.montosunat = p.importetotal;
                        this.factura.importetotal = numeral(0).format('0,0.0000');

                        this.factura.igv=numeral(0).format('0,0.0000');
                        this.factura.isc=numeral(0).format('0,0.0000');
                        SumarImporteTotal();

                        if (this.esBorrador !== '1') {
                          $('#txtFechaEmision').prop('disabled', true);
                          $('#txtFechaVencimiento').prop('disabled', true);
                          $('#txtFechaRecepcion').prop('disabled', true);
                          $('#txtFechaRegistro').prop('disabled', true);

                       //   oFacturaProveedorFormularioComponent.factura.igv = numeral(0).format('0,0.0000');
                      //    oFacturaProveedorFormularioComponent.factura.isc = numeral(0).format('0,0.0000');
                        //  oFacturaProveedorFormularioComponent.factura.importetotal = numeral(0).format('0,0.0000'); 
                        }

                        setTimeout(function () {

                            $('input').each(function () {
                              $(this).keydown();
                              if (!$(this).val() && $(this).val() == '') {
                                $(this.parentElement).addClass('is-empty');
                              }
                            });
                            $('select').each(function () {
                              $(this).keydown();
                              if (!$(this).val() && $(this).val() == '') {
                                $(this.parentElement).addClass('is-empty');
                              }
                            });
                            $('textarea').each(function () {
                              $(this).keydown();
                              if (!$(this).val() && $(this).val() == '') {
                                $(this.parentElement).addClass('is-empty');
                              }
                            });

                            // oFacturaProveedorFormularioComponent.DatatableConfig();

                            try {
                              dtArticulos.ajax.reload();
                            }catch(err) {
                              $('#dtArticulos_processing').remove();
                            }
/*
                            try {
                              dtArticulosHAS.ajax.reload();
                            }
                            catch(err) {
                              $('#dtArticulosHAS_processing').remove();
                            }
*/
                            dtArchivos.ajax.reload();

                        }, 100);

                      },
                      e => console.log(e),
                () => { });
    }

    setTimeout(function () {
      if (oFacturaProveedorFormularioComponent.id == '0') {
        $('select[name="tipodocumento"]').change();
        $('#checkDetraccion').prop( 'checked', true );
      }
    }, 100);




    $('#mdlArchivosAdjuntos').on('shown.bs.modal', function () {
      $('#btnEliminarAA').click();
    });

    dtArchivos = $('#dtArchivos').on('draw.dt', function (e, settings, json) {
        DatatableFunctions.initDatatable(e, settings, json, dtArchivos);

    }).DataTable({
      ajax: function (data, callback, settings) {

        const result = {
          data: oFacturaProveedorFormularioComponent.factura.docadjuntos
        };
        callback(
          result
        );
      },
      columns: [
        { data: 'id' },
        { data: 'nombre' },
        { data: 'descripcion' },
        { data: 'id' },
      ],
      columnDefs: [
        {   'className': 'text-center', 'targets': [1, 2, 3] },
        {
            render: function (data, type, row) {
              return '<div class="text-right" height="100%"><div class="checkbox text-right"><label><input type="checkbox" value="' +
                      row.id + '" name="optionsCheckboxes" class="checkboxArchivos"></label></div></div>';
            },
            targets: 0,
            orderable: false,
        },
        {
            render: function (data, type, row) {
              return '<a class="editar" href="javascript:void(0);" row-id="' + row.id + '">' +
                '<button class="btn btn-simple btn-info btn-icon download" rel="tooltip" title="Bajar Archivo" data-placement="left">' +
                '<i class="material-icons">get_app</i></button></a>' +
                '<button class="btn btn-simple btn-danger btn-icon remove" rel="tooltip" title="Eliminar" data-placement="left">' +
                '<i class="material-icons">delete</i>' +
                '</button>';
            },
            targets: 3
        }
      ]

    });


    dtArchivos.on('click', '.download', function (event) {
      var $tr = $(this).closest('tr');
      let row_id = $tr.find('a.editar').attr('row-id');
      var lista = oFacturaProveedorFormularioComponent.factura.docadjuntos as Archivo[];
      archivo = lista.find(a => a.id == row_id) as Archivo;
      oFacturaProveedorFormularioComponent._dataServiceAdjunto
        .DescargarArchivo(archivo)
        .subscribe(
        blob => {
          saveAs(blob, archivo.nombre);
        },
        e => console.log(e),
        () => { });
      event.preventDefault();
    });


    // Delete a record
    dtArchivos.on('click', '.remove', function (e) {
        var $tr = $(this).closest('tr');
        var row_id = $tr.find('a.editar').attr('row-id') as number;

        swal({
            text: '¿Desea eliminar el registro seleccionado?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-default',
            cancelButtonClass: 'btn btn-warning',
        }).then(function () {
            var lista = oFacturaProveedorFormularioComponent.factura.docadjuntos as Archivo[];
            var listafiltrada = lista.filter(a => a.id != row_id);
            oFacturaProveedorFormularioComponent.factura.docadjuntos = JSON.parse(JSON.stringify(listafiltrada));
            setTimeout(function () {
              dtArchivos.ajax.reload();
            }, 500);
        }, function (dismiss) {
          // dismiss can be 'cancel', 'overlay',
          // 'close', and 'timer'
        });
        e.preventDefault();
    });
    /* if(this.id == "0"){
       this.factura.razonsocialproveedor = this.usuarioActual.organizaciones[0].nombre;
     }*/
    // cargarGuiasDT();



    cargarGuiasDT();
    cargarBuscarGuiaDT();
    cargarBuscarClienteDT();
    cargarBuscarAceptacionServicioDT();
    cargarBuscarTicketTransporteDT();
    DatatableFunctions.registerCheckAll();

    $('#nocomprobantepago1').blur(function (eventObject) {

      console.log(eventObject);

      if (oFacturaProveedorFormularioComponent.factura.nocomprobantepago1 == null) {
        oFacturaProveedorFormularioComponent.factura.nocomprobantepago1 = "";
      }

      if (oFacturaProveedorFormularioComponent.factura.nocomprobantepago1 == "") { return }

      if (oFacturaProveedorFormularioComponent.factura.esfisico) {
        let regex = /^[0-9]+$/i;
        let str = oFacturaProveedorFormularioComponent.factura.nocomprobantepago1.trim();

        if (!regex.test(str) || oFacturaProveedorFormularioComponent.factura.nocomprobantepago1.trim() == "000" || oFacturaProveedorFormularioComponent.factura.nocomprobantepago1.length < 3) {
          swal({
            html: "La serie solo puede contener caracteres numéricos, deben ser 3 dígitos y no debe empezar en 000.<br/><br/>\n\
                    Puedes cambiar el tipo de emisión si lo requieres:<br/>\n\
                      <div class=\"radio\">\n\
                        <label> Físico\n\
                          <input type=\"radio\" id=\"rbEsFisico\" name=\"optionsCheckboxes\" " + (oFacturaProveedorFormularioComponent.factura.esfisico ? "checked" : "") + " >\n\
                          </label>\n\
                        <label> Electrónico\n\
                          <input type=\"radio\" id=\"rbEsElectronico\" name=\"optionsCheckboxes\" " + (oFacturaProveedorFormularioComponent.factura.eselectronico ? "checked" : "") + "  >\n\
                          </label>\n\
                      </div>\n\
",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          }).then(function () {
            $("#nocomprobantepago1").focus();
            if ($("#rbEsFisico").prop("checked")) {
              oFacturaProveedorFormularioComponent.factura.esfisico = true;
              oFacturaProveedorFormularioComponent.factura.eselectronico = false;
              $("#nocomprobantepago1").attr("maxlength", 3);
              $("#nocomprobantepago2").attr("maxlength", 7);
            }
            if ($("#rbEsElectronico").prop("checked")) {
              oFacturaProveedorFormularioComponent.factura.eselectronico = true;
              oFacturaProveedorFormularioComponent.factura.esfisico = false;
              $("#nocomprobantepago1").attr("maxlength", 4);
              $("#nocomprobantepago2").attr("maxlength", 8);
            }
          });

          return false;
        }
      } else if (oFacturaProveedorFormularioComponent.factura.eselectronico) {
        let regex1 = /^[a-z0-9]+$/i;
        let regex2 = /^[0-9]+$/i;
        let regex3 = /^[a-z]+$/i;
        let str1 = oFacturaProveedorFormularioComponent.factura.nocomprobantepago1.trim();

        if (!regex3.test(str1.substring(0, 1))) {
          swal({
            html: "La serie es alfanumérica de cuatro caracteres empezando con un caracter.<br/><br/>\n\
                    Puedes cambiar el tipo de emisión si lo requieres:<br/>\n\
                      <div class=\"radio\">\n\
                        <label> Físico\n\
                          <input type=\"radio\" id=\"rbEsFisico\" name=\"optionsCheckboxes\" " + (oFacturaProveedorFormularioComponent.factura.esfisico ? "checked" : "") + " >\n\
                          </label>\n\
                        <label> Electrónico\n\
                          <input type=\"radio\" id=\"rbEsElectronico\" name=\"optionsCheckboxes\" " + (oFacturaProveedorFormularioComponent.factura.eselectronico ? "checked" : "") + "  >\n\
                          </label>\n\
                      </div>\n\
",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          }).then(function () {
            $("#nocomprobantepago1").focus();
            if ($("#rbEsFisico").prop("checked")) {
              oFacturaProveedorFormularioComponent.factura.esfisico = true;
              oFacturaProveedorFormularioComponent.factura.eselectronico = false;
              $("#nocomprobantepago1").attr("maxlength", 3);
              $("#nocomprobantepago2").attr("maxlength", 7);
            }
            if ($("#rbEsElectronico").prop("checked")) {
              oFacturaProveedorFormularioComponent.factura.eselectronico = true;
              oFacturaProveedorFormularioComponent.factura.esfisico = false;
              $("#nocomprobantepago1").attr("maxlength", 4);
              $("#nocomprobantepago2").attr("maxlength", 8);
            }
          });
          return false;
        }

        if (str1.substring(0, 1) == "Ñ" || str1.substring(0, 1) == "ñ" || str1.length < 4) {
          swal({
            html: "La serie es alfanumérica de cuatro caracteres empezando con un caracter.<br/><br/>\n\
                    Puedes cambiar el tipo de emisión si lo requieres:<br/>\n\
                      <div class=\"radio\">\n\
                        <label> Físico\n\
                          <input type=\"radio\" id=\"rbEsFisico\" name=\"optionsCheckboxes\" " + (oFacturaProveedorFormularioComponent.factura.esfisico ? "checked" : "") + " >\n\
                          </label>\n\
                        <label> Electrónico\n\
                          <input type=\"radio\" id=\"rbEsElectronico\" name=\"optionsCheckboxes\" " + (oFacturaProveedorFormularioComponent.factura.eselectronico ? "checked" : "") + "  >\n\
                          </label>\n\
                      </div>\n\
",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          }).then(function () {
            $("#nocomprobantepago1").focus();
            if ($("#rbEsFisico").prop("checked")) {
              oFacturaProveedorFormularioComponent.factura.esfisico = true;
              oFacturaProveedorFormularioComponent.factura.eselectronico = false;
              $("#nocomprobantepago1").attr("maxlength", 3);
              $("#nocomprobantepago2").attr("maxlength", 7);
            }
            if ($("#rbEsElectronico").prop("checked")) {
              oFacturaProveedorFormularioComponent.factura.eselectronico = true;
              oFacturaProveedorFormularioComponent.factura.esfisico = false;
              $("#nocomprobantepago1").attr("maxlength", 4);
              $("#nocomprobantepago2").attr("maxlength", 8);
            }
          });
          return false;
        }

        if (!regex1.test(str1)) {
          swal({
            html: "La serie es alfanumérica de cuatro caracteres empezando con un caracter.<br/><br/>\n\
                    Puedes cambiar el tipo de emisión si lo requieres:<br/>\n\
                      <div class=\"radio\">\n\
                        <label> Físico\n\
                          <input type=\"radio\" id=\"rbEsFisico\" name=\"optionsCheckboxes\" " + (oFacturaProveedorFormularioComponent.factura.esfisico ? "checked" : "") + " >\n\
                          </label>\n\
                        <label> Electrónico\n\
                          <input type=\"radio\" id=\"rbEsElectronico\" name=\"optionsCheckboxes\" " + (oFacturaProveedorFormularioComponent.factura.eselectronico ? "checked" : "") + "  >\n\
                          </label>\n\
                      </div>\n\
",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          }).then(function () {
            $("#nocomprobantepago1").focus();
            if ($("#rbEsFisico").prop("checked")) {
              oFacturaProveedorFormularioComponent.factura.esfisico = true;
              oFacturaProveedorFormularioComponent.factura.eselectronico = false;
              $("#nocomprobantepago1").attr("maxlength", 3);
              $("#nocomprobantepago2").attr("maxlength", 7);
            }
            if ($("#rbEsElectronico").prop("checked")) {
              oFacturaProveedorFormularioComponent.factura.eselectronico = true;
              oFacturaProveedorFormularioComponent.factura.esfisico = false;
              $("#nocomprobantepago1").attr("maxlength", 4);
              $("#nocomprobantepago2").attr("maxlength", 8);
            }
          });
          return false;
        }
      }
    });


    $("#nocomprobantepago2").blur(function () {
      if (oFacturaProveedorFormularioComponent.factura.nocomprobantepago2 == null) {
        oFacturaProveedorFormularioComponent.factura.nocomprobantepago2 = "";
      }

      if (oFacturaProveedorFormularioComponent.factura.nocomprobantepago2 == "") { return }

      if (oFacturaProveedorFormularioComponent.factura.esfisico) {
        let regex = /^[0-9]+$/i;
        let str = oFacturaProveedorFormularioComponent.factura.nocomprobantepago2.trim();

        if (!regex.test(str) || oFacturaProveedorFormularioComponent.factura.nocomprobantepago2.length < 7) {
          swal({
            html: "<p class= 'text-center'>El correlativo solo puede contener caracteres numéricos y deben ser 7 dígitos.</p>",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          }).then(function () {
            $("#nocomprobantepago2").focus();
            if ($("#rbEsFisico").prop("checked")) {
              oFacturaProveedorFormularioComponent.factura.esfisico = true;
              oFacturaProveedorFormularioComponent.factura.eselectronico = false;
              $("#nocomprobantepago1").attr("maxlength", 3);
              $("#nocomprobantepago2").attr("maxlength", 7);
            }
            if ($("#rbEsElectronico").prop("checked")) {
              oFacturaProveedorFormularioComponent.factura.eselectronico = true;
              oFacturaProveedorFormularioComponent.factura.esfisico = false;
              $("#nocomprobantepago1").attr("maxlength", 4);
              $("#nocomprobantepago2").attr("maxlength", 8);
            }
          });
          return false;
        }
      } else if (oFacturaProveedorFormularioComponent.factura.eselectronico) {
        let regex1 = /^[a-z0-9]+$/i;
        let regex2 = /^[0-9]+$/i;
        let str2 = oFacturaProveedorFormularioComponent.factura.nocomprobantepago2.trim();

        if (!regex2.test(str2)) {
          swal({
            html: "El correlativo solo puede contener caracteres numéricos y hasta 8 dígitos.<br/><br/>\n\
                    Puedes cambiar el tipo de emisión si lo requieres:<br/>\n\
                      <div class=\"radio\">\n\
                        <label> Físico\n\
                          <input type=\"radio\" id=\"rbEsFisico\" name=\"optionsCheckboxes\" " + (oFacturaProveedorFormularioComponent.factura.esfisico ? "checked" : "") + " >\n\
                          </label>\n\
                        <label> Electrónico\n\
                          <input type=\"radio\" id=\"rbEsElectronico\" name=\"optionsCheckboxes\" " + (oFacturaProveedorFormularioComponent.factura.eselectronico ? "checked" : "") + "  >\n\
                          </label>\n\
                      </div>\n\
",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          }).then(function () {
            $("#nocomprobantepago2").focus();
            if ($("#rbEsFisico").prop("checked")) {
              oFacturaProveedorFormularioComponent.factura.esfisico = true;
              oFacturaProveedorFormularioComponent.factura.eselectronico = false;
              $("#nocomprobantepago1").attr("maxlength", 3);
              $("#nocomprobantepago2").attr("maxlength", 7);
            }
            if ($("#rbEsElectronico").prop("checked")) {
              oFacturaProveedorFormularioComponent.factura.eselectronico = true;
              oFacturaProveedorFormularioComponent.factura.esfisico = false;
              $("#nocomprobantepago1").attr("maxlength", 4);
              $("#nocomprobantepago2").attr("maxlength", 8);
            }
          });
          return false;
        }
      }
    });


    $("#checkDetraccion").blur(function (eventObject) {
        if( $('#checkDetraccion').is(':checked') ){
            $('select[name*=checkdetraccion]').prop('disabled',false);
        }else {
            $('select[name*=checkdetraccion]').prop('disabled',true);
            $('select[name*=checkdetraccion] option[value=000]').prop('selected',true);
        }
        // oFacturaProveedorFormularioComponent.listDetraccionCombo.
    });




    this.obtenerBotones();
  }


  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  validarDocumentos() {
      if ($('#txtArchivo').get(0).files.length == 0) {
        swal({
          text: 'Un archivo es requerido. Por favor completar y volver a intentar!',
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-warning'
        });
        return false;
      }

      return true;
  }



  descartarBorrador(event) {
    swal({
        html: '¿Está seguro de descartar el comprobante de pago?',
        type: 'warning',
        // html: true,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-default",
        cancelButtonClass: "btn btn-warning",
    }).then(
        function () {

          oFacturaProveedorFormularioComponent._dataService.descartarBorrador(oFacturaProveedorFormularioComponent.id)
            .subscribe(
            p => {
              swal({
                text: "Se descartó el comprobante de pago.",
                type: 'success',
                buttonsStyling: false,
                confirmButtonClass: "btn btn-success",
                confirmButtonText: "Aceptar",
              }).then(
                function () {
                  let nav = ['/cl-factura/proveedor/buscar'];
                  oFacturaProveedorFormularioComponent.navigate(nav);
                },
                function (dismiss) {
                  let nav = ['/cl-factura/proveedor/buscar'];
                  oFacturaProveedorFormularioComponent.navigate(nav);
                });
            },
            e => console.log(e),
            () => { });

        },
        function (dismiss) {
        })

        event.preventDefault();
  }


  onChangeFile(event: EventTarget) {
      let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
      let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
      let files: FileList = target.files;
      this.archivo.contenido = files[0];
  }

  grabarArchivoAdjunto() {
    if (!this.validarDocumentos()) {
      return false;
    }

    const docs_ordenado = this.factura.docadjuntos.sort((n, n1): number => {
        if (n.id < n1.id) {return -1};
        if (n.id > n1.id) { return 1};
        return 0;
    });
    if (docs_ordenado.length > 0) {
      this.archivo.id = docs_ordenado[docs_ordenado.length - 1].id + 1;
    } else {
      this.archivo.id = 1;
    }

    var fullPath = $('#txtArchivo').val();
    if (fullPath) {
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
          filename = filename.substring(1);
        }
        this.archivo.nombre = filename;
    }

    oFacturaProveedorFormularioComponent._dataServiceAdjunto
      .AgregarArchivo(this.archivo)
      .subscribe(
                  p => {
                    oFacturaProveedorFormularioComponent.archivo.url = oFacturaProveedorFormularioComponent._dataServiceAdjunto.ObtenerUrlDescarga(oFacturaProveedorFormularioComponent.archivo);
                    oFacturaProveedorFormularioComponent.factura.docadjuntos.push(JSON.parse(JSON.stringify(oFacturaProveedorFormularioComponent.archivo)));
                    setTimeout(function () {

                      dtArchivos.ajax.reload();

                    }, 500);

                    $("#mdlArchivosAdjuntos").modal('toggle');
                  },
      e => console.log(e),
      () => { });

  }

  eliminarArchivos(event) {
    event.preventDefault();
    let checkboxes = $('#dtArchivos').find('.checkboxArchivos:checked');
    if (checkboxes.length <= 0) {
      swal({
        text: "Debe seleccionar un Archivo.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }
    else {
      let mensaje = "¿Desea eliminar el archivo seleccionado?";
      if (checkboxes.length > 1) {
        mensaje = "¿Desea eliminar los archivos seleccionados?";
      }
      swal({
        text: mensaje,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-default",
        cancelButtonClass: "btn btn-warning",
      }).then(function () {
        var lista = oFacturaProveedorFormularioComponent.factura.docadjuntos as Archivo[];
        for (let checkbox of checkboxes) {

          let id = $(checkbox).val();
          lista = lista.filter(a => a.id != id);

        }
        oFacturaProveedorFormularioComponent.factura.docadjuntos = JSON.parse(JSON.stringify(ActualizarCorrelativos(lista)));
        setTimeout(function () {
          dtArchivos.ajax.reload();

        }, 500);
      }, function (dismiss) {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'

      }

        );

    }

  }

  ngOnChanges(changes: SimpleChanges) {
  }


  AbrirAgregarGuiaoHAS(event) {
      if (!this.factura.moneda || this.factura.moneda == '') {
          swal({
            text: 'Debe seleccionar la moneda del Comprobante de Pago.',
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-warning'
          });
          return false;
      }

      if(this.factura.basefactura=='guia') {
          $("#mdlGuias").modal('show');
          dtGuias.ajax.reload();
      }else if(this.factura.basefactura=='has') {
          $("#mdlConformidadServicio").modal('show');
          dtBuscarAceptacionServicio.ajax.reload();
      }else if(this.factura.basefactura=='ticket') {
          $("#mdlTicketTransporte").modal('show');
          dtBuscarTicketTransporte.ajax.reload();
      }

      event.preventDefault();

/*
      if(this.factura.basefactura=='guia') {
          this.AbrirAgregarGuia(event);
      }else if(this.factura.basefactura=='has') {
          this.AbrirAgregarAceptacionServicio(event);
      }else if(this.factura.basefactura=='ticket') {
          this.AbrirAgregarTicketTransporte(event);
      }
*/

  };

  AbrirAgregarGuia(event) {
      if (!this.factura.moneda || this.factura.moneda == '') {
        swal({
          text: "Debe seleccionar la moneda del Comprobante de Pago.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
        return false;
      }

      $("#mdlGuias").modal('show');
      dtGuias.ajax.reload();
      event.preventDefault();
  };

  AbrirAgregarAceptacionServicio(event) {
      if (!this.factura.moneda || this.factura.moneda == '') {
        swal({
          text: "Debe seleccionar la moneda del Comprobante de Pago.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
        return false;
      }

      $("#mdlConformidadServicio").modal('show');
      dtBuscarAceptacionServicio.ajax.reload();
      event.preventDefault();
  };

  AbrirAgregarTicketTransporte(event) {
    if (!this.factura.moneda || this.factura.moneda == '') {
      swal({
        text: "Debe seleccionar la moneda del Comprobante de Pago.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }

    $("#mdlTicketTransporte").modal('show');
    dtBuscarTicketTransporte.ajax.reload();
    event.preventDefault();
};


  async validardatos(e, enviar = false) {

      const facs = await this._dataService
                           .verificar_duplicados(this.factura.nocomprobantepago, this.factura.rucproveedor, this.factura.ruccliente)
                           .toPromise();

      for(const fac of facs.data){
          if(fac.NumeroFactura == this.factura.nocomprobantepago){
              swal({
                text: "El número de comprobante de pago ya existe.",
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: "btn btn-warning"
              }).then(function(){
                $("#nocomprobantepago1").focus();
              });

              return false;
          }
      }

      if (this.factura.nocomprobantepago1 == null || this.factura.nocomprobantepago2 == null || 
          this.factura.nocomprobantepago.trim() == "" || this.factura.nocomprobantepago.trim() == "-" || 
          this.factura.nocomprobantepago1.trim() == "" || this.factura.nocomprobantepago2.trim() == "") {
          swal({
            text: "Nro. Comprobante de Pago es un campo requerido.",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          });
          return false;
      }

      if ( this.factura.eselectronico && ( ( numeral(this.factura.fise).value()==null || numeral(this.factura.fise).value()==0 ) && 
           ( numeral(this.factura.montosunat).value()!=numeral(this.factura.importetotal).value() ) ) ) {
          swal({
            text: "Los valores de los campos Monto SUNAT e Importe Total deben coincidir.",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          });
          return false;
      }

      /******PARA EL CHECK */
      if($('#checkDetraccion').prop("checked") && $('select[name*=checkdetraccion] option:selected').text()==''){
          // var check = $('#checkDetraccion').is(':checked');

          swal({
            html: "<p class='text-center'>Elija una Detracción<p>",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          });
          return false;
      }

    if (this.factura.esfisico) {
          let regex = /^[0-9]+$/i;
          let str = this.factura.nocomprobantepago1.trim();

          if (!regex.test(str) || this.factura.nocomprobantepago1.trim() == "000" || this.factura.nocomprobantepago1.length < 3) {
              swal({
                text: "La serie solo puede contener caracteres numéricos, deben ser 3 dígitos y no debe empezar en 000.",
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: "btn btn-warning"
              }).then(function () {
                $("#nocomprobantepago1").focus();
              });

              return false;
          }

          let regex2 = /^[0-9]+$/i;
          let str2 = this.factura.nocomprobantepago2.trim();

          if (!regex2.test(str2) || this.factura.nocomprobantepago2.length < 7) {
              swal({
                text: "El correlativo solo puede contener caracteres numéricos y deben ser 7 dígitos.",
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: "btn btn-warning"
              }).then(function () {
                $("#nocomprobantepago2").focus();
              });
              return false;
          }
    } else if (this.factura.eselectronico) {
      let regex1 = /^[a-z0-9]+$/i;
      let regex2 = /^[0-9]+$/i;
      let regex3 = /^[a-z]+$/i;
      let str1 = this.factura.nocomprobantepago1.trim();

      if (!regex3.test(str1.substring(0, 1))) {
          swal({
            html: "La serie es alfanumérica de cuatro caracteres empezando con un caracter.",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          }).then(function () {
            $("#nocomprobantepago1").focus();
          });
          return false;
      }

      if (str1.substring(0, 1) == "Ñ" || str1.substring(0, 1) == "ñ" || str1.length < 4) {
          swal({
            html: "La serie es alfanumérica de cuatro caracteres empezando con un caracter.",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          }).then(function () {
            $("#nocomprobantepago1").focus();
          });
          return false;
      }

      if (!regex1.test(str1)) {
          swal({
            html: "La serie es alfanumérica de cuatro caracteres empezando con un caracter.",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          }).then(function () {
            $("#nocomprobantepago1").focus();
          });
          return false;
      }

      let regex4 = /^[a-z0-9]+$/i;
      let regex5 = /^[0-9]+$/i;
      let str2 = this.factura.nocomprobantepago2.trim();

      if (!regex4.test(str2) || this.factura.nocomprobantepago2.length < 8) {
          swal({
            html: "El correlativo solo puede contener caracteres numéricos y hasta 8 dígitos.",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          }).then(function () {
            $("#nocomprobantepago2").focus();
          });
          return false;
      }
    }

    if (this.factura.razonsocialcliente == null || this.factura.razonsocialcliente.trim() == "") {
      swal({
        text: "Organización Compradora es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }

    if (this.factura.ruccliente == null || this.factura.ruccliente.trim() == "") {
      swal({
        text: "RUC Organización Compradora es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }

    if (this.factura.tipodocumento == null || this.factura.tipodocumento.trim() == "") {
      swal({
        text: "Tipo Documento es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }

    if (this.factura.tipodocumento == null || this.factura.tipodocumento.trim() == "") {
      swal({
        text: "Tipo Documento es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }



    if (this.factura.impuesto2 != null && this.factura.impuesto2 != "") {
      let regex1 = /^(((\d{1,3})(,\d{3})*)|(\d+))(.\d+)?$/i;
      if (!regex1.test(this.factura.impuesto2)) {
        swal({
          text: "Impuesto 2 es un campo numérico.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
        return false;
      }
    }

    if (this.factura.impuesto3 != null && this.factura.impuesto3 != "") {
      let regex1 = /^(((\d{1,3})(,\d{3})*)|(\d+))(.\d+)?$/i;
      if (!regex1.test(this.factura.impuesto3)) {
        swal({
          text: "Impuesto 3 es un campo numérico.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
        return false;
      }
    }

    if (this.factura.importereferencial != null && this.factura.importereferencial.toString() != "") {
      let regex1 = /^(((\d{1,3})(,\d{3})*)|(\d+))(.\d+)?$/i;
      if (!regex1.test(this.factura.importereferencial.toString())) {
        swal({
          text: "Impuesto Referencial es un campo numérico.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
        return false;
      }
    }

    if (this.factura.dsctomonto != null && this.factura.dsctomonto != "") {
      let regex1 = /^(((\d{1,3})(,\d{3})*)|(\d+))(.\d+)?$/i;
      if (!regex1.test(this.factura.dsctomonto)) {
        swal({
          text: "Total Descuento es un campo numérico.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
        return false;
      }
    }

    if (this.factura.impuesto1 == null) {
      swal({
        text: "Impuesto 1 es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }

    if (this.factura.importetotal == null) {
      swal({
        text: "Importe Total es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }

    if (this.factura.moneda == null) {
        swal({
          text: "Moneda es un campo requerido.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
        return false;
    }

    if (this.factura.detallefactura == null || this.factura.detallefactura.length == 0) {
        swal({
          text: "Al menos un ítem es requerido.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });

        return false;
    }

    if (enviar) {
        for (const articulo of this.factura.detallefactura) {
          if (articulo.estado == "Facturada") {
            swal({
              text: "Eliminar los ítems que ya fueron facturados.",
              type: 'warning',
              buttonsStyling: false,
              confirmButtonClass: "btn btn-warning"
            });

            return false;

          }
        }

        const facs = await this._dataService
          .verificar_duplicados(this.factura.nocomprobantepago, this.factura.rucproveedor, this.factura.ruccliente).toPromise();

        for(const fac of facs.data){
          if(fac.NumeroFactura == this.factura.nocomprobantepago){
            swal({
              text: "El número de comprobante de pago ya existe.",
              type: 'warning',
              buttonsStyling: false,
              confirmButtonClass: "btn btn-warning"
            }).then(function(){
              $("#nocomprobantepago1").focus();
            });

            return false;
          }
        }
    }else {
        const facs = await this._dataService
          .verificar_duplicados_borrador(this.factura.nocomprobantepago, this.factura.rucproveedor, this.factura.ruccliente).toPromise();

        for(let fac of facs.data){
          if(fac.factura.nocomprobantepago == this.factura.nocomprobantepago && fac.id_doc != this.factura.id_doc){
          swal({
            text: "El número de comprobante de pago ya existe.",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          }).then(function(){
            $("#nocomprobantepago1").focus();
          });

          return false;
          }
        }
    }

    return true;
  }

  async enviarFactura(e) {
      this.toggleButton = true;
      this.factura.nocomprobantepago = this.factura.nocomprobantepago1 + "-" + this.factura.nocomprobantepago2;
      this.factura.estado = "Q";

      if(this.esBorrador === '1'){
        this.factura.IdBorrador = this.factura.id_doc;
      }

      if (await this.validardatos(e, true)) {
        this._dataService
          .agregar(this.factura)
          .subscribe(
          p => {
              swal({
                text: 'La información ha sido enviada. Confirme el correcto registro de la misma verificando el Documento ERP '+
                      'en la columna correspondiente. Espere dicho número para la impresión de su constancia.',
                type: 'success',
                buttonsStyling: false,
                confirmButtonClass: "btn btn-success"
              });
              let nav = ['/cl-factura/proveedor/buscar'];
              oFacturaProveedorFormularioComponent.navigate(nav);
          },
          e => {
              this.toggleButton = false;
              console.log(e);
          },
          () => { });
      }else {
        this.toggleButton = false;
      }
  }

  async guardarFactura(e) {
      this.toggleButton = true;
      this.factura.nocomprobantepago = this.factura.nocomprobantepago1 + "-" + this.factura.nocomprobantepago2;
      this.factura.estado = "Q";
      this.factura.IdBorrador = this.factura.id_doc;
      if (await this.validardatos(e, false)) {
        this._dataService
          .guardar(this.factura)
          .subscribe(
          p => {

            swal({
              text: 'La información ha sido guardada. Confirme el correcto registro de la misma verificando el No. Doc. de Pago '+
                    'en la columna correspondiente.',
              type: 'success',
              buttonsStyling: false,
              confirmButtonClass: "btn btn-success"
            });
            let nav = ['/cl-factura/proveedor/buscar'];
            oFacturaProveedorFormularioComponent.navigate(nav);

          },
          e => {
            this.toggleButton = false;
            console.log(e);
          },
          () => { });
      } else {
        this.toggleButton = false;
      }
  }

  calcularTotal(e) {
      this.factura.importetotal = DatatableFunctions.FormatNumber(DatatableFunctions.StringToNumber(this.factura.subtotal) +
                                  DatatableFunctions.StringToNumber(this.factura.impuesto1) + 
                                  DatatableFunctions.StringToNumber((this.factura.impuesto2 == null ? 0 : this.factura.impuesto2)) +
                                  DatatableFunctions.StringToNumber((this.factura.impuesto3 == null ? 0 : this.factura.impuesto3)));

      $($("#importetotal").parent()).removeClass("is-empty");
  }

  registrarFactura(e) {
      if (this.factura.razonsocialcliente == null || this.factura.razonsocialcliente.trim() == "") {
          swal({
            text: "Organización Compradora es un campo requerido.",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          });
          return false;
      }

      if (this.factura.ruccliente == null || this.factura.ruccliente.trim() == "") {
          swal({
            text: "RUC Organización Compradora es un campo requerido.",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          });
          return false;
      }

      this.deshabilitarTipoDocumento=true;
      this.factura.eselectronico=false;
      this.factura.esfisico=true;

      $("#secCabecera").hide();
      $("#secFactura").show();
      this.step = 2;
  }

async habilitarEdicion(e) {

  if (this.factura.basefactura==='guia') {
  // if (this.factura.esguiamaterial) {
      const guias = [];
      let last_guia_id = '';

      try {
          for (const articulo of this.factura.detallefactura) {
              if (last_guia_id != articulo.IdGuia) {
                guias.push(articulo.IdGuia);
              }
              last_guia_id = articulo.IdGuia;
          }

          for(const guiaid of guias) {
            const guia = await this._dataGuiaService.obtener(guiaid).toPromise();

            for(const articulo of this.factura.detallefactura) {
              const articulo_guia = guia.articulos.filter(a => a.IdProdxGuia == articulo.IdProdxGuia);
              if (articulo_guia == null || articulo_guia.length == 0) {
                continue;
              }
              articulo.noparte = articulo_guia[0].nroparte;
              articulo.descproducto = articulo_guia[0].descproducto;
              articulo.preciounitreferencial = DatatableFunctions.FormatNumber(articulo_guia[0].precioitemoc);
              articulo.cantidad = DatatableFunctions.FormatNumber(articulo_guia[0].cantidadatendida);
              articulo.importetotalitem = DatatableFunctions.FormatNumber(articulo_guia[0].subtotalitemoc);
              articulo.estado = articulo_guia[0].estado;
            }
          }

          setTimeout(function () {
            dtArticulos.ajax.reload();
          }, 500);
      }catch(err) {}

  } else if (this.factura.basefactura==='has') {
  // } else if (this.factura.eshas) {
      const hases = [];
      let last_has_id = '';

      try {
          for (const articulo of this.factura.detallefactura){
              if (last_has_id != articulo.IdGuia) {
                hases.push(articulo.IdGuia);
              }
              last_has_id = articulo.IdGuia;
          }

          for(const hasid of hases){
              const has = await this._dataHASService
                .obtener(hasid).toPromise();

              for(const articulo of this.factura.detallefactura){
                const articulo_has = has.productos.filter(a => a.IdServicioxHAS == articulo.IdProdxGuia);  
                if (articulo_has == null || articulo_has.length == 0){
                  continue;
                }
                articulo.noparte = articulo_has[0].NumeroParte;
                articulo.descproducto = articulo_has[0].descripcion;
                articulo.preciounitreferencial = DatatableFunctions.FormatNumber(articulo_has[0].PrecioItem);
                articulo.cantidad = DatatableFunctions.FormatNumber(articulo_has[0].cantidadatendida);
                articulo.importetotalitem = DatatableFunctions.FormatNumber(articulo_has[0].valorrecibido);
                articulo.estado = articulo_has[0].estado;
              }
          }

          setTimeout(function () {
            dtArticulos.ajax.reload();
            // dtArticulosHAS.ajax.reload();
          }, 500);
      } catch(err) {}

    }

    this.toggleButton = false;
    $("#btnAgregarItemOC").removeClass('disabled');
    $("#btnEliminarItemOC").removeClass('disabled');
  }
  /*
    buscarCliente(event) {
      cargarBuscarClienteDT();

      event.preventDefault();
    }*/
  validarfiltrosCliente() {
    oFacturaProveedorFormularioComponent.filtroCliente.razonsocial = oFacturaProveedorFormularioComponent.filtroCliente.razonsocial.trim();
    oFacturaProveedorFormularioComponent.filtroCliente.ruc = oFacturaProveedorFormularioComponent.filtroCliente.ruc.trim();
    return true;
  }

  buscarClienteDT(e) {
    if (this.validarfiltrosCliente()){
      dtClientes.ajax.reload();
    }
  }

  SeleccionarCliente(event) {
    this.btnSeleccionar = true;

    event.preventDefault();
    const checkboxClientes = $('#dtBuscarCliente').find('.checkboxCliente:checked');
    if (checkboxClientes.length <= 0) {
      swal({
        text: "Debe seleccionar una Organización Compradora.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      this.btnSeleccionar = false;
      return false;
    }

    for (const checkboxCliente of checkboxClientes) {
      const id_organizacion = $(checkboxCliente).val();

      if (id_organizacion == localStorage.getItem('org_id')) {
        swal({
          text: "La Organización Compradora no puede ser la misma que está realizando el pre-registro.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
        this.btnSeleccionar = false;
        return;
      }

      this.factura.razonsocialcliente = $(checkboxCliente).attr("razonsocial");
      this.factura.ruccliente = $(checkboxCliente).attr("ruc");
      this.factura.IdOrgCliente = id_organizacion;

      /*if(this.id == "0"){
        this.factura.razonsocialproveedor = this.usuarioActual.organizaciones[0].nombre;
      }*/
    }

    setTimeout(function () {
      dtClientes.ajax.reload();
      $("#mdlBuscarCliente").modal('toggle');
      $("input").each(function () {
          $(this).keydown();
          if (!$(this).val() && $(this).val() == ''){
            $(this.parentElement).addClass("is-empty");
          }
      });
    }, 500);
    // this.btnSeleccionar = false;
  }

  print(event): void {
      this.factura.tipodocumento_text = $("#tipodocumento option:selected").text();
      this.factura.estado_text = $("#estado option:selected").text();
      this.factura.moneda_text = $("#moneda option:selected").text();
      setTimeout(function () {
        $("div#print-section").printArea({ popTitle: 'Comprobante de Pago', mode: "iframe", popClose: false });
      }, 200);
  }

  validarfiltrosGuia() {
      return true;
  }

  buscarGuiaDT() {
      if (this.validarfiltrosGuia()){
          dtGuias.ajax.reload();
      }

      event.preventDefault();
  }

  buscarCliente(e) {
      this.filtroCliente.razonsocial = "";
      this.filtroCliente.ruc = "";
      if (dtClientes != null) {
        this.buscarClienteDT(e);
      } else {
        cargarBuscarClienteDT();
      }
  }

}



function cargarBuscarClienteDT() {
    dtClientes = $('#dtBuscarCliente').DataTable({
      searching: false,

      serverSide: true,
      ajax: {

        beforeSend: function (request) {
          request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
          request.setRequestHeader("origen_datos", 'PEB2M');
          request.setRequestHeader("tipo_empresa", 'P');
          request.setRequestHeader("org_id", localStorage.getItem('org_id'));
          request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
        },
        url: URL_BUSCAR_ORGANIZACION,
        dataSrc: "data",
        data: function (d) {

          if (oFacturaProveedorFormularioComponent.filtroCliente.razonsocial != "") {
            d.RazonSocial = oFacturaProveedorFormularioComponent.filtroCliente.razonsocial;
          }

          if (oFacturaProveedorFormularioComponent.filtroCliente.ruc != "") {
            d.Ruc = oFacturaProveedorFormularioComponent.filtroCliente.ruc;
          }

          d.column_names = 'IdOrganizacion,RazonSocial,Ruc';

        }
      },

      columns: [
        { data: 'IdOrganizacion' },
        { data: 'RazonSocial' },
        { data: 'Ruc' },
      ],
      columnDefs: [
        { "className": "text-center", "targets": [1, 2] },
        {
            render: function (data, type, row) {
              return '<div class="text-right" height="100%"><div class="radio text-right"><label>'+
                     '<input type="radio" name="optionsCheckboxes" class="checkboxCliente" ruc="' + row.Ruc + 
                    '" razonsocial="' + row.RazonSocial + '" value="' + row.IdOrganizacion + '"></label></div></div>';
            },
            targets: 0
        },
      ]
    });
}


function cargarBuscarGuiaDT() {
  dtGuias = $('#dtBuscarGuia').on('draw.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, dtGuias);
  }).DataTable({
    order: [[4, "desc"]],
    searching: false,
    serverSide: true,
    ajax: {

      beforeSend: function (request) {

        request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        request.setRequestHeader("origen_datos", 'PEB2M');
        request.setRequestHeader("tipo_empresa", 'P');
        request.setRequestHeader("org_id", localStorage.getItem('org_id'));
        request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_GUIA,

      dataSrc: "data",
      data: function (d) {
        if (oFacturaProveedorFormularioComponent.filtroGuia.nroguia != "") {
          d.NumeroGuia = oFacturaProveedorFormularioComponent.filtroGuia.nroguia;
        }
        // d.Estado = "GACEP";

        if (oFacturaProveedorFormularioComponent.filtroGuia.estado != "NONE") {
          d.Estado = oFacturaProveedorFormularioComponent.filtroGuia.estado;
        } else {
          d.Estado = "TODOS";
          d.origen_modulo = "comprobantes";
        }

        if (oFacturaProveedorFormularioComponent.filtroGuia.fechaemitidadesde) {
          const fechaemisioninicio = DatatableFunctions.ConvertStringToDatetime(oFacturaProveedorFormularioComponent.filtroGuia.fechaemitidadesde);
          d.FechaEmision_inicio = DatatableFunctions.FormatDatetimeForMicroService(fechaemisioninicio);
        }

        if (oFacturaProveedorFormularioComponent.filtroGuia.fechaemitidahasta) {
          const fechaemisionfin = DatatableFunctions.AddDayEndDatetime(DatatableFunctions.ConvertStringToDatetime(oFacturaProveedorFormularioComponent.filtroGuia.fechaemitidahasta));
          d.FechaEmision_fin = DatatableFunctions.FormatDatetimeForMicroService(fechaemisionfin);
        }
        d.org_idComprador = oFacturaProveedorFormularioComponent.factura.IdOrgCliente;
        d.Moneda = oFacturaProveedorFormularioComponent.factura.moneda;
        d.column_names = '[CodigoGuia,NumeroGuia,FechaEmision,FechaInicioTraslado,FechaEstimadaArribo,RazonSocialCliente,RazonSocialProveedor,Estado,DocumentoMaterial]';
      }
    },

    columns: [
        { data: 'NumeroGuia', name: 'NumeroGuia' },
        { data: 'NumeroGuia', name: 'NumeroGuia' },
        { data: 'Estado', name: 'Estado' },
        { data: 'RazonSocialCliente', name: 'RazonSocialCliente' },
        { data: 'FechaEmision', name: 'FechaEmision' },
        { data: 'FechaInicioTraslado', name: 'FechaInicioTraslado' },
        { data: 'FechaEstimadaArribo', name: 'FechaEstimadaArribo' },
    ],
    columnDefs: [
        { "className": "text-center", "targets": [1, 2, 3, 4, 5, 6] },
        {
            render: function (data, type, row) {
              return '<div class="text-right" height="100%"><div class="checkbox text-right"><label>'+
                     '<input type="checkbox" name="optionsCheckboxes" numguia="' + row.NumeroGuia + '" value="' + row.CodigoGuia +
                     '" class="checkboxGuia"></label></div></div>';
            },
            targets: 0,
            orderable: false
        },
    ]
  });
}



function cargarBuscarAceptacionServicioDT() {
  dtBuscarAceptacionServicio = $('#dtBuscarAceptacionServicio').on('draw.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, dtBuscarAceptacionServicio);
  }).DataTable({
    order: [[5, "desc"]],
    searching: false,
    serverSide: true,
    ajax: {

      beforeSend: function (request) {
          request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
          request.setRequestHeader("origen_datos", 'PEB2M');
          request.setRequestHeader("tipo_empresa", 'P');
          request.setRequestHeader("org_id", localStorage.getItem('org_id'));
          request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_HAS,
      dataSrc: "data",
      data: function (d) {

        if (oFacturaProveedorFormularioComponent.filtrohas.nroconformidadservicio != "") {
          d.NroConformidadServicio = oFacturaProveedorFormularioComponent.filtrohas.nroconformidadservicio;
        }


        /*if (oFacturaProveedorFormularioComponent.filtrohas.estado != "NONE") {
          d.Estado = oFacturaProveedorFormularioComponent.filtrohas.estado;
        }*/

        if (oFacturaProveedorFormularioComponent.filtrohas.estado != "NONE") {
          d.Estado = oFacturaProveedorFormularioComponent.filtrohas.estado;
        } else {
          d.Estado = "TODOS";
          d.origen_modulo = "comprobantes";
        }

        if (oFacturaProveedorFormularioComponent.filtrohas.nroerp != "") {
          d.CodigoHASERP = oFacturaProveedorFormularioComponent.filtrohas.nroerp;
        }

        if (oFacturaProveedorFormularioComponent.filtrohas.fechacreacioninicio) {

          let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oFacturaProveedorFormularioComponent.filtrohas.fechacreacioninicio);
          d.FechaAprobacion_inicio = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
        }

        if (oFacturaProveedorFormularioComponent.filtrohas.fechacreacionfin) {

          const fechacreacionfin = DatatableFunctions.AddDayEndDatetime(DatatableFunctions.ConvertStringToDatetime(oFacturaProveedorFormularioComponent.filtrohas.fechacreacionfin));
          d.FechaAprobacion_fin = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);
        }

        d.IdOrgCompradora = oFacturaProveedorFormularioComponent.factura.IdOrgCliente;
        d.Moneda = oFacturaProveedorFormularioComponent.factura.moneda;

        // d.org_idComprador = oFacturaProveedorFormularioComponent.factura.IdOrgCliente;
        // d.column_names = 'IdHas,NroConformidadServicio,Proveedor,Cliente,Estado,FechaAprobacion';
        d.column_names = 'IdHas,NroConformidadServicio,DocumentoMaterial,Proveedor,Cliente,EstadoDescripcion,FechaAprobacion';
      }
    },
    columns: [
      { data: 'IdHas', name: 'IdHas' },
      { data: 'NroConformidadServicio', name: 'NroConformidadServicio' },
      { data: 'DocumentoMaterial', name: 'DocumentoMaterial' }, // DocumentoMaterial
      { data: 'EstadoDescripcion', name: 'EstadoDescripcion' },
      { data: 'Cliente', name: 'Cliente' },
      { data: 'FechaAprobacion', name: 'FechaAprobacion' },
      /*
      { data: 'NroConformidadServicio', name: 'NroConformidadServicio' },
      { data: 'Proveedor', name: 'Proveedor' },
      { data: 'Cliente', name: 'Cliente' },
      { data: 'Estado', name: 'Estado' },
      { data: 'FechaAprobacion', name: 'FechaAprobacion' },
      { data: 'IdHas', name: 'IdHas' },
      */
    ],
    columnDefs: [
      { "className": "text-center", "targets": [1, 2, 3, 4, 5] },
      {
        render: function (data, type, row) {
          return '<div class="text-right" height="100%"><div class="checkbox text-right"><label>'+
                 '<input type="checkbox" name="optionsCheckboxes" numhas="' + row.NroConformidadServicio + '" value="' + row.IdHas +
                 '" class="checkboxAceptacionServicio"></label></div></div>';
        },
        targets: 0,
        orderable: false
      },
    ]
  });

}



function cargarBuscarTicketTransporteDT() {
  dtBuscarTicketTransporte = $('#dtBuscarTicketTransporte').on('draw.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, dtBuscarTicketTransporte);
  }).DataTable({
    order: [[5, "desc"]],
    searching: false,
    serverSide: true,
    ajax: {

      beforeSend: function (request) {
          request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
          request.setRequestHeader("origen_datos", 'PEB2M');
          request.setRequestHeader("tipo_empresa", 'P');
          request.setRequestHeader("org_id", localStorage.getItem('org_id'));
          request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_TRANSPORTE,
      dataSrc: "data",
      data: function (d) {

        let omitirOtrosCampos = false;
/*
        if (oFacturaProveedorFormularioComponent.filtroticket.nroguia != '') {
            d.NumeroGuia = oFacturaProveedorFormularioComponent.filtroticket.nroguia;
            omitirOtrosCampos = true;
        }
*/
        if (oFacturaProveedorFormularioComponent.filtroticket.documentoERP != "") {
            d.DocumentoERP = oFacturaProveedorFormularioComponent.filtroticket.documentoERP.trim();
            omitirOtrosCampos = true;
        }
/*
        NumeroGuia
        DocumentoERP
        Estado
        FechaRegistroInicio
        FechaRegistroFin
*/

        /*if (oFacturaProveedorFormularioComponent.filtrohas.estado != "NONE") {
          d.Estado = oFacturaProveedorFormularioComponent.filtrohas.estado;
        }*/

        if(!omitirOtrosCampos){

            if (oFacturaProveedorFormularioComponent.filtroticket.nroguia != '') {
              d.NumeroGuia = oFacturaProveedorFormularioComponent.filtroticket.nroguia.trim();
            }

            if (oFacturaProveedorFormularioComponent.filtroticket.estado != "NONE") {
              d.Estado = oFacturaProveedorFormularioComponent.filtroticket.estado;
            }
            /*else {
              d.Estado = "TODOS";
              d.origen_modulo = "comprobantes";
            }
            */
            /*
            if (oFacturaProveedorFormularioComponent.filtroticket.documentoERP != "") {
              d.DocumentoERP = oFacturaProveedorFormularioComponent.filtroticket.documentoERP;
            }
            */
            if (oFacturaProveedorFormularioComponent.filtroticket.fechacreacioninicio) {
              const fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oFacturaProveedorFormularioComponent.filtroticket.fechacreacioninicio);
              d.FechaRegistroInicio = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
            }

            if (oFacturaProveedorFormularioComponent.filtrohas.fechacreacionfin) {
              const fechacreacionfin = DatatableFunctions.AddDayEndDatetime(DatatableFunctions.ConvertStringToDatetime(oFacturaProveedorFormularioComponent.filtroticket.fechacreacionfin));
              d.FechaRegistroFin = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);
            }

            d.IdOrgCompradora = oFacturaProveedorFormularioComponent.factura.IdOrgCliente;
            d.Moneda = oFacturaProveedorFormularioComponent.factura.moneda;

        }
        // d.org_idComprador = oFacturaProveedorFormularioComponent.factura.IdOrgCliente;
        // d.column_names = 'IdHas,NroConformidadServicio,Proveedor,Cliente,Estado,FechaAprobacion';
        d.column_names = 'IdTicket,DocumentoERP,Estado,RazonSocialComprador,RucComprador,FechaAceptacion';
      }
    },
    columns: [

      { data: 'IdTicket', name: 'IdTicket' },
      { data: 'DocumentoERP', name: 'DocumentoERP' },
      { data: 'Estado', name: 'Estado' }, // DocumentoMaterial
      { data: 'RazonSocialComprador', name: 'RazonSocialComprador' },
      { data: 'RucComprador', name: 'RucComprador' },
      { data: 'FechaAceptacion', name: 'FechaAceptacion' },

/*
      { data: 'DocumentoERP', name: 'DocumentoERP' },
      { data: 'Estado', name: 'Estado' },
      { data: 'RazonSocialComprador', name: 'RazonSocialComprador' },
      { data: 'FechaAceptacion', name: 'FechaAceptacion' },
      { data: 'RucComprador', name: 'RucComprador' },
      { data: 'IdTicket', name: 'IdTicket'},
*/

      /*
      { data: 'NroConformidadServicio', name: 'NroConformidadServicio' },
      { data: 'Proveedor', name: 'Proveedor' },
      { data: 'Cliente', name: 'Cliente' },
      { data: 'Estado', name: 'Estado' },
      { data: 'FechaAprobacion', name: 'FechaAprobacion' },
      { data: 'IdHas', name: 'IdHas' },
      */
    ],
    columnDefs: [
        { "className": "text-center", "targets": [1, 2, 3, 4, 5] },

        {
          render: function (data, type, row) {
            return '<div class="text-right" height="100%"><div class="checkbox text-right"><label>'+
                  '<input type="checkbox" name="optionsCheckboxes" numticket="' + row.DocumentoERP + '" value="' + row.IdTicket +
                  '" class="checkboxTicketTransporte"></label></div></div>';
          },
          targets: 0,
          orderable: false
        },
        {
          render: function (data, type, row) {
            return moment(row.FechaAceptacion).format('DD/MM/YYYY');
          },
          targets: 5,
          orderable: true
        },

    ]
  });

}



function cargarGuiasDT() {
  // $('#dtArticulos').rows().remove().draw();
  dtArticulos = $('#dtArticulos').on('init.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, dtArticulos);
  }).DataTable({
    /*
    ajax: {
      "url": "https://jsonplaceholder.typicode.com/posts",
      "dataSrc": ""
    },
    */
    "ajax": function (data, callback, settings) {
        const result = {
            data: oFacturaProveedorFormularioComponent.factura.detallefactura
        };
        callback(
            result
        );
    },
    columns: [
        { data: 'noitem' },
        { data: 'noitem' },
        { data: 'noguia' },
        { data: 'nooc' },
        // { data: 'noitemoc' },
        { data: 'noparte' },
        { data: 'descproducto' },
        { data: 'cantidad' },
        // { data: 'preciounitreferencial' },
        { data: 'importetotalitem' },
        // { data: 'subtotalitemguia' },
        // { data: 'estado' },
        { data: 'descproducto' },
        { data: 'descproducto' },
        { data: 'descproducto' },

    ],
    columnDefs: [
        { "className": "text-center", "targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        {
            render: function (data, type, row) {
              // return data +' ('+ row[3]+')';
              // return '<div class="checkbox"><label><input type="checkbox" name="optionsCheckboxes"></label></div>';
              return '<div class="text-right" height="100%"><div class="checkbox text-right"><label>'+
                     '<input type="checkbox" name="optionsCheckboxes" value="' + row.noitem +
                     '" class="checkboxArticulos"></label></div></div>';
            },
            targets: 0
        },
        /*
        {
          targets: [10],
          visible: oFacturaProveedorFormularioComponent.esBorrador === '1' ? true : false
        },
        {
          targets: [5],
          visible: oFacturaProveedorFormularioComponent.esBorrador === '1' ? true : false
        }
        */
        {
            render: function (data, type, row) {
                if(oFacturaProveedorFormularioComponent.factura.basefactura=='ticket'){
                    return '-';
                }else {
                    return '<div class="checkbox text-right"><label>'+
                           '<input name="checkArticuloGuia" type="checkbox" checked  value="' + row.IdProdxGuia +
                           '" class=" checkbox-igv-articulo"></label></div>';
                }
            },
            targets: 8
        },
        {
            render: function (data, type, row) {
                // alert(row.importetotalitem);
                if(oFacturaProveedorFormularioComponent.factura.basefactura=='ticket'){
                    return '-';
                }else {
                    const valor = numeral(numeral(row.importetotalitem).value()*oFacturaProveedorFormularioComponent.porcentajeIGV).format('0,0.0000');
                    return '<input style="width:90px;" name="igv-importe-articulo-guia-'+row.IdProdxGuia+
                           '" type="text" class="form-control" monto-igv-item="'+valor+'" value="'+valor+'" disabled>';
                }
            },
            targets: 9,
        },
        {
            render: function (data, type, row) {
                if(oFacturaProveedorFormularioComponent.factura.basefactura=='ticket'){
                    return '-';
                }else {
                    return '<input style="width:90px;" name="isc-importe-articulo-guia-'+row.IdProdxGuia+
                           '" type="text" class="importeIscArticulosGuia form-control"  value="">';
                }
            },
            targets: 10,
        },
    ]
  });


  dtArticulos.on('click', 'input[name*="checkArticuloGuia"]', function (event) {
      if($(this).is(':checked')) {
          $("input[name*='igv-importe-articulo-guia-"+$(this).val()+"']").val($("input[name*='igv-importe-articulo-guia-"+$(this).val()+"']").attr('monto-igv-item'));
      } else {
          $("input[name*='igv-importe-articulo-guia-"+$(this).val()+"']").val('');
      }

      SumarIGVdeArticulosDeGuia();
  });

  dtArticulos.on('focusout', '.importeIscArticulosGuia', function (event) {
      SumarISCdeArticulosDeGuia();
  });

  $('input[name*="fise"]').focusout(function() {
      SumarImporteTotal();
  });

  $('input[name*="dsctomonto"]').focusout(function() {
      SumarImporteTotal();
  });



  dtArticulosHAS = $('#dtArticulosHAS').DataTable({

    /*
     ajax: {
       "url": "https://jsonplaceholder.typicode.com/posts",
       "dataSrc": ""
     },
    */

    'ajax' : function (data, callback, settings) {
        const result = {
          data: oFacturaProveedorFormularioComponent.factura.detallefactura
        };
        callback(
          result
        );
    },
    'createdRow' : function (row, data, index) {
        if (data.posicion === "10" || data.posicion === "20") {
          $(row).addClass('highlight');
          // $('td', row).eq(1).addClass('parent');
        } else {
          // $(row).addClass('child');
          $('td', row).eq(0).addClass('text-center');
        }
    },

    columns: [
        { data: 'noitem' },
        { data: 'noitem' },
        { data: 'noguia' },
        { data: 'nooc' },
        { data: 'noitemoc' },
        { data: 'noparte' },
        { data: 'descproducto' },
        { data: 'cantidad' },
        { data: 'preciounitreferencial' },
        { data: 'importetotalitem' },
        // { data: 'subtotalitemguia' },
        { data: 'estado' },
    ],
    columnDefs: [
        { 'className': 'text-center', 'targets': [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        {
          render: function (data, type, row) {

            // return data +' ('+ row[3]+')';
            // return '<div class="checkbox"><label><input type="checkbox" name="optionsCheckboxes"></label></div>';
            return '<div class="text-right" height="100%"><div class="checkbox text-right"><label>'+
                   '<input type="checkbox" name="optionsCheckboxes" value="' + row.noitem + 
                   '" class="checkboxArticulos"></label></div></div>';
          },
          targets: 0
        },
        {
          targets: [10],
          visible: oFacturaProveedorFormularioComponent.esBorrador === '1' ? true : false
        },
        {
          targets: [5],
          visible: oFacturaProveedorFormularioComponent.esBorrador === '1' ? true : false
        }
    ]

  });
}


function SumarIGVdeArticulosDeGuia() {
    let suma = 0;

    for (const articulo of oFacturaProveedorFormularioComponent.factura.detallefactura) {
        if(  $('input[name*="checkArticuloGuia"][value="'+articulo.IdProdxGuia+'"]').is(':checked') ) {
            suma += numeral($("input[name*='igv-importe-articulo-guia-"+articulo.IdProdxGuia+"']").val()).value();
        }
    }
    oFacturaProveedorFormularioComponent.factura.igv= numeral(suma).format('0,0.0000');
    SumarImporteTotal();
}

function SumarISCdeArticulosDeGuia() {
    let suma = 0;

    for (const articulo of oFacturaProveedorFormularioComponent.factura.detallefactura){
        const valor = $("input[name*='isc-importe-articulo-guia-"+articulo.IdProdxGuia+"']").val();
        if(  valor.trim()!='' ){
            suma += numeral(valor).value();
        }
    }
    oFacturaProveedorFormularioComponent.factura.isc= numeral(suma).format('0,0.0000');
    SumarImporteTotal();
}

function SumarImporteTotal() {
  if(oFacturaProveedorFormularioComponent.factura.basefactura==='ticket') {
    oFacturaProveedorFormularioComponent.factura.importetotal=numeral(numeral(oFacturaProveedorFormularioComponent.ticket_importetotal).value()-numeral(oFacturaProveedorFormularioComponent.factura.dsctomonto).value()).format('0,0.0000');
  } else {
    oFacturaProveedorFormularioComponent.factura.importetotal=numeral(numeral(oFacturaProveedorFormularioComponent.factura.igv).value()+numeral(oFacturaProveedorFormularioComponent.factura.isc).value()+numeral(oFacturaProveedorFormularioComponent.factura.subtotal).value()+numeral(oFacturaProveedorFormularioComponent.factura.fise).value()-numeral(oFacturaProveedorFormularioComponent.factura.dsctomonto).value()).format('0,0.0000');
  }

}

function ActualizarCorrelativos(lista) {
    let index = 1;
    for (const item of lista) {
      item.noitem = index++;
    }
    return lista;
}

