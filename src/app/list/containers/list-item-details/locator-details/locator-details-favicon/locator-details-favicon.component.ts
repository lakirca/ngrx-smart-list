import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { RoleEnum } from 'src/app/shared/_shared';

@Component({
  selector: 'app-locator-details-favicon',
  templateUrl: './locator-details-favicon.component.html',
  styleUrls: ['./locator-details-favicon.component.scss'],
})
export class LocatorDetailsFaviconComponent implements OnInit {
  @Input() role = '';
  @Input() favorite = '';
  @Input() phone = '';
  @Output() toggleFav: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  get isHarvey() {
    return this.role === RoleEnum.HARVEY;
  }

  toggle() {
    this.toggleFav.emit(!this.favorite);
  }
}
