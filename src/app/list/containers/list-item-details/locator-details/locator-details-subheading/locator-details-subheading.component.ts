import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-locator-details-subheading',
  templateUrl: './locator-details-subheading.component.html',
  styleUrls: ['./locator-details-subheading.component.scss'],
})
export class LocatorDetailsSubheadingComponent implements OnInit {
  @Input() streetAddress = '';
  @Input() city = '';
  @Input() phone = '';

  constructor() {}

  ngOnInit() {}

  get formattedPhone() {
    return this.phone
      .replace('(', '')
      .replace('-', '')
      .replace(')', '')
      .trim();
  }

  get phoneUrl() {
    return `tel:${this.formattedPhone}`;
  }
}
