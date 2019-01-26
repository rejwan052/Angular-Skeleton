import { BaseModel } from './_base.model';

export class Department extends BaseModel {

	id: number;
	name: string;
	description: string;

	constructor(public _id?: number, public _name?: string) {
		super();
	}

	clear() {
		this.name = '';
		this.description = '';
	}
}
