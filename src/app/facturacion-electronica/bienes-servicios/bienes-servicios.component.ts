import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-bienes-servicios',
  templateUrl: './bienes-servicios.component.html',
  styleUrls: ['./bienes-servicios.component.css']
})
export class BienesServiciosComponent  {
  titulo= '';
  constructor( private router: Router,
               private route: ActivatedRoute
  ) {
    this.titulo = 'Bienes y Servicios';
  }

}
