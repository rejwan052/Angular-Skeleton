import {Address} from './address';
import {Designation} from './designation';
import {Department} from './department';
import {BaseModel} from './_base.model';

export class Employee extends BaseModel {

  id: number = 0;
  email: string;
  firstName: string;
  lastName: string;
  fullName:	string;
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
    this.address = null;
  }

}
