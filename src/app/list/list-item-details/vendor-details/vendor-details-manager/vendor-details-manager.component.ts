import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vendor-details-manager',
  templateUrl: './vendor-details-manager.component.html',
  styleUrls: ['./vendor-details-manager.component.scss'],
})
export class VendorDetailsManagerComponent implements OnInit {
  @Input() onsiteManager = '';

  constructor() {}

  ngOnInit() {}
}
