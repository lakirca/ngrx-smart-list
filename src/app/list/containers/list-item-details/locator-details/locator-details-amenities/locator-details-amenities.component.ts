import { Component, OnInit, Input } from '@angular/core';

import { PropertyModel } from 'src/app/shared/_shared';

@Component({
  selector: 'app-locator-details-amenities',
  templateUrl: './locator-details-amenities.component.html',
  styleUrls: ['./locator-details-amenities.component.scss'],
})
export class LocatorDetailsAmenitiesComponent implements OnInit {
  @Input() propertyData: PropertyModel;
  @Input() showAllAmenities = false;

  constructor() { }

  amenityImage(url: string) {
    return `https://cdn.smartapartmentdata.com/images/svg/32/${url
      .replace('/', '')
      .replace(' ', '+')}.svg`;
  }

  ngOnInit() { }

  showRemainingAmenities() {
    this.showAllAmenities = true;
  }
}
