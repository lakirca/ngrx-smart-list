import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-list-items-locator-item',
  templateUrl: './locator-item.component.html',
  styleUrls: ['./locator-item.component.scss']
})
export class CardComponent implements OnInit {

  @Input() dataItem;

  constructor() { }

  ngOnInit() {
  }

}
