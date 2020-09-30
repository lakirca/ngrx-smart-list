import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-locator-details-floorplans',
  templateUrl: './locator-details-floorplans.component.html',
  styleUrls: ['./locator-details-floorplans.component.scss'],
})
export class LocatorDetailsFloorplansComponent implements OnInit {
  @Input() floorplans: any[] = [];

  @Output() toggleFloorplanPhoto = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  toggle(data) {
    this.toggleFloorplanPhoto.emit(data);
  }

  get image() {
    return this.floorplans.length === 1
      ? '/assets/images/arrow-up-thick.svg'
      : '/assets/images/arrow-down-thick.svg';
  }
}
