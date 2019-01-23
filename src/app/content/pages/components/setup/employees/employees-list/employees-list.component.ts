import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EmployeesDatasource } from '../../_core/models/data-sources/employees.datasource'
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Employee } from '../../_core/models/employee';
import { ActivatedRoute } from '@angular/router';
import { LayoutUtilsService, MessageType } from '../../_core/utils/layout-utils.service';
import { EmployeeService } from '../../_core/services/employee.service';
import { merge, fromEvent } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubheaderService } from '../../../../../../core/services/layout/subheader.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'm-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent implements OnInit {

  // Table fields
  dataSource: EmployeesDatasource;
  displayedColumns = ['select', 'Id', 'firstName', 'lastName', 'email', 'gender', 'dateOfBirth', 'designation', 'department', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput') searchInput: ElementRef;
  filterStatus: string = '';
  filterCondition: string = '';
  // Selection
  selection = new SelectionModel<Employee>(true, []);
  employeesResult: Employee[] = [];

  constructor(private employeeService: EmployeeService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService) { }

  /** LOAD DATA */
  ngOnInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadEmployeesList();
        })
      )
      .subscribe();

    // Filtration, bind to searchInput
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadEmployeesList();
        })
      )
      .subscribe();

    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Employees');
    // Init DataSource
    this.dataSource = new EmployeesDatasource(this.employeeService);
    let queryParams = new HttpParams().set('page', this.paginator.pageIndex.toString());
    // Read from URL itemId, for restore previous state
    this.route.queryParams.subscribe(params => {
      if (params.id) {
        queryParams = this.employeeService.lastFilter$.getValue();
        this.restoreState(queryParams, +params.id);
      }
      // First load
      this.dataSource.loadEmployees(queryParams);
    });
    this.dataSource.entitySubject.subscribe(res => this.employeesResult = res);
  }

  loadEmployeesList() {
    this.selection.clear();
    const params = new HttpParams()
      .set('page', this.paginator.pageIndex.toString())
      .set('size', this.paginator.pageSize.toString())
      .set('sort', this.sort.active + ',' + this.sort.direction)
      .set('firstName', this.searchInput.nativeElement.value)
      .set('lastName', this.searchInput.nativeElement.value)
      .set('email', this.searchInput.nativeElement.value);
    this.dataSource.loadEmployees(params);
  }

  restoreState(queryParams: HttpParams, id: number) {
    if (id > 0) {
      this.employeeService.getEmployeeByEmployeeId(id).subscribe((res: Employee) => {
        const message = res._createdDate === res._updatedDate ?
          `New employee successfully has been added.` :
          `Employee successfully has been saved.`;
        this.layoutUtilsService.showActionNotification(message, res._isNew ? MessageType.Create : MessageType.Update, 10000, true, false);
      });
    }

    // if (!queryParams.filter) {
    //   return;
    // }

    // if ('condition' in queryParams.filter) {
    //   this.filterCondition = queryParams.filter.condition.toString();
    // }

    // if ('status' in queryParams.filter) {
    //   this.filterStatus = queryParams.filter.status.toString();
    // }

    // if (queryParams.filter.model) {
    //   this.searchInput.nativeElement.value = queryParams.filter.model;
    // }
  }

  /** ACTIONS */
  /** Delete */
  deleteEmployee(_item: Employee) {
    const _title: string = 'Employee Delete';
    const _description: string = 'Are you sure to permanently delete this employee?';
    const _waitDesciption: string = 'Employee is deleting...';
    const _deleteMessage = `Employee has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.employeeService.deleteEmployee(_item.id).subscribe(() => {
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.loadEmployeesList();
      });
    });
  }

  /** SELECTION */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.employeesResult.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.employeesResult.forEach(row => this.selection.select(row));
    }
  }

  getEmployeeFullName(firstName: string = '', lastName: string = ''): string {
    return firstName + lastName;
  }

}
