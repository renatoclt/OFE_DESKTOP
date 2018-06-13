import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


import { reporteHasBuscar, reporteHasFiltros } from "../../../../../model/indicadoreshas";
import { OrdenCompraBuscar, OrdenCompraFiltros } from '../../../../../model/ordencompra';

import { AppUtils } from "../../../../../utils/app.utils";
import { MasterService } from '../../../../../service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { URL_BUSCAR_HASREPORTE } from 'app/utils/app.constants';
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

var oHasProveedorBuscarComponent;
var datatable;
@Component({
  moduleId: module.id,
  selector: 'hasproveedorbuscar-cmp',
  templateUrl: './hasproveedorbuscar.component.html',
  providers: [MasterService, LoginService]
})
export class HasProveedorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  public resultados: reporteHasBuscar[];
  public filtro: reporteHasFiltros;
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

          oHasProveedorBuscarComponent.configurarBotones(botones);
          oHasProveedorBuscarComponent._securityService.guardarBotonesLocalStore(this.url_main_module_page, botones);
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
      let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oHasProveedorBuscarComponent.filtro.fechacreacioninicio);
      let fechacreacionfin = DatatableFunctions.ConvertStringToDatetime(oHasProveedorBuscarComponent.filtro.fechacreacionfin);



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


    oHasProveedorBuscarComponent = this;

    this.util.listEstadoOC(function (data: ComboItem[]) {
      oHasProveedorBuscarComponent.listEstadoCombo = data;
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
  let nroordencomprafiltro = oHasProveedorBuscarComponent.filtro.nroordencompra as string;
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
    order: [[3, "desc"]],
    searching: false,
    serverSide: true,

    ajax: {

      beforeSend: function (request) {
        if (!oHasProveedorBuscarComponent.util.tokenValid()) {
          return;
        };
        request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        request.setRequestHeader("origen_datos", 'PEESEACE');
        request.setRequestHeader("tipo_empresa", 'P');
        request.setRequestHeader("org_id", localStorage.getItem('org_id'));
        request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_HASREPORTE,
      dataSrc: "data",
      data: function (d) {
        console.log(d)

        if (oHasProveedorBuscarComponent.filtro.ruc != "") {
          d.ruc = oHasProveedorBuscarComponent.filtro.ruc.trim();
        }

        if (oHasProveedorBuscarComponent.filtro.razonsocial != "") {
          d.razonsocial = oHasProveedorBuscarComponent.filtro.razonsocial.trim();

        }



        if (oHasProveedorBuscarComponent.filtro.fechacreacioninicio) {

          let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oHasProveedorBuscarComponent.filtro.fechacreacioninicio);
          d.FechaRegistroInicio = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
        }

        if (oHasProveedorBuscarComponent.filtro.fechacreacionfin) {

          let fechacreacionfin = DatatableFunctions.AddDayEndDatetime(DatatableFunctions.ConvertStringToDatetime(oHasProveedorBuscarComponent.filtro.fechacreacionfin));
          d.FechaRegistroFin = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);
        }

        let tipos_oc = [];

        if (oHasProveedorBuscarComponent.filtro.material)
          tipos_oc.push('M');
        if (oHasProveedorBuscarComponent.filtro.servicio)
          tipos_oc.push('S');
        d.origen_datos = 'PEESEACE';

        //d.TipoOrden = tipos_oc.join(",");

        d.column_names = 'Proveedor,Comprador,NombreComprador,NombreProveedor,NITComprador,NITVendedor,Emitidas,Facturadas,Uso';
        // d.column_names = 'CodigoOrden,NumeroOrden,Fecha,EstadoOrden,TipoOrden,AtencionA,NITComprador,' +
        //   'UsuarioComprador,NombreComprador,NITVendedor,UsuarioProveedor,NombreVendedor,ValorTotal,MonedaOrden,' +
        //   'FechaCreacion,NumeroRfq,Version,FechaRegistro';
      }
    },

    columns: [

      { data: 'RucCliente', name: 'Proveedor' },
      { data: 'RazonSocialCliente', name: 'NombreProveedor' },
      { data: 'Emitidas', name: 'Emitidas' },
      { data: 'Facturadas', name: 'Facturadas' }

    ],
    columnDefs: [
      { "className": "text-center", "targets": [0, 1, 2, 3] },
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
    if (oHasProveedorBuscarComponent.botonDetalle.habilitado) {
      var $tr = $(this).closest('tr');

      var data = datatable.row($tr).data();
      //console.log("click edit", event);
      let nroordencompra = $tr.find("a").attr('nroordencompra');

      //console.log("click edit", oHasProveedorBuscarComponent);
      let nav = ['/ordencompra/proveedor/formulario', nroordencompra];

      oHasProveedorBuscarComponent.navigate(nav);
    }
    event.preventDefault();

  });



}