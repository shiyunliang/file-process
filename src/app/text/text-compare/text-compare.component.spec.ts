import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextCompareComponent } from './text-compare.component';

describe('TextCompareComponent', () => {
  let component: TextCompareComponent;
  let fixture: ComponentFixture<TextCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextCompareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
