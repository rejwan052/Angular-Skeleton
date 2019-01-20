import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatPaginator, MatSnackBar, MatSort } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// Services
import { DepartmentService } from '../../_core/services/department.service';
import { LayoutUtilsService, MessageType } from '../../_core/utils/layout-utils.service';
// Models
import { DepartmentsDatasource } from '../../_core/models/data-sources/departments.datasource';
import { Department } from '../../_core/models/department';
import { HttpParams } from '@angular/common/http';
import { DepartmentEditComponent } from '../department-edit/department-edit.component';


@Component({
	selector: 'm-departments-list',
	templateUrl: './departments-list.component.html',
	styleUrls: ['./departments-list.component.scss']
})
export class DepartmentsListComponent implements OnInit {

	// Table fields
	dataSource: DepartmentsDatasource;
	displayedColumns = ['select', 'id', 'name', 'description', 'actions'];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput') searchInput: ElementRef;
	filterStatus: string = '';
	filterType: string = '';
	// Selection
	selection = new SelectionModel<Department>(true, []);
	departmentsResult: Department[] = [];

	constructor(private departmentsService: DepartmentService,
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService) { }

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
					this.loadDepartmentsList();
				})
			)
			.subscribe();

		// Filtration, bind to searchInput
		fromEvent(this.searchInput.nativeElement, 'keyup')
			.pipe(
				// tslint:disable-next-line:max-line-length
				debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
				distinctUntilChanged(), // This operator will eliminate duplicate values
				tap(() => {
					this.paginator.pageIndex = 0;
					this.loadDepartmentsList();
				})
			)
			.subscribe();

		// Init DataSource
		const params = new HttpParams().set('page', this.paginator.pageIndex.toString());
		this.dataSource = new DepartmentsDatasource(this.departmentsService);
		// First load
		this.dataSource.loadDepartments(params);
		this.dataSource.entitySubject.subscribe(res => (this.departmentsResult = res));
	}

	loadDepartmentsList() {
		this.selection.clear();
		const params = new HttpParams()
			.set('page', this.paginator.pageIndex.toString())
			.set('size', this.paginator.pageSize.toString())
			.set('sort', this.sort.active + ',' + this.sort.direction)
			.set('name', this.searchInput.nativeElement.value)
			.set('description', this.searchInput.nativeElement.value);
		this.dataSource.loadDepartments(params);
		this.selection.clear();
	}

	/** Add */
	addDepartment() {
		const newDepartment = new Department();
		newDepartment.clear(); // Set all defaults fields
		this.editDepartment(newDepartment);
	}

	/** Edit */
	editDepartment(department: Department) {
		let saveMessageTranslateParam = 'SETUP.DEPARTMENTS.EDIT.';
		saveMessageTranslateParam += department.id > 0 ? 'UPDATE_MESSAGE' : 'ADD_MESSAGE';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = department.id > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(DepartmentEditComponent, { data: { department } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, false);
			this.loadDepartmentsList();
		});
	}

	/** ACTIONS */
	/** Delete */
	deleteDepartment(department: Department) {
		const _title: string = this.translate.instant('SETUP.DEPARTMENTS.DELETE_DEPARTMENT_SIMPLE.TITLE');
		const _description: string = this.translate.instant('SETUP.DEPARTMENTS.DELETE_DEPARTMENT_SIMPLE.DESCRIPTION');
		const _waitDesciption: string = this.translate.instant('SETUP.DEPARTMENTS.DELETE_DEPARTMENT_SIMPLE.WAIT_DESCRIPTION');
		const _deleteMessage = this.translate.instant('SETUP.DEPARTMENTS.DELETE_DEPARTMENT_SIMPLE.MESSAGE');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.departmentsService.deleteDepartment(department.id).subscribe(() => {
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.loadDepartmentsList();
			});
		});
	}

	/** SELECTION */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.departmentsResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.departmentsResult.length) {
			this.selection.clear();
		} else {
			this.departmentsResult.forEach(row => this.selection.select(row));
		}
	}



}
