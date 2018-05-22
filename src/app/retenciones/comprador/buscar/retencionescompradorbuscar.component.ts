import {AfterViewInit, Component, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';


import {RetencionesBuscar, RetencionesFiltros} from '../../../model/retenciones';

import {AppUtils} from "../../../utils/app.utils";
import {MasterService} from '../../../service/masterservice';
import {ComboItem} from "app/model/comboitem";
import {URL_BUSCAR_RETENCIONES} from 'app/utils/app.constants';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];

}
declare var $, swal, DatatableFunctions, moment: any;
var oRetencionesCompradorBuscarComponent: RetencionesCompradorBuscarComponent;
var datatable;
@Component({
  moduleId: module.id,
  selector: 'Retencionescompradorbuscar-cmp',
  templateUrl: 'Retencionescompradorbuscar.component.html',
  providers: [MasterService]
})

export class RetencionesCompradorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  public resultados: RetencionesBuscar[];
  public filtro: RetencionesFiltros;

  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }
  constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService) {
    this.util = new AppUtils(this.router, this._masterService);
  }

  validarfiltros() {

    oRetencionesCompradorBuscarComponent.filtro.nroretenciones = oRetencionesCompradorBuscarComponent.filtro.nroretenciones.trim();

    oRetencionesCompradorBuscarComponent.filtro.nroerp = oRetencionesCompradorBuscarComponent.filtro.nroerp.trim();

    if (this.filtro.nroretenciones == "") {
      if (this.filtro.fechacreacioninicio == null || this.filtro.fechacreacioninicio.toString() == "") {
        swal({
          text: "Fecha de Aceptación inicio es un campo requerido.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
        return false;
      }
      if (this.filtro.fechacreacionfin == null || this.filtro.fechacreacionfin.toString() == "") {
        swal({
          text: "Fecha de Aceptación fin es un campo requerido.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
        return false;

      }

      if (this.filtro.fechacreacioninicio != null && this.filtro.fechacreacioninicio.toString() != "" && this.filtro.fechacreacionfin != null && this.filtro.fechacreacionfin.toString() != "") {
        let fechaemisioninicio = DatatableFunctions.ConvertStringToDatetime(oRetencionesCompradorBuscarComponent.filtro.fechacreacioninicio);
        let fechaemisionfin = DatatableFunctions.ConvertStringToDatetime(oRetencionesCompradorBuscarComponent.filtro.fechacreacionfin);



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
      nroretenciones: '',
      nroordenservicio: '',
      estado: 'NONE',
      fechacreacioninicio: fechacreacioni,
      fechacreacionfin: new Date(),
      nroerp: ''
    }
  }

  ngOnInit() {

    oRetencionesCompradorBuscarComponent = this;

    this.util.listEstadoHAS(function (data: ComboItem[]) {
      oRetencionesCompradorBuscarComponent.listEstadoCombo = data;
    });
    this.filtroDefecto();

  }

  ngAfterViewInit() {


    cargarDataTable();


  }


}
function filtrarResultados(item) {
  //

  if (oRetencionesCompradorBuscarComponent.filtro.nroretenciones) {

    return item.nroRetenciones.indexOf(oRetencionesCompradorBuscarComponent.filtro.nroretenciones) >= 0;
  }
  else return true;
}

function cargarDataTable() {

  datatable = $('#dtResultados').DataTable({
    order: [[1, "asc"]],
    searching: false,

    serverSide: true,
    ajax: {

      beforeSend: function (request) {
        request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('token_oc'));
        request.setRequestHeader("origen_datos", 'PEB2M');
        request.setRequestHeader("tipo_empresa", 'C');
        request.setRequestHeader("org_id", sessionStorage.getItem('org_id'));
        request.setRequestHeader("Ocp-Apim-Subscription-Key", sessionStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_RETENCIONES,
      dataSrc: "data",
      data: function (d) {

        if (oRetencionesCompradorBuscarComponent.filtro.nroretenciones != "") {
          d.NroRetenciones = oRetencionesCompradorBuscarComponent.filtro.nroretenciones;
        }

        if (oRetencionesCompradorBuscarComponent.filtro.estado != "NONE") {
          d.Estado = oRetencionesCompradorBuscarComponent.filtro.estado;

        }

        if (oRetencionesCompradorBuscarComponent.filtro.nroerp != "") {
          d.CodigoHASERP = oRetencionesCompradorBuscarComponent.filtro.nroerp;
        }

        if (oRetencionesCompradorBuscarComponent.filtro.fechacreacioninicio) {

          let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oRetencionesCompradorBuscarComponent.filtro.fechacreacioninicio);
          d.FechaAprobacion_inicio = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
        }

        if (oRetencionesCompradorBuscarComponent.filtro.fechacreacionfin) {

          let fechacreacionfin = DatatableFunctions.ConvertStringToDatetime(oRetencionesCompradorBuscarComponent.filtro.fechacreacionfin);
          d.FechaAprobacion_fin = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);
        }
        d.column_names = 'IdHas,NroRetenciones,CodigoHASERP,Proveedor,Cliente,EstadoDescripcion,FechaAprobacion';
      }
    },

    columns: [

      { data: 'NroRetenciones', name: 'NroRetenciones' },
      { data: 'CodigoHASERP', name: 'CodigoHASERP' },
      { data: 'EstadoDescripcion', name: 'EstadoDescripcion' },
      { data: 'Proveedor', name: 'Proveedor' },
      { data: 'FechaAprobacion', name: 'FechaAprobacion' },
      { data: 'IdHas', name: 'IdHas' },
    ],
    columnDefs: [
      { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5] },
      {
        render: function (data, type, row) {
          return '<div class="text-center"><a href="/Retenciones/comprador/formulario/' + row.IdHas + '" nroRetenciones="' + row.IdHas + '">' +
            '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver/Editar" data-placement="left"><i class="material-icons">visibility</i></button></a></div>';
        },
        targets: 5
      }
    ]
  });


  datatable.on('click', '.edit', function (event) {
    var $tr = $(this).closest('tr');
    var data = datatable.row($tr).data();
    //console.log($tr.find( "a" ).attr('nroRetenciones'));
    //if (data)
    let nroRetenciones = $tr.find("a").attr('nroRetenciones');
    let nav = ['/Retenciones/comprador/formulario', nroRetenciones];

    oRetencionesCompradorBuscarComponent.navigate(nav);
    event.preventDefault();

  });

}
