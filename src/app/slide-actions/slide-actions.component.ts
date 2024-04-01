import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-slide-actions',
  standalone: true,
  imports: [],
  templateUrl: './slide-actions.component.html',
  styleUrl: './slide-actions.component.scss',
})
export class SlideActionsComponent {
  currentSlide = input(0);
  totalSlides = input(0);
  buttonEvent = output<'previous' | 'next'>();

  buttonAction(action: 'previous' | 'next') {
    this.buttonEvent.emit(action);
  }
}
