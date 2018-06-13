import {ActivatedRoute, Params, Router} from '@angular/router';
import {AfterViewInit, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';

import {MomentModule} from 'angular2-moment/moment.module';
import {AppUtils} from "../../../utils/app.utils";
import {MasterService} from '../../../service/masterservice';
import {ComboItem} from "app/model/comboitem";
import {Detracciones} from "app/model/detracciones";

import '../../../../assets/js/plugins/jquery.PrintArea.js';

import {detraccionesService} from "app/service/detraccionesservice";
import {Producto} from "app/model/ordencompra";

declare var moment: any;
declare var swal: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $, DatatableFunctions: any;
var oDetraccionProveedorFormularioComponent: DetraccionProveedorFormularioComponent, dtArticulos;
@Component({
  moduleId: module.id,
  selector: 'Detraccionproveedorformulario-cmp',
  templateUrl: 'Detraccionproveedorformulario.component.html',
  providers: [detraccionesService, MasterService]
})

export class DetraccionProveedorFormularioComponent implements OnInit, AfterViewInit {

  public toggleButton: boolean = true;
  public id: string = '0';

  util: AppUtils;
  public listPrioridadCombo: ComboItem[];
  public listMonedaCombo: ComboItem[];
  public listUnidadCombo: ComboItem[];
  public listEstadoCombo: ComboItem[];
  public item: Detracciones;
  public producto: Producto;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private _masterService: MasterService, private _dataService: detraccionesService) {
    this.util = new AppUtils(this.router, this._masterService);
    this.item = new Detracciones();
    this.producto = new Producto();
  }
  print(event): void {

    oDetraccionProveedorFormularioComponent.item.moneda_txt = $("#moneda option:selected").text();
    oDetraccionProveedorFormularioComponent.item.estado = $("#estadoProveedor option:selected").text();
    setTimeout(function () {
      $("div#print-section-has").printArea({ popTitle: 'HAS', mode: "iframe", popClose: false });
    }, 200);

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    if (this.id != '0') {
      this.toggleButton = true;

    } else {
      this.toggleButton = false;
    }

    this.util.listMonedas(function (data: ComboItem[]) {

      oDetraccionProveedorFormularioComponent.listMonedaCombo = data;
    });



    this.util.listEstadoHAS(function (data: ComboItem[]) {

      oDetraccionProveedorFormularioComponent.listEstadoCombo = data;
    });




    oDetraccionProveedorFormularioComponent = this;


  }


  ngAfterViewInit() {


    this._dataService
      .obtener(this.id, "P")
      .subscribe(
      p => {

        this.item = p;
        console.log(this.item);
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
        }, 100);




      },
      e => console.log(e),
      () => { });


    dtArticulos = $('#dtArticulos').DataTable({
      footerCallback: function (row, data, start, end, display) {
        console.log(data);
        var total = 0;
        data.forEach(element => {
          if (element.es_subitem == false)
            total = total + parseFloat(element.valorrecibido.replace(',', ''));
        });
        var api = this.api(), data;
        oDetraccionProveedorFormularioComponent.item.total = DatatableFunctions.FormatNumber(total);

        $(api.column(6).footer()).html(
          oDetraccionProveedorFormularioComponent.item.total
        );
      },
      "order": [[1, "asc"]],
      "ajax": function (data, callback, settings) {
        let result = {
          data: oDetraccionProveedorFormularioComponent.item.productos

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
          //$(row).attr('parentid', data.parentid);
          $('td', row).eq(0).addClass('text-center');
        }

      },
      columns: [

        { data: 'id' },
        { data: 'nroordenservicio' },
        { data: 'nroitemordenservicio' },
        { data: 'descripcion' },
        { data: 'cantidad' },
        { data: 'unidad' },
        { data: 'valorrecibido' }
      ],
      columnDefs: [
        { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5, 6] },
        {
          render: function (data, type, row) {
            if (row.es_subitem)
              return '<a href="javascript:void(0);" row-id="' + row.id + '" class="atributos" title="Ver Atributos">' + row.nroitem + '</a>';

            else
              return row.nroitem;

          },
          targets: 0
        },

      ]
    });

    dtArticulos.on('click', '.atributos', function (event) {
      var $tr = $(this).closest('tr');
      let id = $tr.find("a").attr('row-id');

      // let producto = oretencionesProveedorFormularioComponent.item.productos.find(a => a.id == id);

      // oretencionesProveedorFormularioComponent.producto = producto;

      //var atributos = JSON.parse(JSON.stringify(producto.atributos));//clone

      //oretencionesProveedorFormularioComponent.atributos = atributos;


      setTimeout(function () {
        //dtAtributos.ajax.reload();
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






  }


}
