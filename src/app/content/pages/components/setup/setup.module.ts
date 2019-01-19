import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { SetupComponent } from './setup.component';
import { EmployeesListComponent } from './employees/employees-list/employees-list.component';
import { DesignationsListComponent } from './designations/designations-list/designations-list.component';
import { DepartmentsListComponent } from './departments/departments-list/departments-list.component';

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
			}
		]
	}
];

@NgModule({
  imports: [
    CommonModule,
	RouterModule.forChild(routes),
  ],
  declarations: [
  	SetupComponent,
	  /*Employees*/
	EmployeesListComponent,
	  /*Designations*/
	DesignationsListComponent,
	  /*Departments*/
	DepartmentsListComponent]
})
export class SetupModule { }
