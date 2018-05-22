import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent  {
  titulo: string;
  constructor( private router: Router,
               private route: ActivatedRoute
  ) {
    this.titulo = 'configuracion';
  }

}
