import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Page } from '../models/page';
import { Employee } from '../models/employee'

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private BASE_URL = environment.baseUrl;

  // EmployeeRequest URLs
  private ALL_EMPLOYEES_URL = `${this.BASE_URL}/employees`;
  private EMPLOYEE_CREATE_URL = `${this.BASE_URL}/employees`;
  private EMPLOYEE_URL = `${this.BASE_URL}/employees/`;

  lastFilter$: BehaviorSubject<HttpParams> = new BehaviorSubject(new HttpParams());

  constructor(private http: HttpClient) {
  }

  getAllEmployees(params: HttpParams): Observable<Page> {
    return this.http.get<Page>(this.ALL_EMPLOYEES_URL, { params });
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.EMPLOYEE_CREATE_URL, employee);
  }

  getEmployeeByEmployeeId(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(this.EMPLOYEE_URL + employeeId);
  }

  updateEmployee(updateEmployee: Employee): Observable<Employee> {
    return this.http.put<Employee>(this.EMPLOYEE_URL + updateEmployee.id, updateEmployee);
  }

  deleteEmployee(employeeId: number): Observable<Employee> {
    return this.http.delete<Employee>(this.EMPLOYEE_URL + employeeId);
  }
}
