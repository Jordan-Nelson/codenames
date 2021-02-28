import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopySnackBarComponent } from './copy-snack-bar.component';

describe('CopySnackBarComponent', () => {
  let component: CopySnackBarComponent;
  let fixture: ComponentFixture<CopySnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopySnackBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopySnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
