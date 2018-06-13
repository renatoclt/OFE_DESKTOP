import { Component, OnInit, OnChanges, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TransporteServicioBuscar, TransporteServicioFiltros } from 'app/model/transporteservicio';

import { LoginService } from 'app/service/login.service';
import { AppUtils } from 'app/utils/app.utils';
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from 'app/model/comboitem';

import { URL_BUSCAR_TRANSPORTE } from 'app/utils/app.constants';

import { Boton } from 'app/model/menu';
declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

declare var $, swal, DatatableFunctions, moment: any;
var oTransporteServicioCompradorBuscarComponent: TransporteServicioCompradorBuscarComponent;
var datatable;

@Component({
    moduleId: module.id,
    selector: 'transporteserviciocompradorbuscar-cmp',
    templateUrl: 'transporteserviciocompradorbuscar.component.html',
    providers: [MasterService, LoginService]
})

export class TransporteServicioCompradorBuscarComponent implements OnInit, AfterViewInit {
  public dtTransporte: DataTable;
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  public resultados: TransporteServicioBuscar[];
  public filtro: TransporteServicioFiltros;
  public botonBuscar: Boton = new Boton();
  public botonDetalle: Boton = new Boton();
  public url_main_module_page = '/transporte/comprador/buscar';

  public navigate(nav) {
    this.router.navigate(nav, { relativeTo: this.route });
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _masterService: MasterService,
    private _securityService: LoginService,
    private cdRef: ChangeDetectorRef
  ) {
    this.util = new AppUtils(this.router, this._masterService);
  }

  obtenerBotones() {
    let botones = this._securityService.ObtenerBotonesCache(this.url_main_module_page) as Boton[];
    if (botones) {
      this.configurarBotones(botones);
    }else {
      this._securityService.obtenerBotones(this.url_main_module_page).subscribe(
        botones => {
          oTransporteServicioCompradorBuscarComponent.configurarBotones(botones);
          oTransporteServicioCompradorBuscarComponent._securityService.guardarBotonesLocalStore(this.url_main_module_page, botones);
        },
        e => console.log(e),
        () => { }
      );
    }
  }

  configurarBotones(botones: Boton[]) {
    if (botones && botones.length > 0) {
      this.botonBuscar = botones.find(a => a.nombre === 'buscar') ? botones.find(a => a.nombre === 'buscar') : this.botonBuscar;
      this.botonDetalle = botones.find(a => a.nombre === 'detalle') ? botones.find(a => a.nombre === 'detalle') : this.botonDetalle;
    }
  }

  validarfiltros() {
    oTransporteServicioCompradorBuscarComponent.filtro.documentoERP = oTransporteServicioCompradorBuscarComponent.filtro.documentoERP.trim();
    oTransporteServicioCompradorBuscarComponent.filtro.nroguia = oTransporteServicioCompradorBuscarComponent.filtro.nroguia.trim();

    if (this.filtro.documentoERP === '') {
      if (this.filtro.fechacreacioninicio == null || this.filtro.fechacreacioninicio.toString() === '') {
        swal({
          text: 'Fecha de Aceptación inicio es un campo requerido.',
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-warning'
        });
        return false;
      }
      if (this.filtro.fechacreacionfin == null || this.filtro.fechacreacionfin.toString() === '') {
        swal({
          text: 'Fecha de Aceptación fin es un campo requerido.',
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-warning'
        });
        return false;
      }

      if (this.filtro.fechacreacioninicio != null && this.filtro.fechacreacioninicio.toString() !== '' && this.filtro.fechacreacionfin != null && this.filtro.fechacreacionfin.toString() !== '') {
        let fechaemisioninicio = DatatableFunctions.ConvertStringToDatetime(oTransporteServicioCompradorBuscarComponent.filtro.fechacreacioninicio);
        let fechaemisionfin = DatatableFunctions.ConvertStringToDatetime(oTransporteServicioCompradorBuscarComponent.filtro.fechacreacionfin);

        if (moment(fechaemisionfin).diff(fechaemisioninicio, 'days') > 30) {
          swal({
            text: 'El filtro de búsqueda "Fecha de Aceptación" debe tener un rango máximo de 30 días entre la Fecha Inicial y la Fecha Fin.',
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-warning'
          });
          return false;
        }

        let fechaemisioninicio_str = DatatableFunctions.FormatDatetimeForMicroService(fechaemisioninicio);
        let fechaemisionfin_str = DatatableFunctions.FormatDatetimeForMicroService(fechaemisionfin);

        if (fechaemisioninicio_str > fechaemisionfin_str) {
          swal({
            text: 'El rango de Fechas de Aceptación seleccionado no es correcto. La Fecha Inicial es mayor a la Fecha Fin.',
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-warning'
          });
          return false;
        }
      }
    }
    return true;
  }

  clicked(event) {
    // tslint:disable-next-line:curly
    if (this.validarfiltros()) {
      datatable.ajax.reload();
    }

    event.preventDefault();
  }

