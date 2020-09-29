import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-locator-details-specials',
  templateUrl: './locator-details-specials.component.html',
  styleUrls: ['./locator-details-specials.component.scss'],
})
export class LocatorDetailsSpecialsComponent implements OnInit {
  @Input() specials = '';

  constructor() {}

  ngOnInit() {}
}
