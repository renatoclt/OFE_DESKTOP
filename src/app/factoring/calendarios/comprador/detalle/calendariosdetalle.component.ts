import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { ChangeDetectorRef } from '@angular/core';
//Model
import { Calendario } from 'app/@model/factoring/Calendario';
import { CalendarioDetalle } from 'app/@model/factoring/CalendarioDetalle'
import { UiCalendarioDetalle } from 'app/@model/factoring/ui/UiCalendarioDetalle';
//Service
import { LoginService } from 'app/service/login.service';
import { CalendarioService } from 'app/@service/factoring/Calendario.service';
import { CalendarioDetalleService } from 'app/@service/factoring/CalendarioDetalle.service';
import { SpinnerService } from 'app/service/spinner.service';

declare var $, swal;
@Component({
  moduleId: module.id,
  selector: 'calendariosdetalle-cmp',
  templateUrl: 'calendariosdetalle.component.html',
  providers: [
    MasterService, 
    CalendarioService,
    CalendarioDetalleService
  ]
})

export class CalendariosDetalleComponent implements OnInit{
  util: AppUtils;
  title:string;
  id:string;
   /**
   * 
   * @param nav inicio calendario
   * 
   */  
  generateCalendar:boolean = true;
  year:any = new Date().getFullYear();
  monthDays:any = [];
  months:any = [{index: 0, name: 'Enero'}, {index: 1, name: 'Febrero'}, {index: 2, name: 'Marzo'}, {index: 3, name: 'Abril'}, {index: 4, name: 'Mayo'}, {index: 5, name: 'Junio'}, {index: 6, name: 'Julio'}, {index: 7, name: 'Agosto'}, {index: 8, name: 'Septiembre'}, {index: 9, name: 'Octubre'}, {index: 10, name: 'Noviembre'}, {index: 11, name: 'Diciembre'}];
  weekDays:any = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  selectedDays:any = [];

  fechasSelecionadasAntes:any = [];//Dias que vienen de db
  fechasSelecionadasDespues:any = [];//Dias que vienen de db
  fechasAgregadas:any = [];//Dias que se agregarán
  fechasQuitadas:any = [];//Dias que se quitarán  
  /**
   * 
   * fin calendario
   * 
   */
  public navigate(nav) {
    this.router.navigate(nav, { relativeTo: this.activatedRoute });
  }
  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private masterService: MasterService, 
    private spinnerService: SpinnerService,
    private calendarioService: CalendarioService,
    private calendarioDetalleService: CalendarioDetalleService
  ) {
    this.util = new AppUtils(this.router, this.masterService);      
    this.title = 'Mis calendarios';
  }
  
  //**** Inicio metodos ng ****/
  ngOnInit() {
    this.getMonthDays();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];      
    });

    this.calendarioDetalleService.obtenerCalendarioDetallePorId(this.id).subscribe(
      res => {
        res.data.forEach(dates => {
          this.fechasSelecionadasAntes.push(dates.Fecha);
          this.selectedDays.push(dates.Fecha);
        });
      }
    );
  }
  //**** Fin metodos ng ****/

  lastYear() {
    const self = this
    let yearCurrent = (new Date()).getFullYear()
    if (yearCurrent >= self.year--)	{
      self.year = yearCurrent
    }
    self.generateCalendar = true;
    self.monthDays = []
    this.getMonthDays ();
  };
  
  nextYear() {
    const self = this
    self.year++
    self.generateCalendar = true;
    self.monthDays = []
    this.getMonthDays ();
  };

  getMonthDays () {
    const self = this
    for (var i = 0; i < self.months.length; i++) {
      let date = new Date(self.year, i, 1)
      let startComplete = true
      let day:any = '';
      let beforeDays = []
      let days = []
      let afterDays = []
      while (date.getMonth() === i) {
        day = new Date(date)
        if (startComplete) {
          beforeDays = self.startCompleteDays(day.getDay())
          startComplete = false
        }
        //days.push({id: day.getTime(), day: day.getDate(), disabled: false})
        days.push({id: day.getFullYear() + '-' + this.completeDayMonth(day.getMonth() + 1)+ '-' + this.completeDayMonth(day.getDate()), day: day.getDate(), disabled: false})
        date.setDate(date.getDate() + 1)
      }
      afterDays = self.endCompleteDays(day.getDay())
      self.monthDays.push(beforeDays.concat(days).concat(afterDays))
    }
    self.generateCalendar = false;
  }

  startCompleteDays(day) {
    let beforeDays = []
    for (var i = 0; i < day; i++) {
      beforeDays.push({day: '', disabled: true})
    }
    return beforeDays
  }

  endCompleteDays (day) {
    let afterDays = []
    for (var i = day; i < 6; i++) {
      afterDays.push({day: '', disabled: true})
    }
    return afterDays
  }

  selectedDay(day){
    const self = this
    if (self.selectedDays.indexOf(day) !== -1) {
      return true
    }
    return false
  }

  selectDay (id) {
    const self = this
    if (id) {
      if (self.selectedDays.indexOf(id) === -1) {
        self.selectedDays.push(id)
      } else {
        self.selectedDays.splice(self.selectedDays.indexOf(id), 1)
      }
    }
  }

  completeDayMonth(number) {
    return (number < 10) ? '0' + number.toString() : number.toString();
  }

  saveDates(){
    const self = this;
    self.spinnerService.set(true);
    //self.spinnerService.set(true);  
    let uiCalendarioDetalle:UiCalendarioDetalle = new UiCalendarioDetalle();
    self.selectedDays.forEach(fecha => {
      self.fechasSelecionadasDespues.push(fecha);
    });
    uiCalendarioDetalle.IdCalendario = this.id;

    /**
     * Agregadas
     */
    self.fechasSelecionadasDespues.forEach(fechaDespues => {
      let agregar:boolean = true;
      self.fechasSelecionadasAntes.forEach(fechaAntes => {        
        if (fechaDespues ==  fechaAntes) {
          agregar = false;
        }
      });
      if (agregar) {        
        uiCalendarioDetalle.FechaAgregadas.push({'Fecha': fechaDespues});
      }
    });

    /**
     * Quitadas
     */
    self.fechasSelecionadasAntes.forEach(fechaAntes => {
      let quitar:boolean = true;
      self.fechasSelecionadasDespues.forEach(fechaDespues => {
        if (fechaDespues ==  fechaAntes) {
          quitar = false;
        }
      });
      if (quitar) {        
        uiCalendarioDetalle.FechaQuitadas.push({'Fecha': fechaAntes});
      }
    });

    /**
     * Guardar
     */
    self.calendarioDetalleService.editarCalendarioDetalle(uiCalendarioDetalle).subscribe(
      response  => {
        self.handleMessage(response);
      },
      error =>  {
        self.spinnerService.set(false);
        console.log(<any>error);
      });

    /**
     * Reiniciar selecionados
     */
    self.fechasSelecionadasAntes = [];
    self.selectedDays.forEach(date => {
      self.fechasSelecionadasAntes.push(date);
      self.fechasSelecionadasDespues = [];
    });
  }
  /**
   * 
   */

  handleMessage(response)
  {
    if (response.status == 202) {
      setTimeout(()=>{
        this.spinnerService.set(false);
      },2000);      
    }else{
      console.log(response);
    }
  }
}




