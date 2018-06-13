import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {
  titulo = 'Crear';
  constunitaria = 'BienesServiciosIndividualComponent';

  @ViewChild('unitaria') unitaria: ElementRef;
  @ViewChild('masiva') masiva: ElementRef;

  constructor( private router: Router,
               private route: ActivatedRoute
              ) { }
  ngOnInit() {
    const idruta = this.route.children[0]['data']['value']['id'];
    console.log(this.route.children[0]['data']['value']['id']);
    console.log(idruta);
    if (idruta == this.constunitaria ) {
        this.unitaria.nativeElement.className = 'active';
        this.masiva.nativeElement.className = '';
    } else {
        this.masiva.nativeElement.className = 'active';
        this.unitaria.nativeElement.className = '';
    }

    //cambiar por ngafterview
  }

  llamar_unitaria() {
    this.router.navigateByUrl('bienes-servicios/crear/individual');
  }

  llamar_masiva() {
    this.router.navigateByUrl('bienes-servicios/crear/masiva');
  }
}
