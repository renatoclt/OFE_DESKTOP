import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { ChangeDetectorRef } from '@angular/core';
//Model
import { Calendario } from 'app/@model/factoring/Calendario';
//Service
import { LoginService } from 'app/service/login.service';
import { CalendarioService } from 'app/@service/factoring/Calendario.service';
import { SpinnerService } from 'app/service/spinner.service';

declare var $, swal;
@Component({
  moduleId: module.id,
  selector: 'calendariosbuscar-cmp',
  templateUrl: 'calendariosbuscar.component.html',
  providers: [
    MasterService, 
    CalendarioService
  ]
})

export class CalendariosBuscarComponent implements OnInit{
  util: AppUtils;
  title:string;
  calendarios:any = [];
  loading:boolean = false;
  mostrarFormularioNuevoCalendario:boolean = false;
  mostrarBotonCrear:boolean = false;
  nombre:string = '';
  idEditarCalendario:string = '';
  calendarioHabilitado:any = {};
  public navigate(nav) {
    this.router.navigate(nav, { relativeTo: this.route });
  }
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private masterService: MasterService, 
    private spinnerService: SpinnerService,
    private calendarioService: CalendarioService
  ) {
    this.util = new AppUtils(this.router, this.masterService);      
    this.title = 'Mis calendarios';
  }
  
  //**** Inicio metodos ng ****/
  ngOnInit() {
    this.listaCalendario();
  }
  //**** Fin metodos ng ****/

  listaCalendario(){
    let arrayParams:any = [];
    arrayParams.push({'param': 'start', 'value': 0});
    arrayParams.push({'param': 'length', 'value': 10});
    arrayParams.push({'param': 'draw', 'value': 10});
    arrayParams.push({'param': 'column_names', 'value': 'IdCalendario,NombreCalendario,IdTipoCalendario,TipoCalendario,IdOrganizacion,Propietario'});
    
    this.calendarioService.obtenerListaCalendario(arrayParams).subscribe(
      res => {
        this.loading = true;
        this.calendarios = res.data;
        if (res.recordsTotal == 0) {
          this.mostrarBotonCrear = true;
        }
      }
    );
  }

  formularioCrearCalendario(){
    this.mostrarFormularioNuevoCalendario = true;
  }

  cancelarCrearCalendario(){
    this.mostrarFormularioNuevoCalendario = false;
  }

  editarCalendario(idEditarCalendario){
    this.idEditarCalendario = idEditarCalendario;
  }

  guardarCalendario(calendarioEditado:any){
    this.spinnerService.set(true);     
    let calendario:Calendario = new Calendario();
    calendario.IdCalendario = calendarioEditado.IdCalendario;
    calendario.Nombre = calendarioEditado.NombreCalendario;
    if (calendario.IdCalendario == '') {
      this.spinnerService.set(false);
      swal({
        text: "Id de calendario requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return;
    }
    if (calendario.Nombre == '') {
      this.spinnerService.set(false);
      swal({
        text: "Nombre de calendario requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
    }else{
      this.calendarioService.editarCalendario(calendario).subscribe(
        response  => {
          this.spinnerService.set(false);
          this.cancelarCalendario();
        },
        error =>  console.log(<any>error));
      this.mostrarFormularioNuevoCalendario = false;
      this.nombre = ''; 
    }
  }

  cancelarCalendario(){
    this.idEditarCalendario = '';
  }

  crearCalendario(){
    this.spinnerService.set(true);     
    let calendario:Calendario = new Calendario();
    calendario.Nombre = this.nombre
    if (calendario.Nombre == '') {
      this.spinnerService.set(false);
      swal({
        text: "Nombre de calendario requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
    }else{
      this.calendarioService.crearCalendario(calendario).subscribe(
        response  => {
          this.handleMessage(response);
        },
        error =>  console.log(<any>error));
      this.mostrarFormularioNuevoCalendario = false;
      this.nombre = ''; 
    }
  }

  confimarInhabilitarCalendario(calendario:any){
    this.calendarioHabilitado = calendario;
    $('#confirmar-inhabilitar').modal('show');
  }

  inhabilitarCalendario(){
    this.calendarioService.eliminarCalendario({'IdCalendario': this.calendarioHabilitado.IdCalendario}).subscribe(
      response  => {
        this.spinnerService.set(false); 
        let posicion = this.calendarios.indexOf(this.calendarioHabilitado);
        if (posicion !== -1) {
          this.calendarios.splice(posicion, 1);
        }
        if (this.calendarios.length == 0) {          
          this.mostrarBotonCrear = true;
        }
      },
      error =>  console.log(<any>error));
    $('#confirmar-inhabilitar').modal('hide');
  }

  handleMessage(response)
  {
    if (response.status == 202) {
      setTimeout(()=>{
        this.spinnerService.set(false);
        this.listaCalendario();
      },2500);      
    }else{
      console.log(response);
    }
  }
}




