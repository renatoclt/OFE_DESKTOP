import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RefreshService} from '../../general/services/refresh.service';

@Component({
  selector: 'app-retencion',
  templateUrl: './retencion.component.html',
  styleUrls: ['./retencion.component.css']
})
export class RetencionComponent implements OnInit {
  titulo = 'Crear Retención';
  constunitaria = 'RetencionUnitariaComponent';

  @ViewChild('unitaria') unitaria: ElementRef;
 // @ViewChild('masiva') masiva: ElementRef;

  constructor( private router: Router,
               private route: ActivatedRoute,
               private Refresh: RefreshService
              ) { }
  ngOnInit() {
    const idruta = this.route.children[0]['data']['value']['id'];
    if (idruta == this.constunitaria ) {
        this.unitaria.nativeElement.className = 'active';
       // this.masiva.nativeElement.className = '';
    } else {
       // this.masiva.nativeElement.className = 'active';
        this.unitaria.nativeElement.className = 'active';
    }

    //cambiar por ngafterview
  }

  llamar_unitaria() {
    this.router.navigateByUrl('percepcion-retencion/retencion/crear/individual');
  }
/*
  llamar_masiva() {
    this.router.navigateByUrl('percepcion-retencion/retencion/crear/masiva');
  }*/
}
