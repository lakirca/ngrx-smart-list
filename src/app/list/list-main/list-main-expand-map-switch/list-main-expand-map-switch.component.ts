import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-main-expand-map-switch',
  templateUrl: './list-main-expand-map-switch.component.html',
  styleUrls: ['./list-main-expand-map-switch.component.scss'],
})
export class ListMainExpandMapSwitchComponent implements OnInit {
  @Output() toggle = new EventEmitter<null>();

  constructor() {}

  ngOnInit() {}

  onToggle() {
    this.toggle.emit();
  }
}
