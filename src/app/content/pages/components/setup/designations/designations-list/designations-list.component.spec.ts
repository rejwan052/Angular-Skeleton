import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationsListComponent } from './designations-list.component';

describe('DesignationsListComponent', () => {
  let component: DesignationsListComponent;
  let fixture: ComponentFixture<DesignationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
