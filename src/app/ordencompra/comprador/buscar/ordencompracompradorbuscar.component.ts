import {AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';


import {OrdenCompraFiltros} from '../../../model/ordencompra';

import {AppUtils} from "../../../utils/app.utils";
import {MasterService} from '../../../service/masterservice';
import {LoginService} from '../../../service/login.service';

import {ComboItem} from "app/model/comboitem";
import {Location} from '@angular/common';
import {URL_BUSCAR_OC} from 'app/utils/app.constants';
import {Boton} from 'app/model/menu';

declare var DatatableFunctions, swal: any;
declare var DataHardCode: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];

}
declare var $, moment: any;
var oOrdenCompraCompradorBuscarComponent: OrdenCompraCompradorBuscarComponent;
var datatable;
@Component({
  moduleId: module.id,
  selector: 'ordencompracompradorbuscar-cmp',
  templateUrl: 'ordencompracompradorbuscar.component.html',
  providers: [MasterService, LoginService]
})

export class OrdenCompraCompradorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  location: Location;
  public botonBuscar: Boton = new Boton();
  public botonDetalle: Boton = new Boton();

  public filtro: OrdenCompraFiltros;
  public url_main_module_page = '/ordencompra/comprador/buscar';
  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }
  constructor(location: Location, private router: Router, private route: ActivatedRoute, private _masterService: MasterService, private _securityService: LoginService, private cdRef:ChangeDetectorRef) {
    this.location = location;
    this.util = new AppUtils(this.router, this._masterService);
    this.botonBuscar = new Boton();
    this.botonDetalle = new Boton();

  }

  obtenerBotones() {

    let botones = this._securityService.ObtenerBotonesCache(this.url_main_module_page) as Boton[];
    if (botones) {

      this.configurarBotones(botones);
    }
    else {

      this._securityService.obtenerBotones(this.url_main_module_page).subscribe(
        botones => {

          oOrdenCompraCompradorBuscarComponent.configurarBotones(botones);
          oOrdenCompraCompradorBuscarComponent._securityService.guardarBotonesLocalStore(this.url_main_module_page, botones);
        },
        e => console.log(e),
        () => { });

    }

  }
  configurarBotones(botones: Boton[]) {

    if (botones && botones.length > 0) {
      this.botonBuscar = botones.find(a => a.nombre === 'buscar') ? botones.find(a => a.nombre === 'buscar') : this.botonBuscar;
      this.botonDetalle = botones.find(a => a.nombre === 'detalle') ? botones.find(a => a.nombre === 'detalle') : this.botonDetalle;

    }

  }
  validarfiltros() {
    if (this.filtro.material == false && this.filtro.servicio == false) {

      swal({
        text: "Tipo Orden de Compra es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });

      return false;
    }
    if (this.filtro.fechacreacioninicio == null || this.filtro.fechacreacioninicio.toString() == "") {
      swal({
        text: "Fecha de Registro inicio es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }
    if (this.filtro.fechacreacionfin == null || this.filtro.fechacreacionfin.toString() == "") {
      swal({
        text: "Fecha de Registro fin es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;

    }

    if (this.filtro.fechacreacioninicio != null && this.filtro.fechacreacioninicio.toString() != "" && this.filtro.fechacreacionfin != null && this.filtro.fechacreacionfin.toString() != "") {
      let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oOrdenCompraCompradorBuscarComponent.filtro.fechacreacioninicio);
      let fechacreacionfin = DatatableFunctions.ConvertStringToDatetime(oOrdenCompraCompradorBuscarComponent.filtro.fechacreacionfin);



      if (moment(fechacreacionfin).diff(fechacreacioninicio, 'days') > 30) {

        swal({
          text: 'El filtro de búsqueda "Fecha de Registro" debe tener un rango máximo de 30 días entre la Fecha Inicial y la Fecha Fin.',
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });

        return false;
      }

      let fechacreacioninicio_str = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
      let fechacreacionfin_str = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);

      if (fechacreacioninicio_str > fechacreacionfin_str) {
        swal({
          text: "El rango de Fechas de registro seleccionado no es correcto. La Fecha Inicial es mayor a la Fecha Fin.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });

        return false;
      }
    }

    return true;
  }
  clicked(event) {
    if (this.validarfiltros())
      datatable.ajax.reload();

    event.preventDefault();
  }
  limpiar(event) {

    this.filtroDefecto();
    setTimeout(function () {
      $("input").each(function () {
        if (!$(this).val() && $(this).val() == '')
          $(this.parentElement).addClass("is-empty");
      });


    }, 200);


    event.preventDefault();
  }

  filtroDefecto() {
    let fechacreacioni = new Date();
    fechacreacioni.setDate(fechacreacioni.getDate() - 30);
    this.filtro = {

      nroordencompra: '',

      estado: 'NONE',


      fechacreacioninicio: fechacreacioni,
      fechacreacionfin: new Date(),
      material: true,
      servicio: true,

    }
  }





  ngOnInit() {



    oOrdenCompraCompradorBuscarComponent = this;

    this.util.listEstadoOC(function (data: ComboItem[]) {
      oOrdenCompraCompradorBuscarComponent.listEstadoCombo = data;
    });

    this.filtroDefecto();



  }

  ngAfterViewInit() {


    cargarDataTable();
    DatatableFunctions.registerCheckAll();
    this.obtenerBotones();
  }
  ngAfterViewChecked()
  {

    this.cdRef.detectChanges();
  }

}
function filtrarResultados(item) {
  //
  let nroordencompra = item.nroordencompra as string;
  nroordencompra = nroordencompra + "";
  let nroordencomprafiltro = oOrdenCompraCompradorBuscarComponent.filtro.nroordencompra as string;
  if (nroordencomprafiltro) {
    nroordencomprafiltro = nroordencomprafiltro + "";
    return nroordencompra.indexOf(nroordencomprafiltro) >= 0;
  }
  else return true;
}

function cargarDataTable() {

  datatable = $('#dtResultados').on('draw.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, datatable);
  }).DataTable({
    order: [[8, "desc"]],

    searching: false,
    serverSide: true,
    ajax: {
      //url: "http://localhost:3500/occomprador",
      beforeSend: function (request) {
        if (!oOrdenCompraCompradorBuscarComponent.util.tokenValid()) {
          return;
        };
        request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        request.setRequestHeader("origen_datos", 'PEB2M');
        request.setRequestHeader("tipo_empresa", 'C');
        request.setRequestHeader("org_id", localStorage.getItem('org_id'));
        request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_OC,
      dataSrc: "data",
      data: function (d) {

        if (oOrdenCompraCompradorBuscarComponent.filtro.nroordencompra != "") {
          d.NumeroOrden = oOrdenCompraCompradorBuscarComponent.filtro.nroordencompra.trim();
        }

        if (oOrdenCompraCompradorBuscarComponent.filtro.estado != "NONE") {
          d.EstadoOrden = oOrdenCompraCompradorBuscarComponent.filtro.estado;
        }

        if (oOrdenCompraCompradorBuscarComponent.filtro.fechacreacioninicio) {

          let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oOrdenCompraCompradorBuscarComponent.filtro.fechacreacioninicio);
          d.FechaRegistroInicio = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
        }

        if (oOrdenCompraCompradorBuscarComponent.filtro.fechacreacionfin) {

          let fechacreacionfin = DatatableFunctions.AddDayEndDatetime(DatatableFunctions.ConvertStringToDatetime(oOrdenCompraCompradorBuscarComponent.filtro.fechacreacionfin));
          d.FechaRegistroFin = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);
        }

        let tipos_oc = [];
        if (oOrdenCompraCompradorBuscarComponent.filtro.material)
          tipos_oc.push('M');
        if (oOrdenCompraCompradorBuscarComponent.filtro.servicio)
          tipos_oc.push('S');
        d.TipoOrden = tipos_oc.join(",");

        d.column_names = 'CodigoOrden,NumeroOrden,Fecha,EstadoOrden,TipoOrden,AtencionA,NITComprador,' +
          'UsuarioComprador,RazonSocialComprador,NITVendedor,UsuarioProveedor,NombreVendedor,ValorTotal,MonedaOrden,' +
          'FechaCreacion,NumeroRfq,Version,FechaRegistro';
      }
    },

    columns: [
      /*{ data: 'nroordencompra' },*/
      { data: 'NumeroOrden', name: 'NumeroOrden' },
      { data: 'EstadoOrden', name: 'EstadoOrden' },
      { data: 'TipoOrden', name: 'TipoOrden' },
      { data: 'UsuarioComprador', name: 'UsuarioComprador' },//UsuarioProveedor RazonSocialComprador
      { data: 'NombreVendedor', name: 'NombreVendedor' },//UsuarioVendedor
      { data: 'AtencionA', name: 'AtencionA' }, //atenciona
      { data: 'Version', name: 'Version' },//version
      { data: 'ValorTotal', name: 'ValorTotal' },
      { data: 'FechaRegistro', name: 'FechaRegistro' },
      { data: 'CodigoOrden', name: 'CodigoOrden' }
    ],

    columnDefs: [
      { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
      {
        render: function (data, type, row) {
          //return data +' ('+ row[3]+')';
          return DatatableFunctions.ReplaceToken(row.AtencionA);
        },
        targets: 5
      },
      {
        render: function (data, type, row) {
          //return data +' ('+ row[3]+')';
          return row.MonedaOrden + ' ' + DatatableFunctions.FormatNumber(row.ValorTotal);
        },
        targets: 7
      },
      {
        render: function (data, type, row) {
          let disabled = '';
          let href = 'href="/ordencompra/comprador/formulario/' + row.CodigoOrden + '"';
          if (!oOrdenCompraCompradorBuscarComponent.botonDetalle.habilitado) {
            disabled = 'disabled';
            href = '';
          }
          return '<div class="text-center"><a ' + href + ' nroordencompra="' + row.CodigoOrden + '">' +
            '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver" data-placement="left" ' + disabled + '><i class="material-icons">visibility</i></button></a>' +
            '</button></div>';
        },
        targets: 9,
        orderable: false
      }
    ],


  });


  datatable.on('click', '.edit', function (event) {
    console.log(oOrdenCompraCompradorBuscarComponent.botonDetalle.habilitado);
    if (oOrdenCompraCompradorBuscarComponent.botonDetalle.habilitado) {
      var $tr = $(this).closest('tr');
      var data = datatable.row($tr).data();
      //console.log($tr.find( "a" ).attr('nroordencompra'));
      let nroordencompra = $tr.find("a").attr('nroordencompra');
      let nav = ['/ordencompra/comprador/formulario', nroordencompra];
      oOrdenCompraCompradorBuscarComponent.navigate(nav);
    }
    event.preventDefault();
  });


}



