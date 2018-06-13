import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';

import { MomentModule } from 'angular2-moment/moment.module';
import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { OrdenCompra, Atributo, Producto } from "app/model/sm-ordencompra";
import '../../../../assets/js/plugins/jquery.PrintArea.js';
import { OrdenCompraService } from "app/service/sm-ordencompraservice";
import { LoginService } from '../../../service/login.service';
import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';
declare var moment: any;
declare var swal: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $: any;
declare var DataHardCode: any;
declare var DatatableFunctions: any;
var oOrdenCompraCompradorFormularioComponent: OrdenCompraCompradorFormularioComponent, dtArticulos, dtAtributos;

@Component({
  moduleId: module.id,
  selector: 'ordencompracompradorformulario-cmp',
  templateUrl: 'ordencompracompradorformulario.component.html',
  providers: [OrdenCompraService, MasterService,LoginService]
})

export class OrdenCompraCompradorFormularioComponent implements OnInit, AfterViewInit {

  public toggleButton: boolean = true;
  public id: string = "";
  public botonImprimir: Boton = new Boton();
  util: AppUtils;
  public listPrioridadCombo: ComboItem[];
  public listMonedaCombo: ComboItem[];
  public listUnidadCombo: ComboItem[];
  public listEstadoCombo: ComboItem[];
  public url_main_module_page = '/sm-ordencompra/comprador/buscar';