  limpiar(event) {
    this.filtroDefecto();
    setTimeout(function () {
      $('input').each(function () {
          // tslint:disable-next-line:curly
          if (!$(this).val() && $(this).val() === '') {
            $(this.parentElement).addClass('is-empty');
          }
      });
    }, 200);
    event.preventDefault();
  }

  filtroDefecto() {
    let fechacreacioni = new Date();
    fechacreacioni.setDate(fechacreacioni.getDate() - 30);
    this.filtro = {
      documentoERP: '',
      estado: 'NONE',
      fechacreacioninicio: fechacreacioni,
      fechacreacionfin: new Date(),
      nroguia: ''
    }
  }

  ngOnInit() {
    oTransporteServicioCompradorBuscarComponent = this;

    this.util.listEstadoTTransporte(function (data: ComboItem[]) {
      oTransporteServicioCompradorBuscarComponent.listEstadoCombo = data;
    });
    this.filtroDefecto();
  }

  ngAfterViewInit() {
    cargarDataTable();
    DatatableFunctions.registerCheckAll();
    this.obtenerBotones();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

}

function filtrarResultados(item) {

  if (oTransporteServicioCompradorBuscarComponent.filtro.documentoERP) {
    return item.documentoERP.indexOf(oTransporteServicioCompradorBuscarComponent.filtro.documentoERP) >= 0;
  }
  else return true;
}

function cargarDataTable() {
  datatable = $('#dtResultados').on('draw.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, datatable);
  }).DataTable({
    order: [[1, 'desc']], 
    searching: false,
    serverSide: true,
    ajax: {

      beforeSend: function (request) {
        if (!oTransporteServicioCompradorBuscarComponent.util.tokenValid()) {
          return;
        };
        request.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        request.setRequestHeader('origen_datos', 'PEB2M');
        request.setRequestHeader('tipo_empresa', 'Bearer' + localStorage.getItem('tipo_empresa'));
        request.setRequestHeader('org_id', localStorage.getItem('org_id'));
        request.setRequestHeader('Ocp-Apim-Subscription-Key', localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_TRANSPORTE,
      dataSrc: 'data',
      data: function (d) {

        let omitirOtrosCampos = false;
        if (oTransporteServicioCompradorBuscarComponent.filtro.documentoERP !== '') {
          d.DocumentoERP = oTransporteServicioCompradorBuscarComponent.filtro.documentoERP;
          omitirOtrosCampos = true;
        }

        if (!omitirOtrosCampos) {

          if (oTransporteServicioCompradorBuscarComponent.filtro.estado !== 'NONE') {
            d.Estado = oTransporteServicioCompradorBuscarComponent.filtro.estado;
          }

          if (oTransporteServicioCompradorBuscarComponent.filtro.nroguia !== '') {
            d.NumeroGuia = oTransporteServicioCompradorBuscarComponent.filtro.nroguia;
          }

          if (oTransporteServicioCompradorBuscarComponent.filtro.fechacreacioninicio) {
            let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oTransporteServicioCompradorBuscarComponent.filtro.fechacreacioninicio);
            d.FechaRegistroInicio = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
          }

          if (oTransporteServicioCompradorBuscarComponent.filtro.fechacreacionfin) {
            let fechacreacionfin = DatatableFunctions.ConvertStringToDatetime(oTransporteServicioCompradorBuscarComponent.filtro.fechacreacionfin);
            d.FechaRegistroFin = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);
          }
        }
        d.column_names = 'IdTicket,DocumentoERP,Estado,RazonSocialProveedor,FechaAceptacion,RucProveedor';
      }
    },

    columns: [

      { data: 'DocumentoERP', name: 'DocumentoERP' },
      { data: 'Estado', name: 'Estado' },
      { data: 'RucProveedor', name: 'RucProveedor' },
      { data: 'RazonSocialProveedor', name: 'RazonSocialProveedor' },
      { data: 'FechaAceptacion', name: 'FechaAceptacion' },
      { data: 'IdTicket', name: 'IdTicket'},
    ],
    columnDefs: [
      { 'className': 'text-center', 'targets': [0, 1, 2, 3, 4, 5] },
     {
        render: function (data, type, row) {
          let disabled = '';
          let href = 'href="/transporte/comprador/formulario/' + row.IdTicket + '"';
          if (!oTransporteServicioCompradorBuscarComponent.botonDetalle.habilitado) {
            disabled = 'disabled';
            href = '';
          }
          return '<div class="text-center"><a ' + href + ' nrotransporte="' + row.IdTicket + '">' +
            '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver" data-placement="left" ' + disabled + '><i class="material-icons">visibility</i></button></a></div>';
        },
        targets: 5,
      }

    ]
  });


  datatable.on('click', '.edit', function (event) {
    if (oTransporteServicioCompradorBuscarComponent.botonDetalle.habilitado) {
    var $tr = $(this).closest('tr');
    var data = datatable.row($tr).data();

    let row_id = $tr.find('a').attr('nrotransporte');
    let nav = ['/transporte/comprador/formulario', row_id];

    oTransporteServicioCompradorBuscarComponent.navigate(nav);
    }
    event.preventDefault();

  });

}