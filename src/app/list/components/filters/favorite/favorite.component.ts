import { Component, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-list-filter-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent implements OnInit, OnDestroy {
  @Output() restoreList = new EventEmitter<null>();
  @Output() toggleState = new EventEmitter<null>();

  @Input() isActive = false;
  @Input() hidden = true;

  subscriptions: Array<Subscription> = [];

  constructor() { }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  toggle() {
    this.toggleState.emit();
  }
}
