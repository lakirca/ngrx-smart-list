import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-locator-details-notes',
  templateUrl: './locator-details-notes.component.html',
  styleUrls: ['./locator-details-notes.component.scss'],
})
export class LocatorDetailsNotesComponent implements OnInit {
  @Input() firstname = '';
  @Input() lastname = '';
  @Input() displayNotes = '';
  @Input() notes = '';

  @Output() expand: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  expandNotes() {
    this.expand.emit();
  }
}
