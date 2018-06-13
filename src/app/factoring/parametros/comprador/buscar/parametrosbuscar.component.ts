import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';



import { OrdenCompraBuscar, OrdenCompraFiltros } from '../../../../model/ordencompra';

import { AppUtils } from "../../../../utils/app.utils";
import { MasterService } from '../../../../service/masterservice';
import { ParametroService } from 'app/@service/Parametro.service';
import { Parametros } from '../../../../@model/administracion/Parametro';
import { ComboItem } from "app/model/comboitem";
import { CODMODPARAMETRO, URL_BUSCAR_PARAMETROS, URL_EDITAR_PARAMETROS, MOSTRAR_RESULTADOS, MOSTRAR, PAGINA_INICIAL } from 'app/utils/app.constants';
import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../../../../service/login.service';


declare var $, swal, moment: any;

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
  listEstadoCombo: ComboItem[];
  parametros: any = [];
  validarcomboparametros: any = [];
  parametrosregistrados: any = [];
  botonBuscar: Boton = new Boton();
  botonDetalle: Boton = new Boton();
  url_main_module_page = 'confparametros/comprador/buscar';
  ordenarCount: number = 0;
  ordenar: string;
  arraySearchParams: any = [];
  loading = false;
  idEditarParametro: string = '';
  mostrarResultados: any = MOSTRAR_RESULTADOS;
  paginas: any = [];
  mostrar: number = 1;
  //MOSTRAR
  paginaSeleccionada: any = PAGINA_INICIAL;
  draw: number = 0;
  start: number = 0;
  length: number = 100;
  opcionSeleccionado: string = '0';
  idNuevoParametro: string = '';
  parametroaeliminar:any={};
  public navigate(nav) {
    this.router.navigate(nav, { relativeTo: this.route });
  }

  ///declarar service dentro de constructor
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _masterService: MasterService,
    private _securityService: LoginService,
    private cdRef: ChangeDetectorRef,
    private parametroService: ParametroService) {
    this.util = new AppUtils(this.router, this._masterService);
  }

  ngOnInit() {
    this.listarParametrosRegistrados(this.start, this.length);
    this.listarparametro();

    //this.selecionarPagina(this.draw);
  }

  ngAfterViewInit() {
  }

  ngAfterViewChecked(){    
    $("select").each(function () {
      if ($(this).val() != ''){
        $(this.parentElement).removeClass("is-empty");
      }else{
        $(this.parentElement).addClass("is-empty");
      }
    });
  }
  listarparametro() {
    this.parametroService.obtenerListaParametro().subscribe(
      res => {
        this.parametros = res.data;
      }
    );
  }


  validarexistencia(idcombo): boolean {
    let validar: boolean = false;
    this.parametrosregistrados.forEach(parametroregistrado => {
      if (idcombo == parametroregistrado.Idreglaxparametro) {
        validar = true;
      }
    });
    return validar;
  }

  listarParametrosRegistrados(start, length) {
    let arrayParams: any = [];
    arrayParams.push({ 'param': 'draw', 'value': this.draw });
    arrayParams.push({ 'param': 'start', 'value': start });
    arrayParams.push({ 'param': 'length', 'value': length });
    arrayParams.push({ 'param': 'Reglanegocio', 'value': 'FACTORING' });
    arrayParams.push({ 'param': 'Modulo', 'value': 'MCONFPA' });
    arrayParams.push({ 'param': 'column_names', 'value': 'Idmodulo,Modulo,Idreglanegocio,NomReglaNegocio,Idorgxreglaxparametroxmodulo,Idreglaxparametro,NombreParametro,ValorParametro' });

    let orden: string = "";
    if (this.ordenarCount > 0) {
      if (this.ordenarCount == 1) {
        orden = this.ordenar + ",ASC"
      } else if (this.ordenarCount == 2) {
        orden = this.ordenar + ",DESC"
      }
      arrayParams.push({ 'param': 'orden', 'value': orden });
    }

    arrayParams = arrayParams.concat(this.arraySearchParams);
    this.parametroService.listarRegistroParametro(arrayParams).subscribe(
      res => {
        let self = this;
        self.loading = true;
        for (let i = 0; i < res.data.length; i++) {
          self.parametrosregistrados = res.data[i].Parametros;
        }
      }
    );
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




  editarParametro(idParametro: string) {
    this.idEditarParametro = idParametro;
  }

  guardarEditarParametro(parametro: any) {
    if (parametro.Idorgxreglaxparametroxmodulo != '') {
      let nuevovalormodulo = $(`#${parametro.Idorgxreglaxparametroxmodulo}`).val();
      if(nuevovalormodulo=='' || nuevovalormodulo=='0'){
        swal({
          text: "Debe de Ingresar un valor.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
      }else{
        let arrayparametros: any = {};
        arrayparametros.Idorgxreglaxparametroxmod = parametro.Idorgxreglaxparametroxmodulo;
        arrayparametros.Valor = nuevovalormodulo;
        let parametros = new Parametros();
        parametros.OrgReglaParamMod.push(arrayparametros);
        this.parametroService.editarParametro(parametros).subscribe(
          // response => {
          //   setTimeout(()=>{
                 
          //   },2000);
          // },
          error => console.log(<any>error));
        this.cancelarParametro();
      }
     
      
    }
  }

  Eliminarparametro(parametro: any) {
    this.parametroaeliminar=parametro;

    $('#confirmar-eliminacion').modal('show');



  }

  confirmacion(){
    if (this.parametroaeliminar.Idorgxreglaxparametroxmodulo != '') {
      let arrayparametros: any = {};
      arrayparametros.Idorgxreglaxparametroxmod = this.parametroaeliminar.Idorgxreglaxparametroxmodulo;
      let parametros = new Parametros();
      parametros.OrgReglaParamMod.push(arrayparametros);

      this.parametroService.eliminarParametro(parametros).subscribe(
        response => {

          let posicion = this.parametrosregistrados.indexOf(this.parametroaeliminar);
          if (posicion !== -1) {
            this.parametrosregistrados.splice(posicion, 1);
          }
          setTimeout(()=>{
            $('#confirmar-eliminacion').modal('hide');
            this.cancelarParametro();
            //this.listarParametrosRegistrados(this.start, this.length);   
          });
        },
        error => console.log(<any>error));
      
    }

  }

  cancelarParametro() {
    this.idEditarParametro = '';
    this.idNuevoParametro='';
    $('#valor').val('');
    $('#comboparametro option')[0].selected = true;
  }

  agregar() {
    let valor = $("#comboparametro").val();
    let flag: boolean = false;
    this.parametros.forEach(parametro => {
      if (valor == parametro.Idreglaxparametro) {
        flag = true;
        this.idNuevoParametro = valor;
      }
    });
    if (!flag) {
      swal({
        text: "Debe seleccionar Una Opcion.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
    }

  }

  // cancelarNuevoRegistro(){
  //   this.idNuevoParametro = '';
  // }

  mostrarNombreParametroNuevo(idParametro: string): string {
    let nombre = '';
    this.parametros.forEach(element => {
      if (element.Idreglaxparametro == idParametro) {
        nombre = element.NombreParametro;
      }
    });
    return nombre;
  }

  guardarNuevoRegistro() {
    let valor = $('#valor').val();
    if (this.idNuevoParametro != '') {
      if(valor=='' || valor=='0'){
        swal({
          text: "Debe de Ingresar un valor.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
      }else{
        let arrayparametros: any = {};
        arrayparametros.Idreglaxparametro = this.idNuevoParametro;
        arrayparametros.Valor = valor;
        let parametros = new Parametros();
        parametros.Modulo = CODMODPARAMETRO;
        parametros.OrgReglaParamMod.push(arrayparametros);
        this.parametroService.crearParametro(parametros).subscribe(
          response => {
            setTimeout(()=>{
              this.cancelarParametro();
              this.listarParametrosRegistrados(this.start, this.length);  
            });
          },
          error => console.log(<any>error));
      }
      
     
    }
  }
}







