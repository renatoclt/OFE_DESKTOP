import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';

import { MomentModule } from 'angular2-moment/moment.module';
import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import { ComboItem } from "app/model/comboitem";
import {CalificarProveedor, Proveedor } from "app/model/calificacion";


declare var moment: any;
declare var swal: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $: any;
var oCalificacionProveedorDetalleCalificacionComponent;
@Component({
  moduleId: module.id,
  selector: 'calificacionproveedordetallecalificacion-cmp',
  templateUrl: 'calificacionproveedordetallecalificacion.component.html',
  providers: [MasterService]
})

export class CalificacionProveedorDetalleCalificacionComponent implements OnInit, AfterViewInit {

  public toggleButton: boolean = true;
  public id: number = 0;
  items = [];
  util: AppUtils;

  public item: CalificarProveedor;
  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.activatedRoute });
  }
  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private _masterService: MasterService, ) {
    this.util = new AppUtils(this.router, this._masterService);

  }

  public buildCalificacion(calificacion){
    let starts = "";
    for(var xI=0;xI<calificacion;xI++){
      starts += '<i class="material-icons">star</i>';
    }

    for(var xI=0;xI<(5-calificacion);xI++){
      starts += '<i class="material-icons">star_border</i>';
    }

    return '<div>' + starts + '</div>';
  }

  ngOnInit() {
   this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.item = {
      id: 1,
      tipooc:"",
      proveedor: "Pintado de Edifico S.A",
      descripcion: "Descripcion",
      nroocos: "0001",
      entidadcompradora: "PROVIAS",
      usuariocomprador : "CABANILLAS HORNA CAROLINA",
      calificarpreguntas: [
        {
          id:1,
          pregunta: "1. ¿Cómo califica la oportunidad en la entrega de los productos y/o servicios? ¿Se cumplieron los plazos por parte del proveedor?",
          calificacion: 3,
        },
        {
          id:2,
          pregunta: "2. ¿Cómo califica la calidad de los productos y/o servicios entregados por parte de la empresa proveedora?",
          calificacion: 2,
        },
        {
          id:3,
          pregunta: "3. ¿Cómo califica el desempeño del personal de la empresa proveedora?",
          calificacion: 1,
        },
        {
          id:4,
          pregunta: "4. ¿Cómo evalúa en general el desempeño de la empresa proveedora?",
          calificacion: 4,
        },
        {
          id:5,
          pregunta: "5. En su opinión, ¿Qué tan recomendable es este proveedor?",
          calificacion: 5,
        }
      ]
    };
    
    oCalificacionProveedorDetalleCalificacionComponent = this;
  }
S

  ngAfterViewInit() {
    var dtCalificaciones = $('#dtCalificaciones').DataTable({
     "dom": 'rT<"clear">',

      "ajax": function (data, callback, settings) {
        let result = {
          data: oCalificacionProveedorDetalleCalificacionComponent.item.calificarpreguntas

        };
        callback(
          result
        );
      },
     sort:false,
      columns: [
        { data: 'pregunta', width: "80%", sortable:false },
        { data: 'calificacion', width: "20%", sortable:false },
      ],
      columnDefs: [
      {

        render: function (data, type, row) {

          let starts = "";
          for(var xI=0;xI<row.calificacion;xI++){
            starts += '<i class="material-icons">star</i>';
          }
          
          for(var xI=0;xI<(5-row.calificacion);xI++){
            starts += '<i class="material-icons">star_border</i>';
          }
          
          return '<div class="pull-right">' + starts + '</div>';
        },

        targets: 1
      }
    ]
    });
  }


}

