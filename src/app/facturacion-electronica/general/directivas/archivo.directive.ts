import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';


type HTMLFileInputMultipleAttribute = any | boolean;
export type TipoArchivoRestriccion = RegExp | string | string[];


@Directive({
  selector:  '[archivoDirectiva]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ArchivoDirective, multi: true }]

})
export class ArchivoDirective implements Validator {

  @Input() maximoTamanio: number;
  @Input() minimoTamanio: number;

  @Input() mensajeErrorTamanio: string;
  @Input() mensajeErrorTipo: string;

  @Input() tipoArchivoRestriccion: TipoArchivoRestriccion;
  @Input() verificarTamanio: boolean;

  @Input()
  public set multiple(value: any) {
    this._multiple = value === '' || !!value;
  };

  public get multiple(): HTMLFileInputMultipleAttribute {
    return this._multiple;
  }

  private _multiple: boolean;

  private _control: AbstractControl;


  constructor( private _elemento: ElementRef) {
    this.iniciarVariables();
  }

  iniciarVariables() {
    this.tipoArchivoRestriccion = ['application/vnd.ms-excel', 'text/csv', '.csv', 'text/comma-separated-values'];
    this.verificarTamanio = true;
    this.maximoTamanio = 2097152;
    this.minimoTamanio = 1;
    this.mensajeErrorTamanio = 'mensajeErrorArchivoTamanio';
    this.mensajeErrorTipo = 'mensajeErrorArchivoTipo';
    this._multiple = false;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this._control) {
      this._control = control;
    }
    this._control.setErrors({});
    return this._control.errors;
  }

  @HostListener('change', ['$event.target'])
  public onChange(eventTarget): void {
    const value: File|FileList|undefined = this.obtenerArchivo(eventTarget);
    this.validarArchivo(value);
  }

  private obtenerArchivo(eventTarget): File|FileList|undefined {
    return this.multiple ? eventTarget.archivos : eventTarget.files.item(0);
  }

  private validarArchivo(value: File|FileList|undefined): void {
    const errors: ValidationErrors = {};
    if (!this.tieneValidadorTipo(value)) {
      errors.tipo = this.mensajeErrorTipo;
    } else {
      if (this._control.hasError('tipo')) {
        delete errors.tipo;
      }
    }
    if (this.verificarTamanio) {
      if (!this.tieneValidadorTamanio(value)) {
        errors.tamanio = this.mensajeErrorTamanio;
      } else {
        if (this._control.hasError('tamanio')) {
          delete errors.tamanio;
        }
      }
    }
    this._control.setErrors(Object.keys(errors).length ? errors : null);
  }

  private tieneValidadorTamanio(value: File|FileList|undefined): boolean {
    let valid = true;
    if (value) {
      if (this.multiple && !!(value as FileList).length) {
        value = value as FileList;
        const length = value.length;
        for (let i = 0; i < length; i++) {
          const file: File = value.item(i);
          if (!this.validarTamanioArchivo(file)) {
            valid = false;
            break;
          }
        }
      } else {
        valid = this.validarTamanioArchivo(value as File|undefined);
      }
    }
    return valid;
  };

  private validarTamanioArchivo(value: File|undefined): boolean {
    let valid = true;
    if (value) {
      const isMin = value.size >= this.minimoTamanio;
      const isMax = value.size <= this.maximoTamanio;
      valid = isMin && isMax;
    }
    return valid;
  }


  private tieneValidadorTipo(value: File|FileList|undefined): boolean {
    let valid = true;
    if (value) {
      if (this.multiple && !!(value as FileList).length) {
        value = value as FileList;
        for (let i = 0; i < value.length; i++) {
          const file: File = value.item(i);
          if (!this.validadorTipo(file)) {
            valid = false;
            break;
          }
        }
      } else {
        valid = this.validadorTipo(value as File|undefined);
      }
    }
    return valid;
  };

  private validadorTipo(value: File|undefined): boolean {
    let valid = true;
    if (value) {
      if (this.tipoArchivoRestriccion instanceof RegExp) {
        valid = this.tipoArchivoRestriccion.test(value.type);
      } else if (typeof this.tipoArchivoRestriccion === 'string') {
        valid = this.tipoArchivoRestriccion === value.type;
      } else if (Array.isArray(this.tipoArchivoRestriccion)) {
        valid = this.tipoArchivoRestriccion.includes(value.type);
      }
    }
    return valid;
  }
}
