import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {NgControl} from '@angular/forms';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Directive({
  selector: '[precioDirectiva]',
  host: {
    '(keyup)': 'onKeyUp($event)',
    '(keydown)': 'onKeyDown($event)',
    '(blur)' : 'onBlur($event)'
  }
})
export class PrecioDirective {
  @Input() tamanioFraccion: number;
  @Input() tamanioEntera: number;

  cadenaPrecio: BehaviorSubject<string>;
  keyCodesPermitidos: number[];

  constructor(private _renderer: Renderer2,
              private elemento: ElementRef,
              private control: NgControl) {
    this.tamanioFraccion = 2;
    this.tamanioEntera = 12;
    this.cadenaPrecio = new BehaviorSubject('');
    this.keyCodesPermitidos = [8, 9, 13, 27, 37, 38, 39, 40 , 116];
  }

  esNumero(keyCode: number) {
    return ((keyCode >= 96 && keyCode <= 105) || (keyCode >= 48 && keyCode <= 57));
  }

  esPunto(keyCode: number) {
    return ((keyCode === 190) || (keyCode === 110));
  }

  esKeyCodePermitido(keyCode: number) {
    return (this.keyCodesPermitidos.indexOf(keyCode) !== -1);
  }

  onKeyUp(evento: Event) {
    this.cadenaPrecio.next(this.control.value);
  }

  onKeyDown(evento: Event) {
    const caracterEvento = evento['which'];
    if (
      this.esNumero(caracterEvento) ||
      this.esPunto(caracterEvento) ||
      this.esKeyCodePermitido(caracterEvento)
    ) {
      const cadena = this.control.value.toString();
      if (
        cadena.indexOf('.') !== -1 &&
        (caracterEvento === 190 || caracterEvento === 110)
      ) {
        evento.preventDefault();
      }
      if (
        cadena.indexOf('.') !== -1 &&
        (caracterEvento === 190 || caracterEvento === 110)
      ) {
        evento.preventDefault();
      }
      this.cadenaPrecio.subscribe(
        valorCadena => {
          const tamanio = this.tamanioEntera + this.tamanioFraccion + 1;
          if (valorCadena.length < tamanio) {
            const [entero, fraccion] = valorCadena.split('.');
            const fraccionTamanio = fraccion ? fraccion.length : 0;
            if (entero.length === this.tamanioEntera && valorCadena.length === (this.tamanioEntera + 1)) {
              if (fraccionTamanio === this.tamanioFraccion) {
                if (
                  this.esNumero(caracterEvento) ||
                  this.esPunto(caracterEvento)
                ) {
                  evento.preventDefault();
                }
              } else {
                return true;
              }
            } else {
              if (entero.length === this.tamanioEntera) {
                if (this.esPunto(caracterEvento)) {
                  return true;
                } else {
                  if (!fraccion) {
                    if (this.esNumero(caracterEvento)) {
                      evento.preventDefault();
                    }
                  }
                  return true;
                }
              } else {
                if (fraccionTamanio === this.tamanioFraccion) {
                  if (
                    this.esNumero(caracterEvento) ||
                    this.esPunto(caracterEvento)
                  ) {
                    evento.preventDefault();
                  }
                }
                return true;
              }
            }
          } else {
            if (
              this.esNumero(caracterEvento) ||
              this.esPunto(caracterEvento)
            ) {
              evento.preventDefault();
            }
          }
        }
      );
    } else {
      evento.preventDefault();
    }
  }

  onBlur(evento: Event) {
    const cadena = this.control.value;
    this._renderer.removeClass( this.elemento.nativeElement.parentElement, 'is-empty' )
    this.control.reset(Number(cadena).toFixed(2));
    if (Number(cadena) === 0.00) {
      $('input').each(function () {
        $(this.parentElement).removeClass('is-empty');
      });
    }
  }


}
