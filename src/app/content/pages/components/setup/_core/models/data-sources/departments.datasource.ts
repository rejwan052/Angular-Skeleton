import {of} from 'rxjs';
import {catchError, finalize, tap} from 'rxjs/operators';
import {BaseDataSource} from './_base.datasource';
import {DepartmentService} from '../../services/department.service';
import {HttpParams} from '@angular/common/http';
import {Page} from '../page';

export class DepartmentsDatasource extends BaseDataSource {
	constructor(private departmentService: DepartmentService) {
		super();
	}

	loadDepartments(params: HttpParams) {
		this.loadingSubject.next(true);
		this.departmentService.getAllDepartments(params).pipe(
			tap(res => {
				this.entitySubject.next(res.content);
				this.paginatorTotalSubject.next(res.totalElements);
			}),
			catchError(err => of(new Page([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}
}
