import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';



import { OrdenCompraBuscar, OrdenCompraFiltros } from '../../../../model/ordencompra';

import { AppUtils } from "../../../../utils/app.utils";
import { MasterService } from '../../../../service/masterservice';
import { ParametroService } from '../../../../service/parametroservice';
import { ComboItem } from "app/model/comboitem";
import { URL_BUSCAR_PARAMETROS, URL_EDITAR_PARAMETROS } from 'app/utils/app.constants';
import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../../../../service/login.service';
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];

}
declare var $, swal, moment: any;
declare var DatatableFunctions: any;
declare var DataHardCode: any;

var oParametrosBuscarComponent;
var datatable;
@Component({
  moduleId: module.id,
  selector: 'parametrosbuscar-cmp',
  templateUrl: 'parametrosbuscar.component.html',
  providers: [MasterService, LoginService, ParametroService]
})

export class ParametrosBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  public resultados: OrdenCompraBuscar[];
  public filtro: OrdenCompraFiltros;
  public botonBuscar: Boton = new Boton();
  public botonDetalle: Boton = new Boton();
  public url_main_module_page = '/ordencompra/proveedor/buscar';
  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }
  constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService, private _securityService: LoginService, private cdRef: ChangeDetectorRef, private ps: ParametroService) {
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

          oParametrosBuscarComponent.configurarBotones(botones);
          oParametrosBuscarComponent._securityService.guardarBotonesLocalStore(this.url_main_module_page, botones);
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
    if (this.filtro.estado == 'NONE') {
      swal({
        text: "Seleccione una opción",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });

      return false;
    }

    return true;
  }
  clicked(event) {
    if (this.validarfiltros()) {
      console.log(this.filtro.estado)
      let str = $('select[id=comboparametros]').val()
      let valor=$('select[id="comboparametros"] option:selected').text();
   
      $('#dtResultados > tbody:last')
      .append(
      `<tr  id="ultima">
        <td class="text-center"  id="${ str }">${ valor }</td>
        <td class="text-center" ><input  class="form-control valor" type="text" /></td>
        <td class="text-center">
            <div class="text-center">
              <button class="guardar btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Guardar"><i class="material-icons">save</i></button>
              <button data-toggle="modal" data-target="#mdlEliminar" class="edit-button btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Cancelar"><i class="material-icons">cancel</i></button>
            </div>
          </td>
      </tr>`);
    }

    $( ".guardar" ).click(function() {
    let  id = $(this).parents("tr").find("td").eq(0).attr('id');
    let str =  $(this).parents("tr").find("td").eq(0).html();
    let valor=$('.valor').val();
    
    let obj =
      {
        "Modulo": "MCPECR1",
        "OrgReglaParamMod":
          [
            {
              "Idreglaxparametro": "",
              "Valor": ""
            }
          ]
      }
    obj.OrgReglaParamMod[0].Idreglaxparametro = id
    obj.OrgReglaParamMod[0].Valor = valor
    alert(id+'-'+str+'-'+valor);
    this.ps.crearParametro(obj).subscribe(data => console.log('ffdgfgsdasdasdadasdasdasdasdasdasdasddfgdgf'))
    //$('#crearParametros').addClass(`not-show`)
    datatable.ajax.reload();
    });
    
    event.preventDefault();
    //datatable.ajax.reload();
    
  }
  
  // crearParametro() {
  //   debugger;
  //   alert('llego al crear');
  //   let str = $(".uuid").parents('tr').attr('id');
  //   let valor =$(".uuid").parents('tr').attr('id');
  //   alert(str+'-'+valor);
  //   let obj =
  //     {
  //       "Modulo": "MCPECR1",
  //       "OrgReglaParamMod":
  //         [
  //           {
  //             "Idreglaxparametro": "",
  //             "Valor": ""
  //           }
  //         ]
  //     }
  //   obj.OrgReglaParamMod[0].Idreglaxparametro = str
  //   obj.OrgReglaParamMod[0].Valor = valor

  //   this.ps.crearParametro(obj).subscribe(data => console.log(data))
  //   //$('#crearParametros').addClass(`not-show`)
  //   datatable.ajax.reload();
  // }

  editarParametro() {
    let str = $("#mdlObservaciones_obs").html()
    let valor = $("#mdlObservaciones_obs_pago").val()
    let obj = 
    {
      "OrgReglaParamMod" :
      [
        {
          "Idorgxreglaxparametroxmod": '',
          "Valor": ""
        }
      ]
    }
    obj.OrgReglaParamMod[0].Idorgxreglaxparametroxmod = str
    obj.OrgReglaParamMod[0].Valor = valor

    console.log(obj)
    
    this.ps.editarParametro(obj).subscribe(data=>console.log(data))
    datatable.ajax.reload();
  }

  borrarParametro() {
    let str = $("#mdlObservaciones_obs").html()
    let valor = $("#mdlObservaciones_obs_pago").val()
    let obj =
      {
        "OrgReglaParamMod":
          [
            {
              "Idorgxreglaxparametroxmod": ''
            }
          ]
      }
    obj.OrgReglaParamMod[0].Idorgxreglaxparametroxmod = str
    this.ps.editarParametro(obj).subscribe(data => console.log(data))
    datatable.ajax.reload();
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

      nroordencompra: '',

      estado: 'NONE',


      fechacreacioninicio: fechacreacioni,
      fechacreacionfin: new Date(),
      material: true,
      servicio: true,

    }
  }



  ngOnInit() {


    oParametrosBuscarComponent = this;

    this.util.listarParametros(function (data: ComboItem[]) {
      oParametrosBuscarComponent.listEstadoCombo = data;
    });
    this.filtroDefecto();
    console.log(this.filtro)

  }

  ngAfterViewInit() {


    cargarDataTable();
    // DatatableFunctions.registerCheckAll();

    // this.obtenerBotones();
  }
  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }



}

