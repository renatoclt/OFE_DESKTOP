import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DetraccionBuscar, DetraccionFiltros } from '../../../model/sm-detracciones';

import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import { ComboItem } from "app/model/comboitem";
import {URL_BUSCAR_DETRACCION} from 'app/utils/app.constants';
import { LoginService } from '../../../service/login.service';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];

}
declare var $, DatatableFunctions, swal, moment: any;
var oDetraccionCompradorBuscarComponent: DetraccionCompradorBuscarComponent;
var datatable;
@Component({
  moduleId: module.id,
  selector: 'DetraccionCompradorbuscar-cmp',
  templateUrl: './detraccioncompradorbuscar.component.html',
  providers: [MasterService]
})

export class DetraccionCompradorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  public resultados: DetraccionBuscar[];
  public filtro: DetraccionFiltros;
  public url_main_module_page = '/sm-detraccion/comprador/buscar';

  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }
  constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService) {
    this.util = new AppUtils(this.router, this._masterService);
  }

  validarfiltros() {
    
        //oDetraccionCompradorBuscarComponent.filtro.nrodetracciondesde = oDetraccionCompradorBuscarComponent.filtro.nrodetracciondesde.trim();
        
        //oDetraccionCompradorBuscarComponent.filtro.nrodetraccionhasta = oDetraccionCompradorBuscarComponent.filtro.nrodetraccionhasta.trim();
    
        if (this.filtro.nrodetracciondesde == "") {
          if (this.filtro.fechapagoinicio == null || this.filtro.fechapagoinicio.toString() == "") {
            swal({
              text: "Fecha de Aceptación inicio es un campo requerido.",
              type: 'warning',
              buttonsStyling: false,
              confirmButtonClass: "btn btn-warning"
            });
            return false;
          }
          if (this.filtro.fechapagofin == null || this.filtro.fechapagofin.toString() == "") {
            swal({
              text: "Fecha de Aceptación fin es un campo requerido.",
              type: 'warning',
              buttonsStyling: false,
              confirmButtonClass: "btn btn-warning"
            });
            return false;
    
          }
    
          if (this.filtro.fechapagoinicio != null && this.filtro.fechapagoinicio.toString() != "" && this.filtro.fechapagofin != null && this.filtro.fechapagofin.toString() != "") {
            let fechaemisioninicio = DatatableFunctions.ConvertStringToDatetime(oDetraccionCompradorBuscarComponent.filtro.fechapagoinicio);
            let fechaemisionfin = DatatableFunctions.ConvertStringToDatetime(oDetraccionCompradorBuscarComponent.filtro.fechapagoinicio);
    
    
    
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

      nrodetracciondesde:'',
      nrodetraccionhasta:'',
      ruccompradora:'',
      nrofactura:'',
      estado:'',
      fechapagoinicio:fechacreacioni,
      fechapagofin:new Date(),
    }
  }

  ngOnInit() {

    oDetraccionCompradorBuscarComponent = this;
    //PARA COLOCAR EL TIPO DE ESTADO TEGP QUE BUSCAR
    this.util.listEstadoDetraccion(function (data: ComboItem[]) {
      oDetraccionCompradorBuscarComponent.listEstadoCombo = data;
    });
    this.filtroDefecto();

  
  }

  ngAfterViewInit() {


    cargarDataTable();

  }


}

function filtrarResultados(item) {
  //

  /*if (oDetraccionCompradorBuscarComponent.filtro.nrodetracciondesde) {

    return item.nroretenciones.indexOf(oDetraccionCompradorBuscarComponent.filtro.NumDetraccionesDesde) >= 0;
  }
  else return true;*/
}

