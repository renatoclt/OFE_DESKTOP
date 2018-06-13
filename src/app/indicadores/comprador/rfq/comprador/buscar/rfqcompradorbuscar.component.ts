import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


import { reporteFiltros, reporteBuscar } from "../../../../../model/indicadoreshas";

import { AppUtils } from "../../../../../utils/app.utils";
import { MasterService } from '../../../../../service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { URL_BUSCAR_RFQS } from 'app/utils/app.constants';
import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../../../../../service/login.service';
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];

}
declare var $, swal, moment: any;
declare var DatatableFunctions: any;
declare var DataHardCode: any;

var oRfqCompradorBuscarComponent;
var datatable;
@Component({
  moduleId: module.id,
  selector: 'rfqcompradorbuscar-cmp',
  templateUrl: 'rfqcompradorbuscar.component.html',
  providers: [MasterService, LoginService]
})

export class RfqCompradorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  public resultados: reporteBuscar[];
  public filtro: reporteFiltros;
  public botonBuscar: Boton = new Boton();
  public botonDetalle: Boton = new Boton();
  public url_main_module_page = '/ordencompra/proveedor/buscar';
  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }
  constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService, private _securityService: LoginService, private cdRef: ChangeDetectorRef) {
    this.util = new AppUtils(this.router, this._masterService);
  }


  obtenerBotones() {

    let botones = this._securityService.ObtenerBotonesCache(this.url_main_module_page) as Boton[];
    if (botones) {

      this.configurarBotones(botones);
    }
    else {

      this._securityService.obtenerBotones(this.url_main_module_page).subscribe(
        botones => {

          oRfqCompradorBuscarComponent.configurarBotones(botones);
          oRfqCompradorBuscarComponent._securityService.guardarBotonesLocalStore(this.url_main_module_page, botones);
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
    // if (this.filtro.ruc == '' || this.filtro.razonsocial == '') {

    //   swal({
    //     text: "Tipo Orden de Compra es un campo requerido.",
    //     type: 'warning',
    //     buttonsStyling: false,
    //     confirmButtonClass: "btn btn-warning"
    //   });

    //   return false;
    // }
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
      let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oRfqCompradorBuscarComponent.filtro.fechacreacioninicio);
      let fechacreacionfin = DatatableFunctions.ConvertStringToDatetime(oRfqCompradorBuscarComponent.filtro.fechacreacionfin);



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
    console.log(fechacreacioni)
    this.filtro = {

      ruc: '',
      razonsocial: '',


      fechacreacioninicio: fechacreacioni,
      fechacreacionfin: new Date()

    }
  }



  ngOnInit() {


    oRfqCompradorBuscarComponent = this;

    this.util.listEstadoOC(function (data: ComboItem[]) {
      oRfqCompradorBuscarComponent.listEstadoCombo = data;
    });
    this.filtroDefecto();
    console.log(this.filtro)

  }

  ngAfterViewInit() {


    cargarDataTable();
    DatatableFunctions.registerCheckAll();

    //this.obtenerBotones();
  }
  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }



}

function filtrarResultados(item) {
  //
  let nroordencompra = item.nroordencompra as string;
  nroordencompra = nroordencompra + "";
  let nroordencomprafiltro = oRfqCompradorBuscarComponent.filtro.nroordencompra as string;
  if (nroordencomprafiltro) {
    nroordencomprafiltro = nroordencomprafiltro + "";
    return nroordencompra.indexOf(nroordencomprafiltro) >= 0;
  }
  else return true;
}

