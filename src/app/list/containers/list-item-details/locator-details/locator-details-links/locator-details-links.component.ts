import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-locator-details-links',
  templateUrl: './locator-details-links.component.html',
  styleUrls: ['./locator-details-links.component.scss'],
})
export class LocatorDetailsLinksComponent implements OnInit {
  @Input() name = '';
  @Input() url = '';
  @Input() streetAddress = '';
  @Input() city = '';
  @Input() state = '';

  constructor() {}

  ngOnInit() {}

  get link() {
    return `http://maps.google.com/?daddr=${this.streetAddress},${this.city} ${
      this.state
    }`;
  }
}
