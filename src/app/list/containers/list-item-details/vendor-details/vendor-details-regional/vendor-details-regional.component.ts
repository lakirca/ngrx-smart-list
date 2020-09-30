import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vendor-details-regional',
  templateUrl: './vendor-details-regional.component.html',
  styleUrls: ['./vendor-details-regional.component.scss'],
})
export class VendorDetailsRegionalComponent implements OnInit {
  @Input() regionalEmail = '';
  @Input() regionalPhone = '';
  @Input() regionalName = '';
  @Input() phone = '';

  isRegionalExpanded = false;

  constructor() {}

  ngOnInit() {}

  expandRegional() {
    this.isRegionalExpanded = true;
  }
}
