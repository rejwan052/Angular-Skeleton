import { of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { BaseDataSource } from './_base.datasource';
import { DesignationService } from '../../services/designation.service';
import { HttpParams } from '@angular/common/http';
import { Page } from '../page';

export class DesignationsDatasource extends BaseDataSource {
    constructor(private designationService: DesignationService) {
        super();
    }

    loadDesignations(params: HttpParams) {
        this.loadingSubject.next(true);
        this.designationService.getAllDesignations(params).pipe(
            tap(res => {
                this.entitySubject.next(res.content);
                this.paginatorTotalSubject.next(res.totalElements);
            }),
            catchError(err => of(new Page([], err))),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe();
    }
}
