import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OrderModule } from 'ngx-order-pipe';

import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
    selector:       'factura-anticipo-modal-component',
    templateUrl:    'factura-anticipo-modal-component.html',
    styleUrls: ['factura-anticipo-modal.component.css'],
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
export class FacturaAnticipoModalComponent implements OnInit {
    @Input() closable = true;
    @Input() visible: boolean;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor() {
        console.log('MODAL CONSTRUCTIR');
    }
    ngOnInit() {
        console.log('MODAL');

    }

    close() {
        
        console.log('MODAL close');
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }

    // order_hours() {
  //   this.listaBitacoras.fechaCreacion
  // }
}
