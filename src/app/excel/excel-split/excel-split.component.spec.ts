import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelSplitComponent } from './excel-split.component';

describe('ExcelSplitComponent', () => {
  let component: ExcelSplitComponent;
  let fixture: ComponentFixture<ExcelSplitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExcelSplitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcelSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
