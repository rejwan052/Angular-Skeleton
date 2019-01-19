import { ConfigModel } from '../core/interfaces/config';

export class PagesConfig implements ConfigModel {
	public config: any = {};

	constructor() {
		this.config = {
			'/': {
				page: {
					title: 'Dashboard',
					desc: 'Latest updates and statistic charts'
				}
			},
/*			builder: {
				page: { title: 'Layout Builder', desc: 'Layout builder' }
			},
			header: {
				actions: {
					page: { title: 'Actions', desc: 'actions example page' }
				}
			},*/
			profile: {
				page: { title: 'User Profile', desc: '' }
			},
			setup: {
				employees: {
					page: { title: 'Employees', desc: '' }
				},
				designations: {
					page: { title: 'Designations', desc: '' }
				},
				departments: {
					page: { title: 'Departments', desc: '' }
				}
			},
			404: {
				page: { title: '404 Not Found', desc: '', subheader: false }
			}
		};
	}
}
