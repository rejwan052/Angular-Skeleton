import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { Page } from '../models/page';
import { Employee } from '../models/employee'
import { Address } from '../models/address';

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

  getEmployeeAddressByEmployeeId(employeeId: number): Observable<Address[]> {
    return this.http.get<Address[]>(this.EMPLOYEE_URL + employeeId + '/address');
  }

  getEmployeeAndAddress(employeeId: number): Observable<any[]> {
    let employeeResponse = this.http.get(this.EMPLOYEE_URL + employeeId);
    let addressResponse = this.http.get(this.EMPLOYEE_URL + employeeId + '/address');
    return forkJoin([employeeResponse, addressResponse]);
  }

}
