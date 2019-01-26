import { BaseModel } from './_base.model';

export class Designation extends BaseModel {

  public id: number;
  public name: string;

  constructor(public _id?: number, public _name?: string) {
    super();
  }

  clear() {
    this.name = '';
  }

}
