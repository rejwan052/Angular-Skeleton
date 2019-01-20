import {Pageable} from './pageable';


export class Page {

    content: any[];
    totalPages: number = 0;
    totalElements: number = 0;
    last: boolean;
    size: number = 0;
    number:number;
    first: boolean;
    sort: string;
    numberOfElements: number;
    pageable: Pageable = new Pageable();
	errorMessage: string;

	constructor(_content: any[] = [], _errorMessage: string = '') {
		this.content = _content;
		this.totalElements = _content.length;
	}

}
