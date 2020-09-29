import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-list-main-map-switch',
  templateUrl: './list-main-map-switch.component.html',
  styleUrls: ['./list-main-map-switch.component.scss'],
})
export class ListMainMapSwitchComponent implements OnInit {
  @Input() toggleState = false;
  @Input() image = '';
  @Input() size = 22;
  @Input() width = 42;
  @Output() toggle = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  onToggle() {
    this.toggleState = !this.toggleState;
    this.toggle.emit(this.toggleState);
  }
}
