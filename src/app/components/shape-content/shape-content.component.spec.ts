import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeContentComponent } from './shape-content.component';

describe('ShapeContentComponent', () => {
  let component: ShapeContentComponent;
  let fixture: ComponentFixture<ShapeContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShapeContentComponent]
    });
    fixture = TestBed.createComponent(ShapeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
