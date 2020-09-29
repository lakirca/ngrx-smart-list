import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-arrow',
  templateUrl: './image-arrow.component.html',
  styleUrls: ['./image-arrow.component.scss'],
})
export class ImageArrowComponent implements OnInit {
  @Input() total = 0;
  @Input() current = 0;

  @Output() showNext = new EventEmitter<'up' | 'down'>();

  constructor() {}

  ngOnInit() {}

  handleLeftClick() {
    this.showNext.emit('down');
  }

  handleRightClick() {
    this.showNext.emit('up');
  }

  get imageLeft() {
    return this.current > 0
      ? '/assets/images/arrow-left-muted.svg'
      : '/assets/images/arrow-left.svg';
  }

  get imageRight() {
    return this.current >= this.total - 1
      ? '/assets/images/arrow-right.svg'
      : '/assets/images/arrow-right-muted.svg';
  }
}
