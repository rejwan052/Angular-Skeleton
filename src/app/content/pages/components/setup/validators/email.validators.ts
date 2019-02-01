import { AbstractControl, ValidationErrors } from '@angular/forms'
import { Observable, timer, of } from 'rxjs';
import { EmployeeService } from '../_core/services/employee.service';
import { switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export class EmailValidators {

    static connotContainSpace(control: AbstractControl): ValidationErrors | null {
        if ((control.value as string).indexOf(' ') >= 0)
            return { connotContainSpace: true }
        return null;
    }

    static checkEmailExists(employeeService: EmployeeService, employeeId: string) {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return timer(100).pipe(
                switchMap(() => {
                    if (!control.value) {
                        return of(null)
                    }
                    return employeeService.checkEmailExists(control.value, employeeId).pipe(
                        map(result => (result ? { duplicateEmail: true } : null))
                    );
                })
            )
        }
    }


}