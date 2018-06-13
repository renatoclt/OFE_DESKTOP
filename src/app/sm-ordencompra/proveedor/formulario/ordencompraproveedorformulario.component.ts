import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';

import { MomentModule } from 'angular2-moment/moment.module';
import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { OrdenCompra, CambioEstado, Atributo, Producto } from "app/model/ordencompra";
import { AppSettings } from "app/base/appSettings";

import '../../../../assets/js/plugins/jquery.PrintArea.js';
import { OrdenCompraService } from "app/service/ordencompraservice";
import { LoginService } from '../../../service/login.service';
import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';

declare var moment: any;
declare var swal: any;
declare var DatatableFunctions: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

declare var $: any;
declare var DataHardCode: any;
var oOrdenCompraProveedorFormularioComponent: OrdenCompraProveedorFormularioComponent, dtArticulos, dtAtributos;

@Component({
    moduleId: module.id,
    selector: 'ordencompraproveedorformulario-cmp',
    templateUrl: 'ordencompraproveedorformulario.component.html',
    providers: [OrdenCompraService, MasterService]
})

export class OrdenCompraProveedorFormularioComponent implements OnInit, AfterViewInit {

  public toggleButton: boolean = true;
  public toggleButtonCP: boolean = true;

  public id: string = "";

  util: AppUtils;
  public listPrioridadCombo: ComboItem[];
  public listMonedaCombo: ComboItem[];
  public listUnidadCombo: ComboItem[];
  public listEstadoCombo: ComboItem[];
  public botonImprimir: Boton = new Boton();
  public botonAceptarOC: Boton = new Boton();
  public botonRechazarOC: Boton = new Boton();
  public item: OrdenCompra;
  public baseurl: string;
  public producto: Producto;
  public atributos: Atributo[];
  public org_id: string;
  public url_main_module_page = '/sm-ordencompra/proveedor/buscar';