function filtrarResultados(item) {
  //
  let nroordencompra = item.nroordencompra as string;
  nroordencompra = nroordencompra + "";
  let nroordencomprafiltro = oParametrosBuscarComponent.filtro.nroordencompra as string;
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
    order: [[1, "desc"]],
    searching: false,
    serverSide: true,

    ajax: {

      beforeSend: function (request) {
        if (!oParametrosBuscarComponent.util.tokenValid()) {
          return;
        };
        request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        request.setRequestHeader("origen_datos", 'PEB2M');
        request.setRequestHeader("tipo_empresa", 'P');
        request.setRequestHeader("org_id", localStorage.getItem('org_id'));
        request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_PARAMETROS,
      dataSrc: "data",
      data: function (d) {
        let tipos_oc = [];

        if (oParametrosBuscarComponent.filtro.material)
          tipos_oc.push('M');
        if (oParametrosBuscarComponent.filtro.servicio)
          tipos_oc.push('S');
        d.origen_datos = 'PEB2M';
        d.column_names = 'Idmodulo,Modulo,Idreglanegocio,NomReglaNegocio,Idorgxreglaxparametroxmodulo,Idreglaxparametro,NombreParametro,ValorParametro';
      }
    },



    columns: [

      { data: 'Parametros', name: 'NombreParametro' },
      { data: 'Parametros', name: 'ValorParametroxOrg' },
      { data: 'Parametros', name: 'ValorParametroxOrg' }
    ],
    columnDefs: [
      { "className": "text-center", "targets": [0, 1, 2] },
      {
        render: function (data, type, row) {
          //return data +' ('+ row[3]+')';
          return row.Parametros[0].NombreParametro
        },
        targets: 0
      },
      {
        render: function (data, type, row) {
          //return data +' ('+ row[3]+')';
          return row.Parametros[0].ValorParametroxOrg
        },
        targets: 1
      },
      {
        render: function (data, type, row) {
          //return data +' ('+ row[3]+')';
          return '<div class="text-center"><button data-toggle="modal" data-target="#mdlObservaciones" class="edit-button btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Editar" ><i class="material-icons">edit</i></button><button data-toggle="modal" data-target="#mdlEliminar" class="edit-button btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Eliminar"><i class="material-icons">delete_forever</i></button></div>';
        },
        targets: 2
      }
    ]
  });
  
  datatable.on('click', '.edit-button', function (event) {
    var $tr = $(this).closest('tr');

    var data = datatable.row($tr).data();

    $("#mdlObservaciones_obs").html(data.Parametros[0].Idorgxreglaxparametroxmodulo);
    $("#mdlObservaciones_obs_pago").val(data.Parametros[0].ValorParametroxOrg);

    event.preventDefault();

  });

}