  public item: OrdenCompra;
  public baseurl: string;
  public producto: Producto;
  public atributos: Atributo[];
  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private _masterService: MasterService, private _dataService: OrdenCompraService, private _securityService: LoginService, private cdRef:ChangeDetectorRef) {
    this.util = new AppUtils(this.router, this._masterService);

    this.atributos = [];
    this.producto = new Producto();
  }
  obtenerBotones() {

    let botones = this._securityService.ObtenerBotonesCache(this.url_main_module_page) as Boton[];
    if (botones) {
      console.log('ObtenerBotonesCache',botones);
      this.configurarBotones(botones);
    }
    else {

      this._securityService.obtenerBotones(this.url_main_module_page).subscribe(
        botones => {
          console.log('obtenerBotones',botones);
          oOrdenCompraCompradorFormularioComponent.configurarBotones(botones);
          oOrdenCompraCompradorFormularioComponent._securityService.guardarBotonesLocalStore(this.url_main_module_page, botones);
        },
        e => console.log(e),
        () => { });

    }

  }
  configurarBotones(botones: Boton[]) {

    if (botones && botones.length > 0) {

      this.botonImprimir = botones.find(a => a.nombre === 'imprimir') ? botones.find(a => a.nombre === 'imprimir') : this.botonImprimir;

    }

  }
  print(event): void {
    $("div#print-section-material").printArea({ popTitle: 'Orden de Compra', mode: "iframe", popClose: false });
    /*if (this.item.tipo == "Materiales" || this.item.tipo == "M") {
      $("div#print-section-material").printArea({ popTitle: 'Orden de Compra', mode: "iframe", popClose: false });
    }
    else
      $("div#print-section-servicio").printArea({ popTitle: 'Orden de Servicio', mode: "iframe", popClose: false });*/
  }

  ngOnInit() {
    this.baseurl = $("#baseurl").attr("href");
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    if (this.id == "0") {
      this.toggleButton = true;

    } else {
      this.toggleButton = true;
    }

    this.item = new OrdenCompra();


    oOrdenCompraCompradorFormularioComponent = this;

    this.util.listPrioridades(function (data: ComboItem[]) {
      oOrdenCompraCompradorFormularioComponent.listPrioridadCombo = data;
    });

    this.util.listMonedas(function (data: ComboItem[]) {
      oOrdenCompraCompradorFormularioComponent.listMonedaCombo = data;
    });

    this.util.listUnidadMedida(function (data: ComboItem[]) {
      oOrdenCompraCompradorFormularioComponent.listUnidadCombo = data;
    });

    this.util.listEstadoOC(function (data: ComboItem[]) {
      oOrdenCompraCompradorFormularioComponent.listEstadoCombo = data;
    });
  }


  ngAfterViewInit() {
    DatatableFunctions.ModalSettings();
    this.baseurl = $("#baseurl").attr("href");

    this._dataService
      .obtener(this.id, 'P')
      .subscribe(
      p => {

        this.item = p;
        this.producto = p.productos.length > 0 ? p.productos[0] : new Producto();
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

          oOrdenCompraCompradorFormularioComponent.item.estado_nombre = $("#estadocomprador option:selected").text();
          oOrdenCompraCompradorFormularioComponent.DatatableConfig();
        }, 100);




      },
      e => console.log(e),
      () => { });

    this.obtenerBotones();
  }
  ngAfterViewChecked()
  {
    
    this.cdRef.detectChanges();
  }


  DatatableConfig() {
    dtArticulos = $('#dtArticulos').DataTable({

      "order": [[0, "asc"]],
      "ajax": function (data, callback, settings) {
        let result = {
          data: oOrdenCompraCompradorFormularioComponent.item.productos

        };
        callback(
          result
        );
      },
      "createdRow": function (row, data, index) {


        if (data.es_subitem == false && data.tienesubitem) {
          $(row).addClass('highlight');
          $(row).attr('identificador', data.id);
        }
        else {
          $(row).attr('parentid', data.parentid);
          $('td', row).eq(0).addClass('text-center');
        }

      },
      columns: [
        { data: 'id' },
        { data: 'posicion' },
        { data: 'nombre', "className": "text-left" },
        { data: 'cantidad' },
        { data: 'unidad' },
        { data: 'preciounitario' },
        { data: 'total' },
        { data: 'igv' },
        { data: 'fechaentrega' }
      ],
      columnDefs: [
        { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5, 6, 7] },
        {
          "targets": [0],
          "visible": false
        },
        {
          render: function (data, type, row) {

            if (row.es_subitem || (row.tienesubitem == false && row.es_subitem == false))
              return '<a href="javascript:void(0);" row-id="' + row.id + '" class="atributos" title="Ver Atributos">' + row.posicion + '</a>';

            else
              return row.posicion;

          },
          targets: 1
        },

        {
          render: function (data, type, row) {
            var nombre = row.nombre;

            if (row.centro)
              nombre = nombre + '<br/><b>Centro:</b>' + row.centro;
            if (row.solicitudpedido)
              nombre = nombre + '<br/><b>Solicitud de pedido:</b>' + row.solicitudpedido;
            return '<div class="text_large">' + nombre + '</div>';

          },
          targets: 2
        },
      ]
    });


    dtArticulos.on('click', '.atributos', function (event) {
      var $tr = $(this).closest('tr');
      let id = $tr.find("a").attr('row-id');

      let producto = oOrdenCompraCompradorFormularioComponent.item.productos.find(a => a.id == id);

      oOrdenCompraCompradorFormularioComponent.producto = producto;

      var atributos = JSON.parse(JSON.stringify(producto.atributos));//clone

      oOrdenCompraCompradorFormularioComponent.atributos = atributos;


      setTimeout(function () {
        dtAtributos.ajax.reload();
        $("#mdlAtributosLista").modal('show');

      }, 500);
      event.preventDefault();
    });

    dtArticulos.on('click', '.highlight', function (event) {


      if ($(this).find('.parent') && $(this).find('.parent').length == 0) {

        var $tr = $(this).closest('tr');
        let id = $tr.attr('identificador');
        let tr_children = $("tr[parentid=" + id + "]");


        if (tr_children.is(":visible")) {
          tr_children.hide();
          $.each(tr_children, function (key, value) {
            let child_children = $(value).next();
            $(child_children).find('.child').hide();
          });
        }
        else {
          tr_children.show();

          $.each(tr_children, function (key, value) {
            let child_children = $(value).next();
            $(child_children).find('.child').show();
          });
        }


      }
      event.preventDefault();
    });

    dtAtributos = $('#dtAtributos').DataTable({

      ajax: function (data, callback, settings) {

        let result = {
          data: oOrdenCompraCompradorFormularioComponent.atributos

        };
        callback(
          result
        );
      },
      columns: [


        { data: 'nombre' },
        { data: 'operador' },
        { data: 'valor' },
        { data: 'unidad' },


      ],
      columnDefs: [
        { "className": "text-center", "targets": [0, 1, 2, 3] },
      ]

    });

  }

}
