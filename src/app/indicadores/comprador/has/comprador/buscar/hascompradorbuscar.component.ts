import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectorRef } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { reporteHasBuscar, reporteHasFiltros } from "../../../../../model/indicadoreshas";

import { AppUtils } from "../../../../../utils/app.utils";
import { MasterService } from '../../../../../service/masterservice';
import { LoginService } from '../../../../../service/login.service';

import { ComboItem } from "app/model/comboitem";
import { Location } from '@angular/common';
import { Usuario } from 'app/model/usuario';
import { URL_BUSCAR_HASREPORTE } from 'app/utils/app.constants';
import { Boton } from 'app/model/menu';
import { MomentModule } from 'angular2-moment/moment.module';

declare var DatatableFunctions, swal: any;
declare var DataHardCode: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $, moment: any;
var oHasCompradorBuscarComponent: HasCompradorBuscarComponent;
var datatable;
@Component({
  moduleId: module.id,
  selector: 'hascompradorbuscar-cmp',
  templateUrl: './hascompradorbuscar.component.html',
  providers: [MasterService, LoginService]
})

export class HasCompradorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  location: Location;
  public filtro: reporteHasFiltros
  public url_main_module_page = '/indicadores/Phas';
  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }
  constructor(
    location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private _masterService: MasterService,
    private _securityService: LoginService,
    private cdRef: ChangeDetectorRef
  ) {
    this.location = location;
    this.util = new AppUtils(this.router, this._masterService);
   }

  validarfiltros() {
    // if (this.filtro.ruc == "" || this.filtro.razonsocial == "") {

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
      let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oHasCompradorBuscarComponent.filtro.fechacreacioninicio);
      let fechacreacionfin = DatatableFunctions.ConvertStringToDatetime(oHasCompradorBuscarComponent.filtro.fechacreacionfin);



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
    oHasCompradorBuscarComponent = this;

    this.util.reporteHas(function (data: ComboItem[]) {
      oHasCompradorBuscarComponent.listEstadoCombo = data;
    });
    this.filtroDefecto();
    console.log(this.filtro)
  }
  ngAfterViewInit() {
    cargarDataTable();
    DatatableFunctions.registerCheckAll();
  }
  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }
  
}
function filtrarResultados(item) {
  //
  let nroordencompra = item.nroordencompra as string;
  nroordencompra = nroordencompra + "";
  let nroordencomprafiltro = oHasCompradorBuscarComponent.filtro.ruc as string;
  if (nroordencomprafiltro) {
    nroordencomprafiltro = nroordencomprafiltro + "";
    return nroordencompra.indexOf(nroordencomprafiltro) >= 0;
  }
  else return true;
}
function cargarDataTable() {
  datatable = $('#dtResultados').on('draw.dt', function(e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, datatable);
  }).DataTable({
    order: [[4, "desc"]],
    searching: false,
    serverSide: true,
    ajax: {
      beforeSend: function (request) {
        if (!oHasCompradorBuscarComponent.util.tokenValid()) {
          return;
        };
        request.setRequestHeader("org_id", localStorage.getItem('org_id'));
        request.setRequestHeader("tipo_empresa", 'C');
        request.setRequestHeader("origen_datos", 'PEESEACE');
        request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        request.setRequestHeader("Content-Type", 'application/json');
        request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_HASREPORTE,
      dataSrc: "data",
      data: function (d) {
        console.log(d)

        if (oHasCompradorBuscarComponent.filtro.ruc != "") {
          d.RucProveedor = oHasCompradorBuscarComponent.filtro.ruc.trim();
        }

        if (oHasCompradorBuscarComponent.filtro.razonsocial != "") {
          d.RazonSocialProveedor = oHasCompradorBuscarComponent.filtro.razonsocial.trim();
        }

        if (oHasCompradorBuscarComponent.filtro.fechacreacioninicio) {

          let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oHasCompradorBuscarComponent.filtro.fechacreacioninicio);
          d.FechaRegistroInicio = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
        }

        if (oHasCompradorBuscarComponent.filtro.fechacreacionfin) {

          let fechacreacionfin = DatatableFunctions.AddDayEndDatetime(DatatableFunctions.ConvertStringToDatetime(oHasCompradorBuscarComponent.filtro.fechacreacionfin));
          d.FechaRegistroFin = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);
        }


        d.column_names = 'Proveedor,Comprador,NombreComprador,NombreProveedor,NITComprador,NITVendedor,Emitidas,Facturadas,FacturadasPorcentaje'
      }
    },

    columns: [
      /*{ data: 'nroordencompra' },*/
      { data: 'RucProveedor', name: 'RucProveedor' },
      { data: 'RazonSocialProveedor', name: 'RazonSocialProveedor' },
      { data: 'Emitidas', name: 'Emitidas' },
      { data: 'Facturadas', name: 'Facturadas' },//UsuarioProveedor RazonSocialComprador
      { data: 'FacturadasPorcentaje', name: 'FacturadasPorcentaje' }
    ],
    
    columnDefs: [
      { "className": "text-center", "targets": [0, 1, 2, 3, 4] },

    ],

  })
}