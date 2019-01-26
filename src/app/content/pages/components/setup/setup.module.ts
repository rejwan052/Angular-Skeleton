import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SetupComponent } from './setup.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PartialsModule } from '../../../partials/partials.module';
import { TranslateModule } from '@ngx-translate/core';
// Core => Services
import { DepartmentService } from './_core/services/department.service';
// Core => Utils
import { HttpUtilsService } from './_core/utils/http-utils.service';
import { TypesUtilsService } from './_core/utils/types-utils.service';
import { LayoutUtilsService } from './_core/utils/layout-utils.service';
// Shared
import { ActionNotificationComponent } from './_shared/action-natification/action-notification.component';
import { DeleteEntityDialogComponent } from './_shared/delete-entity-dialog/delete-entity-dialog.component';
import { FetchEntityDialogComponent } from './_shared/fetch-entity-dialog/fetch-entity-dialog.component';
import { UpdateStatusDialogComponent } from './_shared/update-status-dialog/update-status-dialog.component';
import { AlertComponent } from './_shared/alert/alert.component';
// Material
import {
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatAutocompleteModule,
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
	MatIconModule,
	MatInputModule,
	MatMenuModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatSelectModule,
	MatSnackBarModule,
	MatSortModule,
	MatTableModule,
	MatTabsModule,
	MatTooltipModule
} from '@angular/material';

// Components
import { EmployeesListComponent } from './employees/employees-list/employees-list.component';
import { EmployeeEditComponent } from './employees/employee-edit/employee-edit.component';
import { DesignationsListComponent } from './designations/designations-list/designations-list.component';
import { DepartmentsListComponent } from './departments/departments-list/departments-list.component';
import { DepartmentEditComponent } from './departments/department-edit/department-edit.component';
import { DesignationEditComponent } from './designations/designation-edit/designation-edit.component';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from './_core/date.adapter';


const routes: Routes = [
	{
		path: '',
		component: SetupComponent,
		children: [
			{
				path: '',
				redirectTo: 'employees',
				pathMatch: 'full'
			},
			{
				path: 'employees',
				component: EmployeesListComponent
			},
			{
				path: 'designations',
				component: DesignationsListComponent
			},
			{
				path: 'departments',
				component: DepartmentsListComponent,
			},
			{
				path: 'employees/add',
				component: EmployeeEditComponent
			},
			{
				path: 'employees/edit',
				component: EmployeeEditComponent
			},
			{
				path: 'employees/edit/:id',
				component: EmployeeEditComponent
			},
		]
	}
];

@NgModule({
	imports: [
		MatDialogModule,
		CommonModule,
		HttpClientModule,
		PartialsModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
		MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatTabsModule,
		MatTooltipModule,
	],
	exports: [RouterModule],
	providers: [{
		provide: MAT_DIALOG_DEFAULT_OPTIONS,
		useValue: {
			hasBackdrop: true,
			panelClass: 'm-mat-dialog-container__wrapper',
			height: 'auto',
			width: '900px'
		}
	},
	{ provide: DateAdapter, useClass: AppDateAdapter },
	{ provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
		HttpUtilsService,
		DepartmentService,
		TypesUtilsService,
		LayoutUtilsService],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		DepartmentEditComponent,
		DesignationEditComponent
	],
	declarations: [
		SetupComponent,

		/*Employees*/
		EmployeesListComponent,
		EmployeeEditComponent,

		/*Designations*/
		DesignationsListComponent,
		DesignationEditComponent,

		/*Departments*/
		DepartmentsListComponent,
		DepartmentEditComponent,

		// Shared
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent
	]
})
export class SetupModule { }
