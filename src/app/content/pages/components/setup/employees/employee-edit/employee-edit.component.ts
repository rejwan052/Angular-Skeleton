import {Component, OnInit} from '@angular/core';
import {Employee} from '../../_core/models/employee';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeService} from '../../_core/services/employee.service';
import {TypesUtilsService} from '../../_core/utils/types-utils.service';
import {MatDialog} from '@angular/material';
import {SubheaderService} from '../../../../../../core/services/layout/subheader.service';
import {LayoutUtilsService, MessageType} from '../../_core/utils/layout-utils.service';
import {Designation} from '../../_core/models/designation';
import {Department} from '../../_core/models/department';
import {DepartmentService} from '../../_core/services/department.service';
import {DesignationService} from '../../_core/services/designation.service';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {HttpParams} from '@angular/common/http';
import {Address} from '../../_core/models/address';
import {EmailValidators} from '../../validators/email.validators';

@Component({
  selector: 'm-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit {

  employee: Employee;
  oldEmployee: Employee;

  address: Address;
  oldAddess: Address;

  selectedTab: number = 0;
  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  employeeForm: FormGroup;
  hasFormErrors: boolean = false;

  // Designations Auto Complete
  filteredDesignations: Designation[];
  isDesignationLoading = false;

  // Departments Auto Complete
  filteredDepartments: Department[];
  isDepartmentLoading = false;


  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private typesUtilsService: TypesUtilsService,
    private employeeFB: FormBuilder,
    public dialog: MatDialog,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private departmentService: DepartmentService,
    private designationService: DesignationService) { }

  ngOnInit() {
    this.loadingSubject.next(true);
    this.activatedRoute.queryParams.subscribe(params => {
      const id = +params.id;
      if (id && id > 0) {
        this.employeeService.getEmployeeAndAddress(id).subscribe(results => {
          console.log(' fork employee results ', results[0], ' fork address results ', results[1]);
          this.employee = results[0];
          this.oldEmployee = Object.assign({}, results[0]);
          if (results[1].length > 0) {
            this.address = results[1][0];
            this.oldAddess = Object.assign({}, results[1][0]);
            console.log(' Employee Address::: ', this.address);
          } else {
            const newAddress = new Address();
            newAddress.clear();
            this.address = newAddress;
            this.oldAddess = Object.assign({}, newAddress);
          }
          this.initEmployee();
        });
      } else {
        const newEmployee = new Employee();
        newEmployee.clear();
        this.employee = newEmployee;
        this.oldEmployee = Object.assign({}, newEmployee);

        const newAddress = new Address();
        newAddress.clear();
        this.address = newAddress;
        this.oldAddess = Object.assign({}, newAddress);

        this.initEmployee();
      }
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.employeeForm.controls; }


  initEmployee() {
    this.createForm();
    this.loadingSubject.next(false);
    if (!this.employee.id) {
      this.subheaderService.setBreadcrumbs([
        { title: 'Setup', page: '/setup' },
        { title: 'Employees', page: '/setup/employees' },
        { title: 'Create employee', page: '/setup/employees/add' }
      ]);
      return;
    }
    this.subheaderService.setTitle('Edit product');
    this.subheaderService.setBreadcrumbs([
      { title: 'Setup', page: '/setup' },
      { title: 'Employees', page: '/setup/employees' },
      { title: 'Edit employee', page: '/setup/employees/edit', queryParams: { id: this.employee.id } }
    ]);
  }

  createForm() {

    if (this.employee.dateOfBirth) {
      this.employee.dob = this.typesUtilsService.getDateFromISOString();
      console.log('employee dob ', this.employee.dob);
    }

    this.employeeForm = this.employeeFB.group({
      firstName: [this.employee.firstName, Validators.required],
      lastName: [this.employee.lastName],
      email: [this.employee.email,
      [Validators.required, Validators.email, EmailValidators.connotContainSpace],
      EmailValidators.checkEmailExists(this.employeeService, this.employee.id.toString())],
      gender: [this.employee.gender, [Validators.required, Validators.min(0), Validators.max(1)]],
      dob: [this.employee.dob, Validators.nullValidator],
      designation: [this.employee.designation, Validators.required],
      department: [this.employee.department, Validators.required],
      addressLine1: [this.address.addressLine1],
      addressLine2: [this.address.addressLine2],
      city: [this.address.city],
      town: [this.address.town]
    });

    this.searchDesignations();
    this.searchDepartments();

  }

  goBack(id = 0) {
    let _backUrl = 'setup/employees';
    if (id > 0) {
      _backUrl += '?id=' + id;
    }
    this.router.navigateByUrl(_backUrl);
  }

  refreshEmployee(id = 0) {
    const _refreshUrl = 'setup/employees/edit?id=' + id;
    this.router.navigateByUrl(_refreshUrl);
  }

  reset() {
    this.employee = Object.assign({}, this.oldEmployee);
    this.createForm();
    this.hasFormErrors = false;
    this.employeeForm.markAsPristine();
    this.employeeForm.markAsUntouched();
    this.employeeForm.updateValueAndValidity();
  }

  getComponentTitle() {
    let result = 'Create employee';
    if (!this.employee || !this.employee.id) {
      return result;
    }

    result = `Edit employee - ${this.employee.fullName}`;
    return result;
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  private searchDesignations() {
    this.employeeForm
      .get('designation')
      .valueChanges
      .pipe(
        debounceTime(500),
        tap(() => this.isDesignationLoading = true),
        switchMap(searchTerm => this.designationService.getAllDesignations(new HttpParams().set('name', searchTerm))
          .pipe(finalize(() => this.isDesignationLoading = false))
        )
      )
      .subscribe(res => {
        // console.log(" Designation search result ", res.content);
        this.filteredDesignations = res.content;
      },
        err => {
          console.log('Error occurred while get searching designations.');
        });
  }

  displayDesignation(designation: Designation) {
    if (designation) { return designation.name; }
  }

  private searchDepartments() {
    this.employeeForm
      .get('department')
      .valueChanges
      .pipe(
        debounceTime(500),
        tap(() => this.isDepartmentLoading = true),
        switchMap(searchTerm => this.departmentService.getAllDepartments(new HttpParams().set('name', searchTerm))
          .pipe(finalize(() => this.isDepartmentLoading = false))
        )
      )
      .subscribe(res => {
        // console.log(" Department search result ", res.content);
        this.filteredDepartments = res.content;
      },
        err => {
          console.log('Error occurred while get searching departments.');
        });
  }

  displayDepartment(department: Department) {
    if (department) { return department.name; }
  }

  // Employee form submit
  onSumbit(withBack: boolean = false) {
    this.hasFormErrors = false;
    const controls = this.employeeForm.controls;
    /** check form */
    if (this.employeeForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      this.selectedTab = 0;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let editedEmployee = this.prepareEmployee();

    if (editedEmployee.id > 0) {
      this.updateEmployee(editedEmployee, withBack);
      return;
    }
    this.addEmployee(editedEmployee, withBack);
  }

  prepareEmployee(): Employee {

    const controls = this.employeeForm.controls;
    const _employee = new Employee();

    _employee.id = this.employee.id;
    _employee.firstName = controls['firstName'].value;
    _employee.lastName = controls['lastName'].value;
    _employee.email = controls['email'].value;
    _employee.gender = controls['gender'].value;
    _employee.designation = controls['designation'].value;
    _employee.department = controls['department'].value;

    const _address = new Address();
    _address.id = this.address.id;
    _address.addressLine1 = controls['addressLine1'].value;
    _address.addressLine2 = controls['addressLine2'].value;
    _address.town = controls['town'].value;
    _address.city = controls['city'].value;

    _employee.address = _address;

    const _date = controls['dob'].value;
    if (_date) {
      _employee.dateOfBirth = _date.toISOString();
    } else {
      _employee.dateOfBirth = '';
    }
    console.log('_employee date of birth', _employee.dateOfBirth);
    _employee.updatedAt = this.typesUtilsService.getDateStringFromDate();
    _employee.createdAt = this.employee.id > 0 ? _employee.createdAt : _employee.updatedAt;
    _employee._isNew = this.employee.id > 0 ? false : true;
    _employee._isUpdated = this.employee.id > 0;

    return _employee;
  }

  addEmployee(_employee: Employee, withBack: boolean = false) {
    this.loadingSubject.next(true);
    this.employeeService.createEmployee(_employee).subscribe(res => {
      this.loadingSubject.next(false);
      if (withBack) {
        this.goBack(res.id);
      } else {
        const message = `New employee successfully has been added.`;
        this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, false);
        this.refreshEmployee(res.id);
      }
    });
  }

  updateEmployee(_employee: Employee, withBack: boolean = false) {
    this.loadingSubject.next(true);
    // Update Employee
    // tslint:disable-next-line:prefer-const
    let tasks$ = [this.employeeService.updateEmployee(_employee)];

    forkJoin(tasks$).subscribe(res => {
      this.loadingSubject.next(false);
      if (withBack) {
        this.goBack(_employee.id);
      } else {
        const message = `Employee successfully has been saved.`;
        this.layoutUtilsService.showActionNotification(message, MessageType.Update, 10000, true, false);
        this.refreshEmployee(_employee.id);
      }
    });
  }


}