  public navigate(nav) {
      this.router.navigate(nav, { relativeTo: this.activatedRoute });
  }

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
      private _masterService: MasterService, private _dataService: OrdenCompraService, private _securityService: LoginService, private cdRef: ChangeDetectorRef) {
      this.util = new AppUtils(this.router, this._masterService);
      this.atributos = [];
      this.producto = new Producto();
      this.org_id = localStorage.getItem('org_id');
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
              oOrdenCompraProveedorFormularioComponent.configurarBotones(botones);
              oOrdenCompraProveedorFormularioComponent._securityService.guardarBotonesLocalStore(this.url_main_module_page, botones);
          },
          e => console.log(e),
          () => { });
      }
  }

  configurarBotones(botones: Boton[]) {
      if (botones && botones.length > 0) {
          this.botonImprimir = botones.find(a => a.nombre === 'imprimir') ? botones.find(a => a.nombre === 'imprimir') : this.botonImprimir;
          this.botonAceptarOC = botones.find(a => a.nombre === 'aceptar') ? botones.find(a => a.nombre === 'aceptar') : this.botonImprimir;
          this.botonRechazarOC = botones.find(a => a.nombre === 'rechazar') ? botones.find(a => a.nombre === 'rechazar') : this.botonImprimir;
      }
  }

  RechazarOC(event) {

    swal({
      html: '¿Está seguro de rechazar la orden de compra? <br>' +
        'En Caso de aceptar el rechazo, por favor ingresar el motivo:<br/><br/>' +
        '<p style="text-align:center;"/>  <textarea  pattern="/^\s+|\s+$/" minlength="5" id="comentarioproveedor_popup" name="comentarioproveedor_popup" style="resize: none;width:95%;  padding: 5px;min-height: 5em; overflow: auto;"' +
        '    row="6"></textarea></p>',
      type: "warning",
      //html: true,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-default",
      cancelButtonClass: "btn btn-warning",
    }).then(
      function () {
        oOrdenCompraProveedorFormularioComponent.item.comentarioproveedor = $('#comentarioproveedor_popup').val();
        if (oOrdenCompraProveedorFormularioComponent.item.comentarioproveedor == '' || /^\s+|\s+$/.test(oOrdenCompraProveedorFormularioComponent.item.comentarioproveedor) || oOrdenCompraProveedorFormularioComponent.item.comentarioproveedor.trim().length <5) {
          swal({
            text: "Por favor indique los motivos de su rechazo.",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          }).then(
            function () {
              oOrdenCompraProveedorFormularioComponent.RechazarOC(null);
            },
            function (dismiss) {
            });
        }
        else {

          setTimeout(function () {
            $("textarea").each(function () {
              $(this).keydown();
              if (!$(this).val() || $(this).val() == '')
                $(this.parentElement).addClass("is-empty");
            });
          }, 100);

          let _cambioEstado: CambioEstado;
          _cambioEstado = new CambioEstado();
          _cambioEstado.iddoc = oOrdenCompraProveedorFormularioComponent.item.id;
          _cambioEstado.numeroseguimiento = oOrdenCompraProveedorFormularioComponent.item.nroordencompra;
          _cambioEstado.estadoactual = oOrdenCompraProveedorFormularioComponent.item.estadoproveedor;
          _cambioEstado.accion = "RECHAZAR";
          _cambioEstado.comentario = oOrdenCompraProveedorFormularioComponent.item.comentarioproveedor;
          oOrdenCompraProveedorFormularioComponent.item.estadoproveedor = "ORECH";
          oOrdenCompraProveedorFormularioComponent._dataService
            .cambioEstado(oOrdenCompraProveedorFormularioComponent.item.id, oOrdenCompraProveedorFormularioComponent.org_id, _cambioEstado)
            .subscribe(
            p => {
              swal({
                text: "Se rechazó la orden de compra.",
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: "btn btn-warning",
                confirmButtonText: "Aceptar",
              }).then(
                function () {
                  let nav = ['/sm-ordencompra/proveedor/buscar'];
                  oOrdenCompraProveedorFormularioComponent.navigate(nav);
                },
                function (dismiss) {
                  let nav = ['/sm-ordencompra/proveedor/buscar'];
                  oOrdenCompraProveedorFormularioComponent.navigate(nav);

                });

            },
            e => console.log(e),
            () => { });
        }
      },
      function (dismiss) {
      })


    if (event)
      event.preventDefault();
  }

  AprobarOC(event) {
    event.preventDefault();
    console.log(oOrdenCompraProveedorFormularioComponent.item);
    swal({
      text: "La aprobación implica la aceptación de todas las condiciones generales de contratación indicadas en la orden de compra. ¿Está seguro de aprobar la orden de compra?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-default",
      cancelButtonClass: "btn btn-warning",
    }).then(function () {
      /*oOrdenCompraProveedorFormularioComponent.item.estadoweb = "Aceptada";
      DataHardCode.update({
        nroordencompra: oOrdenCompraProveedorFormularioComponent.id,
        estado: oOrdenCompraProveedorFormularioComponent.item.estadoweb,
      })*/

      let _cambioEstado: CambioEstado;
      _cambioEstado = new CambioEstado();
      _cambioEstado.iddoc = oOrdenCompraProveedorFormularioComponent.item.id;
      _cambioEstado.numeroseguimiento = oOrdenCompraProveedorFormularioComponent.item.nroordencompra;
      _cambioEstado.estadoactual = oOrdenCompraProveedorFormularioComponent.item.estadoproveedor;
      _cambioEstado.accion = "ACEPTAR";
      oOrdenCompraProveedorFormularioComponent.item.estadoproveedor = "OACEP";
      oOrdenCompraProveedorFormularioComponent._dataService
        .cambioEstado(oOrdenCompraProveedorFormularioComponent.item.id, oOrdenCompraProveedorFormularioComponent.org_id, _cambioEstado)
        .subscribe(
        p => {
          oOrdenCompraProveedorFormularioComponent.item.estadoproveedor = "OACEP";

          //oOrdenCompraProveedorFormularioComponent.navigate(nav);
        }, function (dismiss) {
          // dismiss can be 'cancel', 'overlay',
          // 'close', and 'timer'

        });
    },
      e => console.log(e),
      () => { });






  }
  print(event): void {
    oOrdenCompraProveedorFormularioComponent.item.estado_nombre = $("#estadoproveedor option:selected").text();
    setTimeout(function () {
      $("div#print-section-material").printArea({ popTitle: 'Orden de Compra', mode: "iframe", popClose: false });
    }, 100);

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



    oOrdenCompraProveedorFormularioComponent = this;

    this.util.listPrioridades(function (data: ComboItem[]) {
      oOrdenCompraProveedorFormularioComponent.listPrioridadCombo = data;
    });

    this.util.listMonedas(function (data: ComboItem[]) {
      oOrdenCompraProveedorFormularioComponent.listMonedaCombo = data;
    });

    this.util.listUnidadMedida(function (data: ComboItem[]) {
      oOrdenCompraProveedorFormularioComponent.listUnidadCombo = data;
    });

    this.util.listEstadoOC(function (data: ComboItem[]) {
      oOrdenCompraProveedorFormularioComponent.listEstadoCombo = data;
    });

  }


  ngAfterViewInit() {

    DatatableFunctions.ModalSettings();
    this.baseurl = $("#baseurl").attr("href");

    this._dataService
      .obtener(this.id, 'C')
      .subscribe(
      p => {

        this.item = p;
        this.item.id = this.id;
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
          oOrdenCompraProveedorFormularioComponent.item.estado_nombre = $("#estadoproveedor option:selected").text();
          oOrdenCompraProveedorFormularioComponent.DatatableConfig();
        }, 100);

        if (this.item.estadoproveedor === "ONVIS") {
          swal({
            text: "La visualización de la orden de compra implica su aceptación, salvo que sea rechazada en el plazo máximo de 24 horas desde que fue visualizada. ",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning",
            confirmButtonText: "Aceptar",
          }).then(function () {


            let _cambioEstado: CambioEstado;
            _cambioEstado = new CambioEstado();
            _cambioEstado.iddoc = oOrdenCompraProveedorFormularioComponent.item.id;
            _cambioEstado.numeroseguimiento = oOrdenCompraProveedorFormularioComponent.item.nroordencompra;
            _cambioEstado.estadoactual = oOrdenCompraProveedorFormularioComponent.item.estadoproveedor;
            _cambioEstado.accion = "VISUALIZAR";

            oOrdenCompraProveedorFormularioComponent.item.estadoproveedor = "OVISU";
            /*oOrdenCompraProveedorFormularioComponent._dataService
            .cambioEstado2(oOrdenCompraProveedorFormularioComponent.item.id, oOrdenCompraProveedorFormularioComponent.org_id, _cambioEstado);*/

            oOrdenCompraProveedorFormularioComponent._dataService
              .cambioEstado(oOrdenCompraProveedorFormularioComponent.item.id, oOrdenCompraProveedorFormularioComponent.org_id, _cambioEstado)
              .subscribe(
              p => {
                //console.log('response', p);
                oOrdenCompraProveedorFormularioComponent.item.estadoproveedor = "OVISU";
              }, function (dismiss) {
                // dismiss can be 'cancel', 'overlay',
                // 'close', and 'timer'

              });

          }, function (dismiss) { // dismiss can be 'cancel', 'overlay',
            // 'close', and 'timer'

            let _cambioEstado: CambioEstado;
            _cambioEstado = new CambioEstado();
            _cambioEstado.iddoc = oOrdenCompraProveedorFormularioComponent.item.id;
            _cambioEstado.numeroseguimiento = oOrdenCompraProveedorFormularioComponent.item.nroordencompra;
            _cambioEstado.estadoactual = oOrdenCompraProveedorFormularioComponent.item.estadoproveedor;
            _cambioEstado.accion = "VISUALIZAR";
            oOrdenCompraProveedorFormularioComponent.item.estadoproveedor = "OVISU";
            oOrdenCompraProveedorFormularioComponent._dataService
              .cambioEstado(oOrdenCompraProveedorFormularioComponent.item.id, oOrdenCompraProveedorFormularioComponent.org_id, _cambioEstado)
              .subscribe(
              p => {
                console.log('response', p);
                oOrdenCompraProveedorFormularioComponent.item.estadoproveedor = "OVISU";
              }, function (dismiss) {
                // dismiss can be 'cancel', 'overlay',
                // 'close', and 'timer'

              });

          });


        }


      },
      e => console.log(e),
      () => { });






    this.obtenerBotones();
  }
  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }

  DatatableConfig() {
    dtArticulos = $('#dtArticulos').DataTable({



      "ajax": function (data, callback, settings) {
        let result = {
          data: oOrdenCompraProveedorFormularioComponent.item.productos

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

      let producto = oOrdenCompraProveedorFormularioComponent.item.productos.find(a => a.id == id);

      oOrdenCompraProveedorFormularioComponent.producto = producto;

      var atributos = JSON.parse(JSON.stringify(producto.atributos));//clone

      oOrdenCompraProveedorFormularioComponent.atributos = atributos;


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
          data: oOrdenCompraProveedorFormularioComponent.atributos

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
