import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ResultActions } from 'src/app/store/actions';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-list-filter-bedroom',
  templateUrl: './bedroom.component.html',
  styleUrls: ['./bedroom.component.scss'],
})
export class ListFilterBedroomComponent implements OnInit, OnChanges {
  allAvailableOptions = [];
  changed = [];

  @Output() change = new EventEmitter();
  @Input() available;
  @Input() selected;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('available' in changes && this.changed.length === 0) {
      this.allAvailableOptions = changes.available.currentValue;
      this.changed = changes.selected.currentValue;
    }
  }

  onToggle(bedroom, event): void {
    const checked = event.target.classList.contains('selected');
    if (checked && this.changed.length === 1) {
      return;
    }

    if (checked) {
      event.target.classList.remove('selected');
      this.changed = this.changed.filter((e) => e !== bedroom);
    } else {
      event.target.classList.add('selected');
      this.changed.push(bedroom);
    }
  }

  applyBedroomFilters(): void {
    this.store.dispatch(
      ResultActions.filter({ filters: { bedrooms: this.changed } })
    );
    this.change.emit(this.changed);
  }
}
