export interface ILog {
	_userId: number; // user who did changes
	createdAt: string; // date when entity were created => format: 'mm/dd/yyyy'
	updatedAt: string; // date when changed were applied => format: 'mm/dd/yyyy'
}
