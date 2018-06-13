import {AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';


import {ConformidadServicioBuscar, ConformidadServicioFiltros} from '../../../model/conformidadservicio';
import {LoginService} from '../../../service/login.service';
import {AppUtils} from "../../../utils/app.utils";
import {MasterService} from '../../../service/masterservice';
import {ComboItem} from "app/model/comboitem";
import {URL_BUSCAR_HAS} from 'app/utils/app.constants';
import {Boton} from 'app/model/menu';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];

}
declare var $, swal, DatatableFunctions, moment: any;
var oConformidadServicioCompradorBuscarComponent: ConformidadServicioCompradorBuscarComponent;
var datatable;
@Component({
  moduleId: module.id,
  selector: 'conformidadserviciocompradorbuscar-cmp',
  templateUrl: 'conformidadserviciocompradorbuscar.component.html',
  providers: [MasterService, LoginService]
})

export class ConformidadServicioCompradorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  public resultados: ConformidadServicioBuscar[];
  public filtro: ConformidadServicioFiltros;
  public botonBuscar: Boton = new Boton();
  public botonDetalle: Boton = new Boton();
  public url_main_module_page = '/conformidadservicio/comprador/buscar';
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

          oConformidadServicioCompradorBuscarComponent.configurarBotones(botones);
          oConformidadServicioCompradorBuscarComponent._securityService.guardarBotonesLocalStore(this.url_main_module_page, botones);
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
    oConformidadServicioCompradorBuscarComponent.filtro.nroconformidadservicio = oConformidadServicioCompradorBuscarComponent.filtro.nroconformidadservicio.trim();
    oConformidadServicioCompradorBuscarComponent.filtro.nroerp = oConformidadServicioCompradorBuscarComponent.filtro.nroerp.trim();

    if (this.filtro.nroconformidadservicio == "") {
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
        let fechaemisioninicio = DatatableFunctions.ConvertStringToDatetime(oConformidadServicioCompradorBuscarComponent.filtro.fechacreacioninicio);
        let fechaemisionfin = DatatableFunctions.ConvertStringToDatetime(oConformidadServicioCompradorBuscarComponent.filtro.fechacreacionfin);

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
      nroconformidadservicio: '',
      nroordenservicio: '',
      estado: 'NONE',
      fechacreacioninicio: fechacreacioni,
      fechacreacionfin: new Date(),
      nroerp: ''
    }
  }

  ngOnInit() {
    oConformidadServicioCompradorBuscarComponent = this;

    this.util.listEstadoHAS(function (data: ComboItem[]) {
      oConformidadServicioCompradorBuscarComponent.listEstadoCombo = data;
    });
    this.filtroDefecto();
  }

  ngAfterViewInit() {
    cargarDataTable();
    this.obtenerBotones();
  }
  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }

}
function filtrarResultados(item) {
  //
  if (oConformidadServicioCompradorBuscarComponent.filtro.nroconformidadservicio) {
    return item.nroconformidadservicio.indexOf(oConformidadServicioCompradorBuscarComponent.filtro.nroconformidadservicio) >= 0;
  }
  else return true;
}

function cargarDataTable() {

  datatable = $('#dtResultados').DataTable({
    order: [[4, "desc"]],
    searching: false,
    serverSide: true,
    ajax: {

      beforeSend: function (request) {
        if (!oConformidadServicioCompradorBuscarComponent.util.tokenValid()) {
          return;
        };
        request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        request.setRequestHeader("origen_datos", 'PEB2M');
        request.setRequestHeader("tipo_empresa", 'C');
        request.setRequestHeader("org_id", localStorage.getItem('org_id'));
        request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_HAS,
      dataSrc: "data",
      data: function (d) {

        if (oConformidadServicioCompradorBuscarComponent.filtro.nroconformidadservicio != "") {
          d.NroConformidadServicio = oConformidadServicioCompradorBuscarComponent.filtro.nroconformidadservicio;
        }else{

            if (oConformidadServicioCompradorBuscarComponent.filtro.estado != "NONE") {
              d.Estado = oConformidadServicioCompradorBuscarComponent.filtro.estado;
            }

            if (oConformidadServicioCompradorBuscarComponent.filtro.nroerp != "") {
              d.DocumentoMaterial = oConformidadServicioCompradorBuscarComponent.filtro.nroerp;
            }

            if (oConformidadServicioCompradorBuscarComponent.filtro.fechacreacioninicio) {

              let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oConformidadServicioCompradorBuscarComponent.filtro.fechacreacioninicio);
              d.FechaAprobacion_inicio = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
            }

            if (oConformidadServicioCompradorBuscarComponent.filtro.fechacreacionfin) {

              let fechacreacionfin = DatatableFunctions.ConvertStringToDatetime(oConformidadServicioCompradorBuscarComponent.filtro.fechacreacionfin);
              d.FechaAprobacion_fin = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);
            }
        }
        d.column_names = 'IdHas,NroConformidadServicio,DocumentoMaterial,Proveedor,Cliente,EstadoDescripcion,FechaAprobacion';
      }
    },

    columns: [

      { data: 'NroConformidadServicio', name: 'NroConformidadServicio' },
      { data: 'DocumentoMaterial', name: 'DocumentoMaterial' },
      { data: 'EstadoDescripcion', name: 'EstadoDescripcion' },
      { data: 'Proveedor', name: 'Proveedor' },
      { data: 'FechaAprobacion', name: 'FechaAprobacion' },
      { data: 'IdHas', name: 'IdHas' },
    ],
    columnDefs: [
      { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5] },
      {
        render: function (data, type, row) {
          let disabled = '';
          let href = 'href="/conformidadservicio/comprador/formulario/' + row.IdHas + '"';
          if (!oConformidadServicioCompradorBuscarComponent.botonDetalle.habilitado) {
            disabled = 'disabled';
            href = '';
          }
          return '<div class="text-center"><a ' + href + ' nroconformidadservicio="' + row.IdHas + '">' +
            '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver" data-placement="left" ' + disabled + '><i class="material-icons">visibility</i></button></a></div>';
        },
        targets: 5
      }
    ]
  });


  datatable.on('click', '.edit', function (event) {
    if (oConformidadServicioCompradorBuscarComponent.botonDetalle.habilitado) {
    var $tr = $(this).closest('tr');
    var data = datatable.row($tr).data();
    //console.log($tr.find( "a" ).attr('nroconformidadservicio'));
    //if (data)
    let nroconformidadservicio = $tr.find("a").attr('nroconformidadservicio');
    let nav = ['/conformidadservicio/comprador/formulario', nroconformidadservicio];

    oConformidadServicioCompradorBuscarComponent.navigate(nav);
    }
    event.preventDefault();

  });

}
