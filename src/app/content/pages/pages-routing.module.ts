import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PagesComponent} from './pages.component';
import {ActionComponent} from './header/action/action.component';
import {NgxPermissionsGuard} from 'ngx-permissions';
import {ProfileComponent} from './header/profile/profile.component';
import {ErrorPageComponent} from './snippets/error-page/error-page.component';
import {InnerComponent} from './components/inner/inner.component';

const routes: Routes = [
	{
		path: '',
		component: PagesComponent,
		// Remove comment to enable login
		canActivate: [NgxPermissionsGuard],
		data: {
			permissions: {
				only: ['ADMIN', 'USER'],
				except: ['GUEST'],
				redirectTo: '/login'
			}
		},
		children: [
			{
				path: '',
				loadChildren: './components/dashboard/dashboard.module#DashboardModule'
			},
			/*{
				path: 'builder',
				loadChildren: './builder/builder.module#BuilderModule'
			},*/
			{
				path: 'setup',
				loadChildren: './components/setup/setup.module#SetupModule'
			},
			{
				path: 'header/actions',
				component: ActionComponent
			},
			{
				path: 'profile',
				component: ProfileComponent
			},
			{
				path: 'inner',
				component: InnerComponent
			},
		]
	},
	{
		path: 'login',
		canActivate: [NgxPermissionsGuard],
		loadChildren: './auth/auth.module#AuthModule',
		data: {
			permissions: {
				except: 'ADMIN'
			}
		},
	},
	{
		path: '404',
		component: ErrorPageComponent
	},
	{
		path: 'error/:type',
		component: ErrorPageComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PagesRoutingModule {
}
