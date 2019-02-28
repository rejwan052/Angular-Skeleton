import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../models/page';
import { Department } from '../models/department';

@Injectable({
	providedIn: 'root'
})
export class DepartmentService {

	private BASE_URL = environment.baseUrl;

	// Department URLs
	private ALL_DEPARTMENTS_URL = `${this.BASE_URL}/departments`;
	private CREATE_UPDATE_DEPARTMENT_URL = `${this.BASE_URL}/departments`;
	private DEPARTMENT_URL = `${this.BASE_URL}/departments/`;
	private DEPARTMENT_SEARCH_BY_NAME_URL = `${this.BASE_URL}/departments/search-by-name`;

	constructor(private http: HttpClient) { }

	getAllDepartments(params: HttpParams): Observable<Page> {
		return this.http.get<Page>(this.ALL_DEPARTMENTS_URL, { params });
	}

	getDepartments(term: string = null): Observable<Department[]> {
		const params = new HttpParams().set('searchTerm', term);
		return this.http.get<Department[]>(this.DEPARTMENT_SEARCH_BY_NAME_URL, { params });
	}

	createDepartment(department: Department): Observable<Department> {
		return this.http.post<Department>(this.CREATE_UPDATE_DEPARTMENT_URL, department);
	}

	getDepartmentByDepartmentId(departmentId: number): Observable<Department> {
		return this.http.get<Department>(this.DEPARTMENT_URL + departmentId);
	}

	updateDepartment(updateDepartment: Department): Observable<Department> {
		return this.http.put<Department>(this.DEPARTMENT_URL + updateDepartment.id, updateDepartment);
	}

	deleteDepartment(departmentId: number): Observable<Department> {
		return this.http.delete<Department>(this.DEPARTMENT_URL + departmentId);
	}
}
