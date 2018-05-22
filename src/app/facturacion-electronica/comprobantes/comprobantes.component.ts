import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PadreComprobanteService} from './services/padre-comprobante.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TablaMaestra} from '../general/models/documento/tablaMaestra';
import {TiposService} from '../general/utils/tipos.service';
import {Subscription} from 'rxjs/Subscription';
import { PersistenciaService } from './services/persistencia.service';

@Component({
  selector: 'app-comprobantes',
  templateUrl: './comprobantes.component.html',
  styleUrls: ['./comprobantes.component.css']
})
export class ComprobantesComponent implements OnInit, OnDestroy {
  titulo = 'crearComprobantes';
  tiposDeComprobante: BehaviorSubject<TablaMaestra[]>;
  comprobanteSeleccionadoValor: TablaMaestra;
  comprobanteSeleccinadoSubscription: Subscription;
  mostrarCombo: BehaviorSubject<boolean>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private _tiposService: TiposService,
              private padreComprobanteService: PadreComprobanteService,
              private _persistenciaService: PersistenciaService) {
  }

  ngOnInit() {
    this.cargarDataRutaComponente();
  }

  actualizarComprobante() {
    this.comprobanteSeleccinadoSubscription = this.padreComprobanteService.comprobanteSeleccionado.subscribe(
      data => {
        if (data) {
          this.comprobanteSeleccionadoValor = data;
          if (!this.padreComprobanteService.soloCambiarMostrarCombo) {
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
    this.tiposDeComprobante = this.padreComprobanteService.tiposDeComprobantes;
    this.mostrarCombo = this.padreComprobanteService.mostrarCombo;
    this.actualizarComprobante();
  }

  cargarComprobante() {
    this._persistenciaService.removePersistencias();
    this.navegarHacia(this.comprobanteSeleccionadoValor);
  }

  navegarHacia(tipoComprobante: TablaMaestra) {
    let ruta =  '';
    switch (tipoComprobante.codigo) {
      case this._tiposService.TIPO_DOCUMENTO_FACTURA:
        ruta = 'factura';
        break;
      case this._tiposService.TIPO_DOCUMENTO_BOLETA:
        ruta = 'boleta';
        break;
      // case this._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO:
      //   ruta = 'notaCredito';
      //   break;
      // case this._tiposService.TIPO_DOCUMENTO_NOTA_DEBITO:
      //   ruta = 'notaDebito';
      //   break;
    };
    this.router.navigate([ruta + '/crear'], {relativeTo: this.route});
  }
}
