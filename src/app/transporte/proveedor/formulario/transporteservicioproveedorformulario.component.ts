import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges, ChangeDetectorRef, Inject } from '@angular/core';
import { MomentModule } from 'angular2-moment/moment.module';
import { AppUtils } from 'app/utils/app.utils';
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from 'app/model/comboitem';

import { TransporteServicio, Transporte, Entrega} from 'app/model/transporteservicio';
import { TransporteServicioService } from 'app/service/transporteservicioservice';

import 'app/../assets/js/plugins/jquery.PrintArea.js';
import { LoginService } from 'app/service/login.service';
import { Boton } from 'app/model/menu';
import { Producto } from 'app/model/sm-requerimiento';

declare var moment: any;
declare var swal: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

declare var $, DatatableFunctions: any;
var oTransporteServicioProveedorFormularioComponent: TransporteServicioProveedorFormularioComponent;

@Component({
  moduleId: module.id,
  selector: 'transporteservicioproveedorformulario-cmp',
  templateUrl: './transporteservicioproveedorformulario.component.html',
  providers: [TransporteServicioService, MasterService, LoginService]
})

export class TransporteServicioProveedorFormularioComponent implements OnInit, AfterViewInit {

  transportes = [];
  public entregas: Entrega[];

  public toggleButton: boolean = true;
  public id: string = '0';
  public botonImprimir: Boton = new Boton();

  util: AppUtils;
  // public listPrioridadCombo: ComboItem[];
  public listMonedaCombo: ComboItem[];
  public listUnidadMedidaCombo: ComboItem[];
  public listEstadoCombo: ComboItem[];
  public item: TransporteServicio;
  public transporte: TransporteServicio;
  public transporteproducto: Transporte;

  // public sortOrder = 'asc';
  public url_main_module_page = '/transporte/proveedor/buscar';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _masterService: MasterService,
    private _dataService: TransporteServicioService,
    private _securityService: LoginService,
    private cdRef: ChangeDetectorRef
    ) {
    this.util = new AppUtils(this.router, this._masterService);

    this.item = new TransporteServicio();
    this.transporte = new TransporteServicio();
    this.entregas = [];
  }

  obtenerBotones() {
    let botones = this._securityService.ObtenerBotonesCache(this.url_main_module_page) as Boton[];
    if (botones) {
      console.log('ObtenerBotonesCache', botones);
      this.configurarBotones(botones);
    } else {
      this._securityService.obtenerBotones(this.url_main_module_page).subscribe(
        botones => {
          console.log('obtenerBotones', botones);
          oTransporteServicioProveedorFormularioComponent.configurarBotones(botones);
          oTransporteServicioProveedorFormularioComponent._securityService.guardarBotonesLocalStore(this.url_main_module_page, botones);
        },
        e => console.log(e),
        () => { }
      );
    }
  }

  configurarBotones(botones: Boton[]) {
    if (botones && botones.length > 0) {
      this.botonImprimir = botones.find(a => a.nombre === 'imprimir') ? botones.find(a => a.nombre === 'imprimir') : this.botonImprimir;
    }
  }

  print(event): void {
    setTimeout(function () {
      $('div#print-section-material').printArea({ popTitle: 'Ticket de Transporte', mode: 'iframe', popClose: false });
    }, 100);
  }


  AgregandoEntregas(idTicket) {
    console.log(idTicket);
    // filtrar los transportes y ubicar el que tenga el id.
    const transportesModificados = this.transportes.map(transporte => {
        if (transporte.idtransporte === idTicket) {
          return {...transporte, mostrarEntregas: !transporte.mostrarEntregas};
        }
        return transporte;
      });

    this.transportes = transportesModificados;
    // cambiar el mostrar a ese transporte
    // actualizar variable de transportes

  }

  Ordenar(ordenarPor) {
    //console.log('hola');

    switch (ordenarPor) {
      case 'numeroT' :
        const transportesOrdenados = this.transportes.sort((a, b) => {
          if (a.numerotransporte < b.numerotransporte){
            return -1;
          }
          if (a.numerotransporte > b.numerotransporte) {
            return 1;
          }
          return 0;
        });
        this.transportes = transportesOrdenados;
      break;

      case 'placa' :
        const placasOrdenadas = this.transportes.sort((a, b) => {
          if (a.placa < b.placa){
            return -1;
          }
          if (a.placa > b.placa) {
            return 1;
          }
          return 0;
        });
        this.transportes = placasOrdenadas;
      break;

      case 'costo' :
        const costosOrdenados = this.transportes.sort((a, b) => {
          if (a.costoproveedor < b.costoproveedor){
            return -1;
          }
          if (a.costoproveedor > b.costoproveedor) {
            return 1;
          }
          return 0;
        });
        this.transportes = costosOrdenados;
      break;
    }

  }

  ngOnInit(): void {

    // this.baseurl = $("#baseurl").attr("href");
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    if (this.id !== '0') {
      this.toggleButton = true;

    } else {
      this.toggleButton = false;
    }

    this.util.listMonedas(function (data: ComboItem[]) {
      oTransporteServicioProveedorFormularioComponent.listMonedaCombo = data;
    });

    this.util.listEstadoTTransporte(function (data: ComboItem[]) {
      oTransporteServicioProveedorFormularioComponent.listEstadoCombo = data;
    });

    oTransporteServicioProveedorFormularioComponent = this;
  }

  ngAfterViewInit() {

    this._dataService
      .obtener(this.id)
      .subscribe(
      p => {

        this.item = p;
        console.log('los items');
        console.log(this.item);
        this.transportes = p.productos.map(transporte => {
          return {
            ...transporte,
            mostrarEntregas: false,

          };
        });
        setTimeout(function () {

          $('input').each(function () {
            $(this).keydown();
            // tslint:disable-next-line:curly
            if (!$(this).val() && $(this).val() === '')
              $(this.parentElement).addClass('is-empty');
          });

          $('select').each(function () {
            $(this).keydown();
            // tslint:disable-next-line:curly
            if (!$(this).val() && $(this).val() === '')
              $(this.parentElement).addClass('is-empty');
          });

          $('textarea').each(function () {
            $(this).keydown();
            // tslint:disable-next-line:curly
            if (!$(this).val() && $(this).val() === '')
              $(this.parentElement).addClass('is-empty');
          });
        }, 100);

      },
      e => console.log(e),
      () => { }
    );
    this.obtenerBotones();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }

// tslint:disable-next-line:eofline
}