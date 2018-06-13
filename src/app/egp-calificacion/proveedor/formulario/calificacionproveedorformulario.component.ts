import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';

import { MomentModule } from 'angular2-moment/moment.module';
import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import { ComboItem } from "app/model/comboitem";
import {ProveedorCalificacion, Proveedor } from "app/model/calificacion";


declare var moment: any;
declare var swal: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $: any;
var oCalificacionProveedorFormularioComponent;
@Component({
  moduleId: module.id,
  selector: 'calificacionproveedorformulario-cmp',
  templateUrl: 'calificacionproveedorformulario.component.html',
  providers: [MasterService]
})

export class CalificacionProveedorFormularioComponent implements OnInit, AfterViewInit {

  public toggleButton: boolean = true;
  public id: number = 0;

  util: AppUtils;

  public item: Proveedor;
  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.activatedRoute });
  }
  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private _masterService: MasterService, ) {
    this.util = new AppUtils(this.router, this._masterService);

  }

  

  ngOnInit() {
   this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.item = {
      id: 1,
      rucdni: "4590015491",
      razonsocial: "Pintado de Edificio SA",
      proveedorcalificaciones: [
        {
          nrooc: "001",
          tipoocos: "Servicio",
          usuariocomprador: "PROVIAS",
          entidadcompradora: "Pintado de Edificio SA",
          calificacion: 3,
          id:1
        }
      ]
    };
    
    oCalificacionProveedorFormularioComponent = this;
  }


  ngAfterViewInit() {
    var dtCalificaciones = $('#dtCalificaciones').DataTable({
     

      "ajax": function (data, callback, settings) {
        let result = {
          data: oCalificacionProveedorFormularioComponent.item.proveedorcalificaciones

        };
        callback(
          result
        );
      },
     
      columns: [

        { data: 'nrooc' },
        { data: 'tipoocos' },
        { data: 'usuariocomprador' },
        { data: 'entidadcompradora' },
        { data: 'calificacion' },
        { data: 'id' },
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
          
          return '<div>' + starts + '</div>';
        },

        targets: 4
      },
      {

        render: function (data, type, row) {

          //return data +' ('+ row[3]+')';
          return '<div class="text-center"><a href="/egp-calificacion/proveedor/detalle/' + row.id + '" id="' + row.id + '">' +
            '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver Calificación" data-placement="left">' +
            '<i class="material-icons">visibility</i></button></a>' + '<a href="/egp-calificacion/proveedor/calificar/' + row.id + '" id="' + row.id + '" >' +
            '<button class="btn btn-simple btn-info btn-icon calificar" rel="tooltip" title="Calificar" data-placement="left">' +
            '<i class="material-icons">gavel</i></button></a>' +
            '</div>';
        },
        targets: 5
      }
    ]
    });
    
    dtCalificaciones.on('click', '.edit', function (event) {
      var $tr = $(this).closest('tr');

      var data = dtCalificaciones.row($tr).data();
      //console.log("click edit", event);
      let id = $tr.find("a").attr('id');

      //console.log("click edit", oCalificacionProveedorBuscarComponent);
      let nav = ['/egp-calificacion/proveedor/detallecalificacion', id];

      oCalificacionProveedorFormularioComponent.navigate(nav);
      event.preventDefault();

    });
    
    dtCalificaciones.on('click', '.calificar', function (event) {
      var $tr = $(this).closest('tr');

      var data = dtCalificaciones.row($tr).data();
      //console.log("click edit", event);
      let id = $tr.find("a").attr('id');

      //console.log("click edit", oCalificacionProveedorBuscarComponent);
      let nav = ['/egp-calificacion/proveedor/calificar', id];

      oCalificacionProveedorFormularioComponent.navigate(nav);
      event.preventDefault();

    });
  }


}
