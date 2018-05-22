import {FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {LeyendaComprobante} from '../../models/leyendaComprobante';
import {TranslateService} from '@ngx-translate/core';
import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
@Injectable()
export class ValidadorPersonalizado {

  static fechaDeberiaSerMenorEmisionVencimiento(fechaInicialString: string, fechaFinalString: string, nombreError: string): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors => {
      const fechaInicialParseada = formGroup.controls[fechaInicialString].value.split('/');
      const fechaFinalParseada = formGroup.controls[fechaFinalString].value.split('/');
      return this.compararFechasEmisionVencimiento(fechaInicialParseada, nombreError, fechaFinalParseada);
    };
  }

  static compararFechasEmisionVencimiento(fechaInicialParseada: string[], nombreError: string, fechaFinalParseada?: string[]): ValidationErrors {
    const errores: ValidationErrors = {};
    const tamanioFechaFinal = fechaFinalParseada ? fechaFinalParseada.length : 3;
    if (fechaInicialParseada.length === 3 && tamanioFechaFinal === 3) {
      const fechaInicial = new Date(Number(fechaInicialParseada[2]), Number(fechaInicialParseada[1]) - 1, Number(fechaInicialParseada[0]));
      let fechaFinal = new Date();
      if (fechaFinalParseada) {
        fechaFinal = new Date(Number(fechaFinalParseada[2]), Number(fechaFinalParseada[1]) - 1, Number(fechaFinalParseada[0]));
      }
      if (fechaInicial > fechaFinal) {
        if (fechaFinalParseada) {
          errores[nombreError] = 'fechaEmisionDeberiaSerMenorALaFechaVencimiento';
        } else {
          errores[nombreError] = 'fechaDeberiaSerMenorALaFechaEmision';
        }
        return errores;
      } else {
        return null;
      }
    } else {
      errores[nombreError] = '';
      return errores;
    }
  }

  static fechaDeberiaSerMenor(fechaInicialString: string, fechaFinalString: string, nombreError: string): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors => {
      const fechaInicialParseada = formGroup.controls[fechaInicialString].value.split('/');
      const fechaFinalParseada = formGroup.controls[fechaFinalString].value.split('/');
      return this.compararFechas(fechaInicialParseada, nombreError, fechaFinalParseada);
    };
  }

  static compararFechas(fechaInicialParseada: string[], nombreError: string, fechaFinalParseada?: string[]): ValidationErrors {
    const errores: ValidationErrors = {};
    const tamanioFechaFinal = fechaFinalParseada ? fechaFinalParseada.length : 3;
    if (fechaInicialParseada.length === 3 && tamanioFechaFinal === 3) {
      const fechaInicial = new Date(Number(fechaInicialParseada[2]), Number(fechaInicialParseada[1]) - 1, Number(fechaInicialParseada[0]));
      let fechaFinal = new Date();
      if (fechaFinalParseada) {
        fechaFinal = new Date(Number(fechaFinalParseada[2]), Number(fechaFinalParseada[1]) - 1, Number(fechaFinalParseada[0]));
      }
      if (fechaInicial > fechaFinal) {
        if (fechaFinalParseada) {
          errores[nombreError] = 'fechaInicialDeberiaSerMenorALaFechaFinal';
        } else {
          errores[nombreError] = 'fechaDeberiaSerMenorALaFechaActual';
        }
        return errores;
      } else {
        return null;
      }
    } else {
      errores[nombreError] = '';
      return errores;
    }
  }
  static validarFechaEmision (nombreError: string, translateService: TranslateService, datePipe: DatePipe): ValidatorFn {
    return (formControl: FormControl): ValidationErrors => {
      const fechaEmisionParseada = formControl.value.split('/');
      const fechaMaximo = new Date();
      const fechaMinimo = new Date(
        fechaMaximo.getFullYear(), fechaMaximo.getMonth(), fechaMaximo.getDate() - 2,
        fechaMaximo.getHours(), fechaMaximo.getMinutes(), fechaMaximo.getSeconds(), fechaMaximo.getMilliseconds());
      const fechaEmison = new Date(
        fechaEmisionParseada[2], Number(fechaEmisionParseada[1]) - 1, fechaEmisionParseada[0],
        fechaMaximo.getHours(), fechaMaximo.getMinutes(), fechaMaximo.getSeconds(), fechaMaximo.getMilliseconds());
      const esMenor = fechaEmison <= fechaMaximo;
      const esMayor = fechaEmison >= fechaMinimo;
      const errores: ValidationErrors = {};
      if ( esMenor && esMayor ) {
        return null;
      } else {
        let mensaje = '';
        let fechaMensaje = null;
        if (!esMenor) {
          mensaje = 'fechaDebeSerMenorIgual';
          fechaMensaje = fechaMaximo;
        } else {
          if (!esMayor) {
            mensaje = 'fechaDebeSerMayorIgual';
            fechaMensaje = fechaMinimo;
          }
        }
        translateService.get('emision').take(1).subscribe(
          emision => {
            translateService.get(mensaje, {nombreCampo: emision, fecha: datePipe.transform(fechaMensaje, 'dd/MM/yyyy')}).take(1).subscribe(
              data => {
                errores[nombreError] = data;
              }
            );
          }
        );
        return errores;
      }
    };
  }

  static fechaDeberiaSerMenorAHoy(nombreError: string): ValidatorFn {
    return (formControl: FormControl): ValidationErrors => {
      const fechaInicialParseada = formControl.value.split('/');
      return this.compararFechas(fechaInicialParseada, nombreError);
    };
  }
  static fechaDeberiaSerMayorAHoy(nombreError: string): ValidatorFn {
    return (formControl: FormControl): ValidationErrors => {
      const fechaInicialParseada = formControl.value.split('/');
      return this.compararFechas(fechaInicialParseada, nombreError);
    };
  }

  static formGroupAsyncMenorQue(nombreControl: string , leyenda: BehaviorSubject<LeyendaComprobante>, atributoLeyenda: string,
                                validarCero: boolean = false, tipoNota: BehaviorSubject<string> = new BehaviorSubject('-1'),
                                nombresNotaLista: string[] = []): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors => {
      const errores: ValidationErrors = {};
      const numero1 = Number(formGroup.controls[nombreControl].value);
      const numero2 = Number(leyenda.value[atributoLeyenda]);
      const esCorrectoTipo = nombresNotaLista.includes(tipoNota.value);
      if (formGroup.controls[nombreControl].disabled) {
        return null;
      }
      if (esCorrectoTipo) {
        if (validarCero) {
          if (numero1 <= 0) {
            errores[nombreControl + 'MayorQue'] = 'debeSerMayorA';
            errores['valor' + nombreControl + 'MayorQue'] = '0.00';
            return errores;
          } else {
            if (numero1 < numero2) {
              return null;
            } else {
              errores[nombreControl + 'MenorQue'] = 'debeSerMenorA';
              errores['valor' + nombreControl + 'MenorQue'] = leyenda.value[atributoLeyenda];
              return errores;
            }
          }
        }
      } else {
        if (numero1 <= numero2 || numero1 === 0) {
          return null;
        } else {
          errores[nombreControl + 'MenorQue'] = 'debeSerMenorA';
          errores['valor' + nombreControl + 'MenorQue'] = leyenda.value[atributoLeyenda];
          return errores;
        }
      }
    };
  }

  static validarSelectForm(mensaje: string, valorComparar: any = '-1'): ValidatorFn {
    return (formControl: FormControl): ValidationErrors => {
      const errores: ValidationErrors = {};
      const valor = formControl.value;
      if (valor === valorComparar) {
        errores[mensaje] = mensaje;
        return errores;
      } else {
        return null;
      }
    };
  }
}
