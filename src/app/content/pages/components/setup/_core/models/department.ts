import {BaseModel} from './_base.model';

export class Department extends BaseModel{

  id: number;
  name: string;
  description: string;

	clear() {
		this.name = '';
		this.description = '';
	}
}
