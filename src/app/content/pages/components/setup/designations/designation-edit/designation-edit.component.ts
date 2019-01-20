import { Component, OnInit, Inject } from '@angular/core';
import { Designation } from '../../_core/models/designation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DesignationService } from '../../_core/services/designation.service';
import { TypesUtilsService } from '../../_core/utils/types-utils.service';

@Component({
  selector: 'm-designation-edit',
  templateUrl: './designation-edit.component.html',
  styleUrls: ['./designation-edit.component.scss']
})
export class DesignationEditComponent implements OnInit {

  designation: Designation;
  designationForm: FormGroup;
  hasFormErrors: boolean = false;
  viewLoading: boolean = false;
  loadingAfterSubmit: boolean = false;

  constructor(public dialogRef: MatDialogRef<DesignationEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private designationService: DesignationService,
    private typesUtilsService: TypesUtilsService) { }

  /** LOAD DATA */
  ngOnInit() {
    this.designation = this.data.designation;
    this.createForm();

    /* Server loading imitation. Remove this on real code */
    this.viewLoading = true;
    setTimeout(() => {
      this.viewLoading = false;
    }, 1000);
  }

  createForm() {
    this.designationForm = this.fb.group({ name: [this.designation.name, Validators.required] });
  }

  /** UI */
  getTitle(): string {
    if (this.designation.id > 0) {
      return `Edit designation '${this.designation.name}'`;
    }

    return 'New designation';
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.designationForm.controls[controlName];
    const result = control.invalid && control.touched;
    return result;
  }

  /** ACTIONS */
  prepareDesignation(): Designation {
    const controls = this.designationForm.controls;
    const _designation = new Designation();
    _designation.id = this.designation.id;
    console.log('_designation', _designation);
    _designation.name = controls['name'].value;
    return _designation;
  }

  onSubmit() {
    this.hasFormErrors = false;
    this.loadingAfterSubmit = false;
    const controls = this.designationForm.controls;
    /** check form */
    if (this.designationForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    const editedDesignation = this.prepareDesignation();
    if (editedDesignation.id > 0) {
      this.updateDesignation(editedDesignation);
    } else {
      this.createDesignation(editedDesignation);
    }
  }

  updateDesignation(_designation: Designation) {
    this.loadingAfterSubmit = true;
    this.viewLoading = true;
    this.designationService.updateDesignation(_designation).subscribe(res => {
      /* Server loading imitation. Remove this on real code */
      this.viewLoading = false;
      this.dialogRef.close({
        _designation,
        isEdit: true
      });
    });
  }

  createDesignation(_designation: Designation) {
    this.loadingAfterSubmit = true;
    this.viewLoading = true;
    this.designationService.createDesignation(_designation).subscribe(res => {
      this.viewLoading = false;
      this.dialogRef.close({
        _designation,
        isEdit: false
      });
    });
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

}
