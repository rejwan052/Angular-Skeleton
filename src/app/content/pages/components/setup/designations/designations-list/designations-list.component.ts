import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatPaginator, MatSnackBar, MatSort } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// Services
import { DesignationService } from '../../_core/services/designation.service';
import { LayoutUtilsService, MessageType } from '../../_core/utils/layout-utils.service';
// Models
import { DesignationsDatasource } from '../../_core/models/data-sources/designations.datasource';
import { Designation } from '../../_core/models/designation';
import { HttpParams } from '@angular/common/http';
import { DesignationEditComponent } from '../designation-edit/designation-edit.component';

@Component({
  selector: 'm-designations-list',
  templateUrl: './designations-list.component.html',
  styleUrls: ['./designations-list.component.scss']
})
export class DesignationsListComponent implements OnInit {

  // Table fields
  dataSource: DesignationsDatasource;
  displayedColumns = ['select', 'id', 'name', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput') searchInput: ElementRef;
  filterStatus: string = '';
  filterType: string = '';
  // Selection
  selection = new SelectionModel<Designation>(true, []);
  designationsResult: Designation[] = [];

  constructor(private designationsService: DesignationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService) { }

  /** LOAD DATA */
  ngOnInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadDesignationsList();
        })
      )
      .subscribe();

    // Filtration, bind to searchInput
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        // tslint:disable-next-line:max-line-length
        debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
        distinctUntilChanged(), // This operator will eliminate duplicate values
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadDesignationsList();
        })
      )
      .subscribe();

    // Init DataSource
    const params = new HttpParams().set('page', this.paginator.pageIndex.toString());
    this.dataSource = new DesignationsDatasource(this.designationsService);
    // First load
    this.dataSource.loadDesignations(params);
    this.dataSource.entitySubject.subscribe(res => (this.designationsResult = res));
  }

  loadDesignationsList() {
    this.selection.clear();
    const params = new HttpParams()
      .set('page', this.paginator.pageIndex.toString())
      .set('size', this.paginator.pageSize.toString())
      .set('sort', this.sort.active + ',' + this.sort.direction)
      .set('name', this.searchInput.nativeElement.value);
    this.dataSource.loadDesignations(params);
  }

  /** Add */
  addDesignation() {
    const newDesignation = new Designation();
    newDesignation.clear(); // Set all defaults fields
    this.editDesignation(newDesignation);
  }

  /** Edit */
  editDesignation(designation: Designation) {
    let saveMessageTranslateParam = 'SETUP.DESIGNATIONS.EDIT.';
    saveMessageTranslateParam += designation.id > 0 ? 'UPDATE_MESSAGE' : 'ADD_MESSAGE';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = designation.id > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(DesignationEditComponent, { data: { designation } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, false);
      this.loadDesignationsList();
    });
  }

  /** ACTIONS */
  /** Delete */
  deleteDesignation(designation: Designation) {
    const _title: string = this.translate.instant('SETUP.DESIGNATIONS.DELETE_DESIGNATION_SIMPLE.TITLE');
    const _description: string = this.translate.instant('SETUP.DESIGNATIONS.DELETE_DESIGNATION_SIMPLE.DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('SETUP.DESIGNATIONS.DELETE_DESIGNATION_SIMPLE.WAIT_DESCRIPTION');
    const _deleteMessage = this.translate.instant('SETUP.DESIGNATIONS.DELETE_DESIGNATION_SIMPLE.MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.designationsService.deleteDesignation(designation.id).subscribe(() => {
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.loadDesignationsList();
      });
    });
  }

  /** SELECTION */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.designationsResult.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.selection.selected.length === this.designationsResult.length) {
      this.selection.clear();
    } else {
      this.designationsResult.forEach(row => this.selection.select(row));
    }
  }

}
