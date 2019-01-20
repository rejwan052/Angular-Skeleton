import { BaseModel } from './_base.model';

export class Designation extends BaseModel {

  public id: number;
  public name: string;

  clear() {
    this.name = '';
  }

}
