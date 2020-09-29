import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-list-items-vendor-item',
  templateUrl: './vendor-item.component.html',
  styleUrls: ['./vendor-item.component.scss']
})
export class VendorItemComponent implements OnInit {

  @Input() dataItem;

  constructor() { }

  ngOnInit() {
  }
}
