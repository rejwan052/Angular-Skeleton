import { of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { BaseDataSource } from './_base.datasource';
import { EmployeeService } from '../../services/employee.service';
import { HttpParams } from '@angular/common/http';
import { Page } from '../page';

export class EmployeesDatasource extends BaseDataSource {
    constructor(private employeeService: EmployeeService) {
        super();
    }

    loadEmployees(params: HttpParams) {
        this.loadingSubject.next(true);
        this.employeeService.getAllEmployees(params).pipe(
            tap(res => {
                this.entitySubject.next(res.content);
                this.paginatorTotalSubject.next(res.totalElements);
            }),
            catchError(err => of(new Page([], err))),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe();
    }
}
