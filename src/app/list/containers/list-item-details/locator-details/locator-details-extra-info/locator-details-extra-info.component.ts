import { Component, OnInit, Input } from '@angular/core';

import { PropertyModel } from 'src/app/shared/_shared';

@Component({
  selector: 'app-locator-details-extra-info',
  templateUrl: './locator-details-extra-info.component.html',
  styleUrls: ['./locator-details-extra-info.component.scss'],
})
export class LocatorDetailsExtraInfoComponent implements OnInit {
  @Input() propertyData: PropertyModel;

  isSchoolsVisible = false;

  constructor() { }

  ngOnInit() { }

  get petOptions() {
    return this.propertyData && this.propertyData.petOptions
      ? this.propertyData.petOptions
      : [];
  }

  showSchools() {
    this.isSchoolsVisible = true;
  }
}
