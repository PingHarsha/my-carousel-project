import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SlideActionsComponent } from './slide-actions/slide-actions.component';
import { NgOptimizedImage } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SlideActionsComponent, NgOptimizedImage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  title = 'my-carousel-project';
  @HostBinding('class') show = 'w-full h-full';
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.adjustSlidePosition('next');
  }
  slides: {
    index: number;
    slideText: string;
    isVideo: boolean;
    video: SafeResourceUrl;
  }[] = [];
  currentSlide = 1;
  myDiv = viewChild<ElementRef<HTMLDivElement>>('myDiv');
  sanitizer = inject(DomSanitizer);

  constructor() {
    this.generateSlides(Math.floor(Math.random() * 10) + 1);
  }

  get totalSlides() {
    return this.slides.length;
  }

  ngAfterViewInit() {
    this.adjustSlidePosition('next');
  }

  generateSlides(count: number) {
    const randomVideos = [
      'd6iQrh2TK98',
      '3CgcPRs4iPg',
      'bS9em7Bg0iU',
      'M2f-66jP8VQ',
      'yXTFOeGly9o',
      'JvyzdNomLEM',
      'wjZofJX0v4M',
    ];
    const copiedVideos: string[] = [];
    for (let i = 0; i < count; i++) {
      let isVideo = false;
      let video: SafeResourceUrl = {};

      if (Math.random() < 0.5) {
        const randomIndex = Math.floor(Math.random() * randomVideos.length);
        const videoId = randomVideos[randomIndex];
        if (!copiedVideos.includes(videoId)) {
          isVideo = true;
          video = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${videoId}`
          );
          copiedVideos.push(videoId);
        }
      }
      this.slides.push({
        index: i,
        slideText: !isVideo ? `https://picsum.photos/500/300?random=${i}` : '',
        isVideo,
        video,
      });
    }
  }

  moveFirstToLast<T>(arr: T[]): T[] {
    const firstElement = arr.shift(); // Remove and store the first element
    if (firstElement !== undefined) {
      arr.push(firstElement); // Add the first element to the end
    }
    return arr;
  }

  moveLastToFirst<T>(arr: T[]): T[] {
    const lastElement = arr.pop(); // Remove and store the last element
    if (lastElement !== undefined) {
      arr.unshift(lastElement); // Add the last element to the beginning
    }
    return arr;
  }

  // Basic easing function
  easeInOutQuad(
    currentTime: number,
    currentScrollPosition: number,
    change: number,
    durationOfScroll: number
  ) {
    currentTime /= durationOfScroll / 2;
    if (currentTime < 1) {
      return (change / 2) * currentTime * currentTime + currentScrollPosition;
    }
    currentTime--;
    return (
      (-change / 2) * (currentTime * (currentTime - 2) - 1) +
      currentScrollPosition
    );
  }

  moveSlider(direction: 'previous' | 'next') {
    const targetSlide = this.currentSlide + (direction === 'next' ? 1 : -1);
    if (!(targetSlide > 0 && targetSlide <= this.totalSlides)) {
      this.currentSlide = 0;
    }
    if (targetSlide <= 0) {
      this.currentSlide = this.totalSlides + 1;
    }
    if (direction === 'next') {
      this.slides = this.moveFirstToLast(this.slides);
    } else if (direction === 'previous') {
      this.slides = this.moveLastToFirst(this.slides);
    }
    this.currentSlide += direction === 'next' ? 1 : -1;
    this.adjustSlidePosition(direction);
  }

  private adjustSlidePosition(direction: 'previous' | 'next') {
    let currentScrollPosition = 0;
    const start = this.myDiv()?.nativeElement;
    const divSize = document.getElementById(`0-slide`);
    if (!divSize || !start) {
      return;
    }
    const styles = window.getComputedStyle(start);
    const gapValue = styles.gap;
    const gapNumber = parseFloat(gapValue);
    const slideDivSize = divSize.offsetWidth;
    const parentDivSize: number = start.offsetWidth;
    let width =
      slideDivSize - (parentDivSize - slideDivSize - gapNumber * 2) / 2;
    if (direction === 'previous') {
      width /= 2;
      currentScrollPosition = width;
      start.scrollLeft *= 2;
    }

    let currentTime = 0;
    const increment = 5;
    const durationOfScroll = increment * 2;
    const animateScroll = () => {
      currentTime += increment;
      const nativeElement: HTMLDivElement | undefined =
        this.myDiv()?.nativeElement;
      if (!nativeElement) {
        return;
      }
      nativeElement.scrollLeft = this.easeInOutQuad(
        currentTime,
        currentScrollPosition,
        width,
        durationOfScroll
      );
      if (currentTime >= durationOfScroll) {
        return;
      }
      setTimeout(animateScroll, increment);
    };
    animateScroll();
  }
}