function cargarDataTable() {

  datatable = $('#dtResultados').on('init.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, datatable);
  }).DataTable({
    order: [[4, "desc"]],
    searching: false,
    serverSide: true,

    ajax: {

      beforeSend: function (request) {
        if (!oRfqCompradorBuscarComponent.util.tokenValid()) {
          return;
        };
        request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        request.setRequestHeader("origen_datos", 'PEESEACE');
        request.setRequestHeader("tipo_empresa", 'P');
        request.setRequestHeader("org_id", localStorage.getItem('org_id'));
        request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_RFQS,
      dataSrc: "data",
      data: function (d) {
        console.log(d)

        if (oRfqCompradorBuscarComponent.filtro.ruc != "") {
          d.ruc = oRfqCompradorBuscarComponent.filtro.ruc.trim();
        }

        if (oRfqCompradorBuscarComponent.filtro.razonsocial != "") {
          d.razonsocial = oRfqCompradorBuscarComponent.filtro.razonsocial.trim();

        }



        if (oRfqCompradorBuscarComponent.filtro.fechacreacioninicio) {

          let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oRfqCompradorBuscarComponent.filtro.fechacreacioninicio);
          d.FechaRegistroInicio = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
        }

        if (oRfqCompradorBuscarComponent.filtro.fechacreacionfin) {

          let fechacreacionfin = DatatableFunctions.AddDayEndDatetime(DatatableFunctions.ConvertStringToDatetime(oRfqCompradorBuscarComponent.filtro.fechacreacionfin));
          d.FechaRegistroFin = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);
        }

        let tipos_oc = [];

        if (oRfqCompradorBuscarComponent.filtro.material)
          tipos_oc.push('M');
        if (oRfqCompradorBuscarComponent.filtro.servicio)
          tipos_oc.push('S');
        d.origen_datos = 'PEESEACE';

        //d.TipoOrden = tipos_oc.join(",");

        d.column_names = 'Proveedor,Comprador,NombreComprador,NombreProveedor,NITComprador,NITVendedor,Emitidas,Cotizadas,Respuestas';
        // d.column_names = 'CodigoOrden,NumeroOrden,Fecha,EstadoOrden,TipoOrden,AtencionA,NITComprador,' +
        //   'UsuarioComprador,NombreComprador,NITVendedor,UsuarioProveedor,NombreVendedor,ValorTotal,MonedaOrden,' +
        //   'FechaCreacion,NumeroRfq,Version,FechaRegistro';
      }
    },

    columns: [

      { data: 'NITComprador', name: 'Proveedor' },
      { data: 'NombreComprador', name: 'NombreProveedor' },
      { data: 'Emitidas', name: 'Emitidas' },
      { data: 'Cotizadas', name: 'Facturadas' },
      { data: 'Respuestas', name: 'FacturadasPorcentaje' }

      // { data: 'NumeroOrden', name: 'NumeroOrden' },
      // { data: 'EstadoOrden', name: 'EstadoOrden' },
      // { data: 'TipoOrden', name: 'TipoOrden' },
      // { data: 'UsuarioComprador', name: 'UsuarioComprador' },//vc_nombre_usrcomprador
      // { data: 'NombreComprador', name: 'NombreComprador' }, //RazonSocialComprador
      // { data: 'AtencionA', name: 'AtencionA' },
      // { data: 'Version', name: 'Version' },
      // { data: 'ValorTotal', name: 'ValorTotal' },
      // { data: 'FechaRegistro', name: 'FechaRegistro' },
      // { data: 'CodigoOrden', name: 'CodigoOrden' }
    ],
    columnDefs: [
      { "className": "text-center", "targets": [0, 1, 2, 3, 4] },
      // {

      //   render: function (data, type, row) {
      //     console.log(data,row,type)
      //     //return data +' ('+ row[3]+')';
      //     return DatatableFunctions.ReplaceToken(row.AtencionA);
      //   },
      //   targets: 0
      // }
    ]
  });


  datatable.on('click', '.edit', function (event) {
    if (oRfqCompradorBuscarComponent.botonDetalle.habilitado) {
      var $tr = $(this).closest('tr');

      var data = datatable.row($tr).data();
      //console.log("click edit", event);
      let nroordencompra = $tr.find("a").attr('nroordencompra');

      //console.log("click edit", oRfqCompradorBuscarComponent);
      let nav = ['/ordencompra/proveedor/formulario', nroordencompra];

      oRfqCompradorBuscarComponent.navigate(nav);
    }
    event.preventDefault();

  });



}



