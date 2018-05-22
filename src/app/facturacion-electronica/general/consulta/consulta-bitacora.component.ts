import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OrderModule } from 'ngx-order-pipe';

import { trigger, state, style, animate, transition } from '@angular/animations';
declare var $, swal;
@Component({
    selector:       'consulta-bitacora-component',
    templateUrl:    'consulta-bitacora.component.html',
    styleUrls: ['consulta-bitacora.component.css'],
    animations: [
      trigger('dialog', [
        transition('void => *', [
          style({ transform: 'scale3d(.3, .3, .3)' }),
          animate(100)
        ]),
        transition('* => void', [
          animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
        ])
      ])
    ]
})
export class ConsultaBitacoraComponent implements OnInit {
    @Input() closable = true;
    @Input() visible: boolean;
    @Input() listaBitacoras:any[];
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    order: string = 'fechaCreacion';
    constructor() {
    }
    ngOnInit() {

    }

    close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
        console.log(this.listaBitacoras);
    }

    verObservacionEvento(mensaje){

      swal({
        text: mensaje
      });
    }

}
