import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { isNotNullOrUndefined } from 'src/app/shared/_shared';
import { ListService } from 'src/app/core/services/list.service';
import { LayoutState } from 'src/app/store/interfaces/LayoutState';
import { ResultFilter } from 'src/app/store/interfaces/ResultFilter';
import { ResultState } from 'src/app/store/interfaces/ResultState';
import { SelectionState } from 'src/app/store/interfaces/SelectionState';
import { AppState } from 'src/app/store/app.state';
import {
  LayoutActions,
  ResultActions,
  SelectionActions,
} from 'src/app/store/actions';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss'],
})
export class ListItemsComponent implements OnInit, OnDestroy, AfterViewInit {
  agentInfo;
  items;
  subscriptions: Array<Subscription> = [];

  @ViewChild('maxRentSlider', { static: false }) maxRentSlider;

  isFavSelected = false;
  isEditRentMode = false;
  isEditBedMode = false;
  selection;
  role;
  minRent;
  maxRent;
  bedrooms = [];

  currentMaxRent = 0;
  currentMinRent = 0;
  currentBedrooms = [];
  private _unsubscribe$ = new Subject<void>();
  selectionState$: Observable<SelectionState>;
  resultsState$: Observable<ResultState>;
  layoutState$: Observable<LayoutState>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private cdRef: ChangeDetectorRef,
    private listService: ListService
  ) {}

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  get layout() {
    return this.layoutState$; //this.store.select('layoutState');
  }

  get displayResults$() {
    return this.store.select('resultState').pipe(
      isNotNullOrUndefined(),
      map((state) =>
        state.DisplayResults().find((f: any) => f.favorite === true)
      )
    );
  }

  ngOnInit() {
    this.layoutState$ = this.store.select('layoutState');
    this.selectionState$ = this.store.select('selectionState');
    this.resultsState$ = this.store.select('resultState');

    this.load();

    this.layoutState$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((state) => (this.isFavSelected = state.isFavSelected));
  }

  ngAfterViewInit() {
    this.restoreScrollPosition();
  }

  restoreScrollPosition() {
    this.route.fragment.subscribe((f) => {
      if (!f) return;

      const pID = +f.replace('p-', '');
      const OFFSET = 2;
      let index = +this.items.findIndex((r) => r.propertyID === pID) - OFFSET;
      if (index < 0) index = 0;

      const element = document.querySelector('#p-' + index);
      if (element)
        element.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }

  load(): void {
    this.subscriptions.push(
      this.selectionState$
        .pipe(isNotNullOrUndefined())
        .subscribe((selections) => (this.selection = selections))
    );
    this.subscriptions.push(
      this.resultsState$.pipe(isNotNullOrUndefined()).subscribe((item) => {
        this.items = item.DisplayResults();
        this.cdRef.detectChanges();

        this.updateFilterOptions(item.unfiltered);

        this.currentBedrooms = this.bedrooms;
        this.currentMaxRent = this.maxRent;
        this.currentMinRent = this.minRent;
        if (item.filters) this.updateFilterLabels(item.filters);
      })
    );
    this.subscriptions.push(
      this.listService.subscription
        .pipe(isNotNullOrUndefined())
        .subscribe((data: any) => {
          this.agentInfo = data.agentInfo;
          this.role = data.role;
        })
    );
  }

  updateFilterOptions(results: Array<any>) {
    this.maxRent = 0;
    this.minRent = 0;
    this.minRent = Number.MAX_SAFE_INTEGER;

    results.map((record) => {
      record.floorplans.map((f) => {
        if (f.price > this.maxRent) this.maxRent = f.price;
        if (f.price < this.minRent) this.minRent = f.price;
        if (!this.bedrooms.includes(f.bedrooms))
          this.bedrooms = this.bedrooms.concat(f.bedrooms);
      });
    });
  }

  updateFilterLabels(filters: ResultFilter) {
    if (filters.bedrooms) this.currentBedrooms = filters.bedrooms;
    if (filters.maxPrice) this.currentMaxRent = filters.maxPrice;
  }

  updatePriceFilterLabel(max: number) {
    this.currentMaxRent = max;
    this.store.dispatch(LayoutActions.mapResetZoom());
  }

  updateBedroomsFilterLabel(selectedBedrooms: Array<number>) {
    this.currentBedrooms = selectedBedrooms;
    this.store.dispatch(LayoutActions.mapResetZoom());
  }

  onPriceFilterChange(newMax: number) {
    this.updatePriceFilterLabel(newMax);
    this.toggleEditRentMode();
  }

  onBedroomFilterChanged(newBedroomSelections) {
    this.updateBedroomsFilterLabel(newBedroomSelections);
    this.toggleEditBedMode();
  }

  toggleEditBedMode() {
    this.isEditBedMode = !this.isEditBedMode;
    if (this.isEditBedMode) this.isEditRentMode = false;
  }

  toggleEditRentMode() {
    this.isEditRentMode = !this.isEditRentMode;
    if (this.isEditRentMode) this.isEditBedMode = false;
  }

  onItemClick(dataItem: any) {
    this.router
      .navigate([dataItem.propertyID], { relativeTo: this.route })
      .then(() => {
        this.store.dispatch(
          SelectionActions.select({ properyID: dataItem.propertyID })
        );
      });
  }

  onRestoreList() {
    this.store.dispatch(ResultActions.filter({ filters: { favorite: false } }));
  }

  onToggleFav() {
    this.store.dispatch(
      LayoutActions.toggleFavFilter({ isFavSelected: !this.isFavSelected })
    );
    this.store.dispatch(
      ResultActions.filter({ filters: { favorite: this.isFavSelected } })
    );
  }
}
