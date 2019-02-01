import { BaseModel } from './_base.model';

export class Address extends BaseModel {

  id: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  town: string;

  clear() {
    this.addressLine1 = '';
    this.addressLine2 = '';
    this.city = '';
    this.town = '';
  }

}