function cargarDataTable() {
  console.log("holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  datatable = $('#dtResultados').DataTable({
    order: [[1, "asc"]],
    searching: false,
    serverSide: true,
    
    ajax: {

      beforeSend: function (request) {
        request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        request.setRequestHeader("origen_datos", 'PEB2M');
        request.setRequestHeader("tipo_empresa", 'C');
        request.setRequestHeader("org_id", localStorage.getItem('org_id'));
        request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_DETRACCION,
      dataSrc: "data",
      data: function (d) {


        //alert(oDetraccionCompradorBuscarComponent.filtro.fechapagoinicio);
        if (oDetraccionCompradorBuscarComponent.filtro.nrodetracciondesde != "") {
          d.NumDetraccionesDesde = oDetraccionCompradorBuscarComponent.filtro.nrodetracciondesde;
        }

        if (oDetraccionCompradorBuscarComponent.filtro.ruccompradora != "") {
          d.Ruc = oDetraccionCompradorBuscarComponent.filtro.ruccompradora;
        }
        if (oDetraccionCompradorBuscarComponent.filtro.nrofactura != "") {
          d.NumeroFactura = oDetraccionCompradorBuscarComponent.filtro.nrofactura;
        }

        if (oDetraccionCompradorBuscarComponent.filtro.estado != "NONE") {
          d.Estado = oDetraccionCompradorBuscarComponent.filtro.estado;
        }

        if (oDetraccionCompradorBuscarComponent.filtro.nrodetraccionhasta != "") {
          d.NumDetraccionesHasta = oDetraccionCompradorBuscarComponent.filtro.nrodetraccionhasta;
        }

        if (oDetraccionCompradorBuscarComponent.filtro.fechapagoinicio) {
          let fechapagoinicio = DatatableFunctions.ConvertStringToDatetime(oDetraccionCompradorBuscarComponent.filtro.fechapagoinicio);
          d.FechaPagoInicio = DatatableFunctions.FormatDatetimeForMicroService(fechapagoinicio);
        }

        if (oDetraccionCompradorBuscarComponent.filtro.fechapagofin) {
          let fechapagofin = DatatableFunctions.ConvertStringToDatetime(oDetraccionCompradorBuscarComponent.filtro.fechapagofin);
          d.FechaPagoFin = DatatableFunctions.FormatDatetimeForMicroService(fechapagofin);
        }

        //d.column_names = 'NumeroConstancia,RazonSocialComprador,RucComprador,FechaHoraPago,Moneda,TotalMontoDetraccion,Estado';
        d.column_names = 'IdDetraccion,NumeroConstancia,RazonSocial,Ruc,FechaHoraPago,Moneda,TotalMontoDetraccion,Estado';
      }
    },
    columns: [
      { data: 'NumeroConstancia',name: 'NumeroConstancia'},
      { data: 'RazonSocial' ,name: 'RazonSocial'}, //DocumentoMaterial
      { data: 'Ruc',name: 'Ruc' },
      { data: 'FechaHoraPago' ,name: 'FechaHoraPago'},
      { data: 'Moneda' ,name: 'Moneda'},
      { data: 'TotalMontoDetraccion' ,name: 'TotalMontoDetraccion'},
      { data: 'Estado' ,name: 'Estado'},
      { data: 'IdDetraccion', name: 'IdDetraccion'},
      
    ],
    columnDefs: [
      { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5, 6, 7] },
      {
        render: function (data, type, row) {
          let disabled = '';
          let href = 'href="/sm-detraccion/comprador/formulario' + row.IdDetraccion + '"';
          /*if (!oDetraccionCompradorBuscarComponent.botonDetalle.habilitado) {
            disabled = 'disabled';
            href = '';
          }*/

          return '<div class="text-center"><a '+ href +' IdDetraccion ="' + row.IdDetraccion + '">' +
            '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver/Editar" data-placement="left"><i class="material-icons">visibility</i></button></a></div>';
        },
        targets: 7
      }
    ]
  });


  datatable.on('click', '.edit', function (event) {
    var $tr = $(this).closest('tr');
    var data = datatable.row($tr).data();
    //console.log($tr.find( "a" ).attr('nroretenciones'));
    //if (data)
    let IdDetraccion = $tr.find("a").attr('IdDetraccion');
    let nav = ['/sm-detraccion/comprador/formulario', IdDetraccion];

    oDetraccionCompradorBuscarComponent.navigate(nav);
    event.preventDefault();

  });

}
