import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmQuizComponent } from './confirm-quiz.component';

describe('ConfirmQuizComponent', () => {
  let component: ConfirmQuizComponent;
  let fixture: ComponentFixture<ConfirmQuizComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmQuizComponent]
    });
    fixture = TestBed.createComponent(ConfirmQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
