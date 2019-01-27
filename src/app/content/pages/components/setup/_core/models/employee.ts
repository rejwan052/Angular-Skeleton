import { Address } from "./address";
import { Designation } from "./designation";
import { Department } from "./department";
import { BaseModel } from './_base.model';

export class Employee extends BaseModel {

  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  gender: string;
  dateOfBirth: string;
  dob: Date;
  designation: Designation;
  department: Department;
  address: Address;

  clear() {
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.userName = '';
    this.gender = 'MALE';
    this.dob = new Date();
    this.department = null;
    this.designation = null;
    this.address = new Address();
  }

}
