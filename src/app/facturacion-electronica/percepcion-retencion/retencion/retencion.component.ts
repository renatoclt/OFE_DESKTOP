import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PadreRetencionPercepcionService} from '../services/padre-retencion-percepcion.service';
import {TiposService} from '../../general/utils/tipos.service';

@Component({
  selector: 'app-retencion',
  templateUrl: './retencion.component.html',
  styleUrls: ['./retencion.component.css']
})
export class RetencionComponent implements OnInit {
  titulo = 'Crear Retención';
  constunitaria = 'RetencionUnitariaComponent';

  @ViewChild('unitaria') unitaria: ElementRef;

  constructor( private router: Router,
               private route: ActivatedRoute,
               private _tiposService: TiposService,
               private padreRetencionPercepcionService: PadreRetencionPercepcionService
              ) { }
  ngOnInit() {
    this.padreRetencionPercepcionService.comprobanteSeleccionado.subscribe(
      data => {
        this.unitaria.nativeElement.className = 'active';
        if (data) {
          if (data.codigo === this._tiposService.TIPO_DOCUMENTO_RETENCION) {
            const idruta = this.route.children[0]['data']['value']['id'];
            this.unitaria.nativeElement.className = 'active';
            // this.masiva.nativeElement.className = '';
          }
        }
      }
    );
  }

  llamar_unitaria() {
    this.router.navigateByUrl('percepcion-retencion/retencion/crear/individual');
  }

  llamar_masiva() {
    this.router.navigateByUrl('percepcion-retencion/retencion/crear/individual');
  }
}
