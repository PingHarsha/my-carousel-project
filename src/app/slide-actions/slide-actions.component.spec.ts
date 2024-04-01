import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideActionsComponent } from './slide-actions.component';

describe('SlideActionsComponent', () => {
  let component: SlideActionsComponent;
  let fixture: ComponentFixture<SlideActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SlideActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
