import {Component, Inject, OnInit} from '@angular/core';
import {Department} from '../../_core/models/department';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DepartmentService} from '../../_core/services/department.service';
import {TypesUtilsService} from '../../_core/utils/types-utils.service';

@Component({
  selector: 'm-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrls: ['./department-edit.component.scss']
})
export class DepartmentEditComponent implements OnInit {

	department: Department;
	departmentForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	constructor(public dialogRef: MatDialogRef<DepartmentEditComponent>,
				@Inject(MAT_DIALOG_DATA) public data: any,
				private fb: FormBuilder,
				private departmentService: DepartmentService,
				private typesUtilsService: TypesUtilsService) { }

	/** LOAD DATA */
	ngOnInit() {
		this.department = this.data.department;
		this.createForm();

		/* Server loading imitation. Remove this on real code */
		this.viewLoading = true;
		setTimeout(() => {
			this.viewLoading = false;
		}, 1000);
	}

	createForm() {
		this.departmentForm = this.fb.group({
			name: [this.department.name, Validators.required],
			description: [this.department.description]
		});
	}

	/** UI */
	getTitle(): string {
		if (this.department.id > 0) {
			return `Edit department '${this.department.name}'`;
		}

		return 'New department';
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.departmentForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */
	prepareDepartment(): Department {
		const controls = this.departmentForm.controls;
		const _department = new Department();
		_department.id = this.department.id;
		console.log('_department', _department);
		_department.name = controls['name'].value;
		_department.description = controls['description'].value;
		return _department;
	}

	onSubmit() {
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		const controls = this.departmentForm.controls;
		/** check form */
		if (this.departmentForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedDepartment = this.prepareDepartment();
		if (editedDepartment.id > 0) {
			this.updateDepartment(editedDepartment);
		} else {
			this.createDepartment(editedDepartment);
		}
	}

	updateDepartment(_department: Department) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.departmentService.updateDepartment(_department).subscribe(res => {
			/* Server loading imitation. Remove this on real code */
			this.viewLoading = false;
			this.dialogRef.close({
				_department,
				isEdit: true
			});
		});
	}

	createDepartment(_department: Department) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.departmentService.createDepartment(_department).subscribe(res => {
			this.viewLoading = false;
			this.dialogRef.close({
				_department,
				isEdit: false
			});
		});
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

}
