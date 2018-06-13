import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { DetalleOrdenCompra } from "app/model/detalleordencompra";
import { BuscarOrdenCompra } from "app/model/buscarordencompra";
import { ClienteBuscar } from "app/model/cliente";
import { GuiaBuscar } from "app/model/guia";
import { Factura, DetalleFactura } from "app/model/factura";
import { Archivo } from "app/model/archivo";

import { MasterService } from "app/service/masterservice";
import { FacturaService } from "app/service/facturaservice";
import { AppUtils } from "app/utils/app.utils";
import { ComboItem } from "app/model/comboitem";
import { AdjuntoService } from "app/service/adjuntoservice";

import { LoginService } from 'app/service/login.service';
import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var moment: any;
declare var $: any;
declare var DatatableFunctions, saveAs: any;
var oFacturaCompradorFormularioComponent: FacturaCompradorFormularioComponentPub, dtArticulos, dtArticulosHAS, dtArchivos, archivo: Archivo;
@Component({
  moduleId: module.id,
  selector: 'facturacompradorformulario-cmp',
  templateUrl: 'facturacompradorformulario.component.html',
  providers: [AdjuntoService, MasterService, FacturaService, LoginService]
})

export class FacturaCompradorFormularioComponentPub implements OnInit, OnChanges, AfterViewInit {

  public listDetalleFactura: DetalleFactura[];
  public listBuscarGuia: GuiaBuscar[];
  public listBuscarCliente: ClienteBuscar[];
  public listEstadoCombo: ComboItem[];
  public listMonedaCombo: ComboItem[];
  public listTipoComprobante: ComboItem[];
  public factura: Factura;
  public step: number = 1;
  public id: string = "";
  public toggleButton: boolean = true;
  private activatedRoute: ActivatedRoute;
  public botonImprimir: Boton = new Boton();
  public url_main_module_page = '/sm-factura/comprador/buscar';

  util: AppUtils;

  constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService, private _dataServiceAdjunto: AdjuntoService, private _dataService: FacturaService, private _securityService: LoginService, private cdRef: ChangeDetectorRef) {
      this.activatedRoute = route;
      this.listDetalleFactura = [];

      this.util = new AppUtils(this.router, this._masterService);
  }

  obtenerBotones() {
      let botones = this._securityService.ObtenerBotonesCache(this.url_main_module_page) as Boton[];
      if (botones) {
          console.log('ObtenerBotonesCache', botones);
          this.configurarBotones(botones);
      }
      else {

          this._securityService.obtenerBotones(this.url_main_module_page).subscribe(
            botones => {
              console.log('obtenerBotones', botones);
              oFacturaCompradorFormularioComponent.configurarBotones(botones);
              oFacturaCompradorFormularioComponent._securityService.guardarBotonesLocalStore(this.url_main_module_page, botones);
            },
            e => console.log(e),
            () => { });
      }
  }

  configurarBotones(botones: Boton[]) {
      if (botones && botones.length > 0) {

        this.botonImprimir = botones.find(a => a.nombre === 'imprimir') ? botones.find(a => a.nombre === 'imprimir') : this.botonImprimir;
        console.log('this.botonImprimir ', this.botonImprimir );
      }
  }

  print(event): void {
      this.factura.tipodocumento_text = $("#tipodocumento option:selected").text();
      this.factura.estado_text = $("#estado option:selected").text();
      this.factura.moneda_text = $("#moneda option:selected").text();
      setTimeout(function () {
        $("div#print-section").printArea({ popTitle: 'Comprobante de Pago', mode: "iframe", popClose: false });
      }, 200);
  }

  ngOnInit() {
      this.factura = new Factura;

      this.activatedRoute.params.subscribe((params: Params) => {
          this.id = params['id'];
      });

      if (this.id != "0") {
          this.toggleButton = true;
          $("#btnAgregarItemOC").addClass('disabled');
          $("#btnEliminarItemOC").addClass('disabled');
          $("#secCabecera").hide();
          $("#secFactura").show();
      } else {
          this.toggleButton = false;
          $("#secCabecera").show();
          $("#secFactura").hide();
      }
      oFacturaCompradorFormularioComponent = this;

      this.util.listEstadoCP(function (data: ComboItem[]) {
        oFacturaCompradorFormularioComponent.listEstadoCombo = data;
      });

      this.util.listMonedas(function (data: ComboItem[]) {
        oFacturaCompradorFormularioComponent.listMonedaCombo = data;
      });

      this.util.listTipoComprobante(function (data: ComboItem[]) {
        oFacturaCompradorFormularioComponent.listTipoComprobante = data;
      });
  }

  ngAfterViewInit() {
    DatatableFunctions.ModalSettings();

    this._dataService
      .obtener(this.id, "C")
      .subscribe(
      p => {

        this.factura = p;
        setTimeout(function () {



          $("input").each(function () {
            $(this).keydown();
            if (!$(this).val() && $(this).val() == '')
              $(this.parentElement).addClass("is-empty");
          });
          $("select").each(function () {
            $(this).keydown();
            if (!$(this).val() && $(this).val() == '')
              $(this.parentElement).addClass("is-empty");
          });


          $("textarea").each(function () {
            $(this).keydown();
            if (!$(this).val() && $(this).val() == '')
              $(this.parentElement).addClass("is-empty");
          });

          dtArticulos.ajax.reload();

          dtArticulosHAS.ajax.reload();
          dtArchivos.ajax.reload();
        }, 100);




      },
      e => console.log(e),
      () => { });

    dtArchivos = $('#dtArchivos').on('draw.dt', function (e, settings, json) {
      DatatableFunctions.initDatatable(e, settings, json, dtArchivos);

    }).DataTable({
      ajax: function (data, callback, settings) {

        let result = {
          data: oFacturaCompradorFormularioComponent.factura.docadjuntos

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
        { "className": "text-center", "targets": [1, 2, 3] },
        {

          render: function (data, type, row) {
            return '';
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


    // Edit record
    dtArchivos.on('click', '.download', function (event) {
      var $tr = $(this).closest('tr');

      let row_id = $tr.find("a.editar").attr('row-id');

      var lista = oFacturaCompradorFormularioComponent.factura.docadjuntos as Archivo[];
      archivo = lista.find(a => a.id == row_id) as Archivo;





      oFacturaCompradorFormularioComponent._dataServiceAdjunto
        .DescargarArchivo(archivo)
        .subscribe(
        blob => {



          saveAs(blob, archivo.nombre);


        },
        e => console.log(e),
        () => { });
      event.preventDefault();

    });

    DatatableFunctions.registerCheckAll();
    cargarGuiasDT();

    this.obtenerBotones();
  }
  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  registrarFactura(e) {
    $("#secCabecera").hide();
    $("#secFactura").show();
    this.step = 2;
  }

  habilitarEdicion(e) {
    this.toggleButton = false;
    $("#btnAgregarItemOC").removeClass('disabled');
    $("#btnEliminarItemOC").removeClass('disabled');
  }


}

function cargarBuscarClienteDT() {

  var datatable = $('#dtBuscarCliente').DataTable({

    /* ajax: {
       "url": "https://jsonplaceholder.typicode.com/posts",
       "dataSrc": ""
     },*/

    "ajax": function (data, callback, settings) {
      console.log(oFacturaCompradorFormularioComponent);
      let result = {
        data: oFacturaCompradorFormularioComponent.listBuscarCliente

      };
      callback(
        result
      );
    },
    columns: [
      { data: 'id' },
      { data: 'nombre' },
      { data: 'ruc' },
    ],
    columnDefs: [
      {

        render: function (data, type, row) {

          //return data +' ('+ row[3]+')';
          return '<div class="checkbox"><label><input type="checkbox" name="optionsCheckboxes"></label></div>';
        },
        targets: 0
      },

    ]
  });
}

function cargarBuscarGuiaDT() {

  var datatable = $('#dtBuscarGuia').DataTable({

    /* ajax: {
       "url": "https://jsonplaceholder.typicode.com/posts",
       "dataSrc": ""
     },*/

    "ajax": function (data, callback, settings) {
      let result = {
        data: oFacturaCompradorFormularioComponent.listBuscarGuia

      };
      callback(
        result
      );
    },

    columns: [
      { data: 'nroguia' },
      { data: 'nroguia' },
      { data: 'estado' },
      { data: 'proveedor' },
      { data: 'fechaemision' },
      { data: 'fechainiciotraslado' },
      { data: 'fechaprobablearribo' },
    ],
    columnDefs: [
      {

        render: function (data, type, row) {

          //return data +' ('+ row[3]+')';
          return '<div class="checkbox"><label><input type="checkbox" name="optionsCheckboxes"></label></div>';
        },
        targets: 0
      },

    ]
  });



}
function cargarGuiasDT() {
  dtArticulos = $('#dtArticulos').on('init.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, dtArticulos);
  }).DataTable({
    /* ajax: {
       "url": "https://jsonplaceholder.typicode.com/posts",
       "dataSrc": ""
     },*/
    "ajax": function (data, callback, settings) {
      let result = {
        data: oFacturaCompradorFormularioComponent.factura.detallefactura
      };
      callback(
        result
      );
    },
    "createdRow": function (row, data, index) {
      if (data.posicion === "10" || data.posicion === "20") {
        $(row).addClass('highlight');
        //$('td', row).eq(1).addClass('parent');
      }
      else {
        //$(row).addClass('child');
        $('td', row).eq(0).addClass('text-center');
      }
    },

    columns: [

      { data: 'noitem' },
      { data: 'noguia' },
      { data: 'nooc' },
      { data: 'noitemoc' },

      { data: 'descproducto' },
      { data: 'cantidad' },
      { data: 'preciounitreferencial' },
      { data: 'importetotalitem' },
    ],
    columnDefs: [
      { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5, 6, 7] },

    ]
  });

  dtArticulosHAS = $('#dtArticulosHAS').DataTable({

    /* ajax: {
       "url": "https://jsonplaceholder.typicode.com/posts",
       "dataSrc": ""
     },*/

    "ajax": function (data, callback, settings) {
      let result = {
        data: oFacturaCompradorFormularioComponent.factura.detallefactura

      };
      callback(
        result
      );
    },
    "createdRow": function (row, data, index) {

      if (data.posicion === "10" || data.posicion === "20") {
        $(row).addClass('highlight');
        //$('td', row).eq(1).addClass('parent');
      }
      else {
        //$(row).addClass('child');
        $('td', row).eq(0).addClass('text-center');
      }

    },

    columns: [

      { data: 'noitem' },
      { data: 'noguia' },
      { data: 'nooc' },
      { data: 'noitemoc' },

      { data: 'descproducto' },
      { data: 'cantidad' },
      { data: 'preciounitreferencial' },
      { data: 'importetotalitem' },

    ],
    columnDefs: [
      { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5, 6, 7] },

    ]

  });
}