import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TablaMaestra} from '../general/models/documento/tablaMaestra';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import {TiposService} from '../general/utils/tipos.service';
import {PadreRetencionPercepcionService} from './services/padre-retencion-percepcion.service';

@Component({
  selector: 'app-percepcion-retencion',
  templateUrl: './percepcion-retencion.component.html',
  styleUrls: ['./percepcion-retencion.component.css']
})
export class PercepcionRetencionComponent implements OnInit, OnDestroy {
  titulo = 'crearComprobantes';
  tiposDeComprobante: BehaviorSubject<TablaMaestra[]>;
  comprobanteSeleccionadoValor: TablaMaestra;
  comprobanteSeleccinadoSubscription: Subscription;
  mostrarCombo: BehaviorSubject<boolean>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private _tiposService: TiposService,
              private padreRetencionPercepcionService: PadreRetencionPercepcionService) {
  }

  ngOnInit() {
    this.cargarDataRutaComponente();
  }

  actualizarComprobante() {
    this.comprobanteSeleccinadoSubscription = this.padreRetencionPercepcionService.comprobanteSeleccionado.subscribe(
      data => {
        if (data) {
          this.comprobanteSeleccionadoValor = data;
          console.log('---comproa ', this.comprobanteSeleccionadoValor);
          if (!this.padreRetencionPercepcionService.soloCambiarMostrarCombo) {
            this.navegarHacia(this.comprobanteSeleccionadoValor);
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.comprobanteSeleccinadoSubscription.unsubscribe();
  }

  cargarDataRutaComponente() {
    this.tiposDeComprobante = this.padreRetencionPercepcionService.tiposDeComprobantes;
    this.mostrarCombo = this.padreRetencionPercepcionService.mostrarCombo;
    this.actualizarComprobante();
  }

  cargarComprobante() {
    this.navegarHacia(this.comprobanteSeleccionadoValor);
  }

  navegarHacia(tipoComprobante: TablaMaestra) {
    let ruta =  '';
    switch (tipoComprobante.codigo) {
      case this._tiposService.TIPO_DOCUMENTO_RETENCION:
        ruta = 'retencion';
        break;
      case this._tiposService.TIPO_DOCUMENTO_PERCEPCION:
        ruta = 'percepcion';
        break;
    };
    this.router.navigate([ruta + '/crear'], {relativeTo: this.route});
  }
}
