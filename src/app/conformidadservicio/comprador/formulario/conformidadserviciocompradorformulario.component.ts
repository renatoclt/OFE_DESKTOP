import {ActivatedRoute, Params, Router} from '@angular/router';
import {AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';

import {MomentModule} from 'angular2-moment/moment.module';
import {AppUtils} from "../../../utils/app.utils";
import {MasterService} from '../../../service/masterservice';
import {ComboItem} from "app/model/comboitem";
import {ConformidadServicio} from "app/model/conformidadservicio";
import '../../../../assets/js/plugins/jquery.PrintArea.js';

import {ConformidadServicioService} from "app/service/conformidadservicioservice";
import {LoginService} from '../../../service/login.service';
import {Boton} from 'app/model/menu';

declare var moment: any;
declare var swal: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $, DatatableFunctions: any;
var oConformidadServicioCompradorFormularioComponent: ConformidadServicioCompradorFormularioComponent, dtArticulos;
@Component({
  moduleId: module.id,
  selector: 'conformidadserviciocompradorformulario-cmp',
  templateUrl: 'conformidadserviciocompradorformulario.component.html',
  providers: [ConformidadServicioService, MasterService, LoginService]
})

export class ConformidadServicioCompradorFormularioComponent implements OnInit, AfterViewInit {

  public toggleButton: boolean = true;
  public id: string = '0';

  util: AppUtils;
  public listPrioridadCombo: ComboItem[];
  public listMonedaCombo: ComboItem[];
  public listUnidadMedidaCombo: ComboItem[];
  public listEstadoCombo: ComboItem[];
  public botonImprimir: Boton = new Boton();
  public item: ConformidadServicio;
  public url_main_module_page = '/conformidadservicio/comprador/buscar';
  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private _masterService: MasterService, private _dataService: ConformidadServicioService, private _securityService: LoginService, private cdRef: ChangeDetectorRef) {
    this.util = new AppUtils(this.router, this._masterService);
    this.item = new ConformidadServicio();
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
          oConformidadServicioCompradorFormularioComponent.configurarBotones(botones);
          oConformidadServicioCompradorFormularioComponent._securityService.guardarBotonesLocalStore(this.url_main_module_page, botones);
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

    oConformidadServicioCompradorFormularioComponent.item.moneda_txt = $("#moneda option:selected").text();
    oConformidadServicioCompradorFormularioComponent.item.estado = $("#estadoComprador option:selected").text();
    setTimeout(function () {
      $("div#print-section-has").printArea({ popTitle: 'HAS', mode: "iframe", popClose: false });
    }, 200);

  }
  ngOnInit() {

    oConformidadServicioCompradorFormularioComponent = this;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    if (this.id != '0') {
      this.toggleButton = true;

    } else {
      this.toggleButton = false;
    }
    this.util.listMonedas(function (data: ComboItem[]) {

      oConformidadServicioCompradorFormularioComponent.listMonedaCombo = data;
    });

    this.util.listEstadoHAS(function (data: ComboItem[]) {

      oConformidadServicioCompradorFormularioComponent.listEstadoCombo = data;
    });

  }


  ngAfterViewInit() {

    this._dataService
      .obtener(this.id)
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

        var total = 0;
        data.forEach(element => {
          if (element.es_subitem == false) {
            total = total + parseFloat(element.valorrecibido.replace(',', ''));
          }
        });
        var api = this.api(), data;

        oConformidadServicioCompradorFormularioComponent.item.total = DatatableFunctions.FormatNumber(total);
        $(api.column(7).footer()).html(
          oConformidadServicioCompradorFormularioComponent.item.total
        );
      },
      "order": [[1, "asc"]],
      "ajax": function (data, callback, settings) {
        let result = {
          data: oConformidadServicioCompradorFormularioComponent.item.productos

        };
        callback(
          result
        );
      },
      /* "createdRow": function (row, data, index) {

         if (data.es_subitem == false) {
           $(row).addClass('highlight');
           //$('td', row).eq(1).addClass('parent');
         }
         else {
           //$(row).addClass('child');
           $('td', row).eq(0).addClass('text-center');
         }

       },*/

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
        { data: 'estado' },
        { data: 'cantidad' },
        { data: 'unidad' },
        { data: 'valorrecibido' }
      ],
      columnDefs: [
        { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5, 6] },

        {
          render: function (data, type, row) {
            return row.nroitem;
          },
          targets: 0
        },
        /* {
           render: function (data, type, row) {
             return row.valorrecibido;
           },
           targets: 6
         }*/
      ]
    });





    this.obtenerBotones();
  }
  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }


}
