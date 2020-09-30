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
import { BehaviorSubject, Observable } from 'rxjs';
import { isNotNullOrUndefined } from 'src/app/shared/_shared';
import { LayoutState } from 'src/app/store/interfaces/LayoutState';
import { ResultFilter } from 'src/app/store/interfaces/ResultFilter';
import { ResultState } from 'src/app/store/interfaces/ResultState';
import { AppState } from 'src/app/store/app.state';
import {
  LayoutActions,
  ResultActions,
  SelectionActions,
} from 'src/app/store/actions';
import {
  selectAgentInfo,
  selectFavoriteResults,
  selectFilters,
  selectResults,
  selectRole,
  selectUnfiltered,
} from 'src/app/store/selectors/result.selectors';
import { isFavSelected } from 'src/app/store/selectors/layout.selectors';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss'],
})
export class ListItemsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('maxRentSlider', { static: false }) maxRentSlider;
  private subs = new SubSink();

  isFavSelected = false;
  isEditRentMode = false;
  isEditBedMode = false;

  agentInfo$: Observable<any>;
  role$: Observable<string>;
  isFavSelected$: Observable<boolean>;

  resultState$: Observable<ResultState>;

  selection$: Observable<any>;
  results$: Observable<any>;
  favoriteResults$: Observable<any>;
  filters$: Observable<any>;
  unfiltered$: Observable<any>;

  private _minRent: BehaviorSubject<number> = new BehaviorSubject(0);
  public get minRent(): number {
    return this._minRent.getValue();
  }

  private _maxRent: BehaviorSubject<number> = new BehaviorSubject(0);
  get maxRent(): number {
    return this._maxRent.getValue();
  }
  private _currentMinRent: BehaviorSubject<number> = new BehaviorSubject(0);
  get currentMinRent(): number {
    return this._currentMinRent.getValue();
  }

  private _currentMaxRent: BehaviorSubject<number> = new BehaviorSubject(0);
  get currentMaxRent(): number {
    return this._currentMaxRent.getValue();
  }

  private _bedrooms: BehaviorSubject<any[]> = new BehaviorSubject([]);
  get bedrooms(): any[] {
    return this._bedrooms.getValue();
  }
  private _currentBedrooms: BehaviorSubject<any[]> = new BehaviorSubject([]);
  get currentBedrooms(): any[] {
    return this._currentBedrooms.getValue();
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.resultState$ = this.store.select('resultState');

    this.agentInfo$ = this.store.select(selectAgentInfo);
    this.role$ = this.store.select(selectRole);
    this.results$ = this.store.select(selectResults);
    this.favoriteResults$ = this.store.select(selectFavoriteResults);
    this.filters$ = this.store.select(selectFilters);
    this.unfiltered$ = this.store.select(selectUnfiltered);
    this.isFavSelected$ = this.store.select(isFavSelected);

    this.subs.sink = this.isFavSelected$.subscribe(
      (isSelected: boolean) => (this.isFavSelected = isSelected)
    );

    this.load();
  }

  ngAfterViewInit(): void {
    this.restoreScrollPosition();
  }

  restoreScrollPosition(): void {
    this.subs.sink = this.route.fragment.subscribe((f) => {
      if (!f) {
        return;
      }

      const pID = +f.replace('p-', '');
      const OFFSET = 2;
      let index;

      this.subs.sink = this.results$.subscribe((items) => {
        index = +items.findIndex((r) => r.propertyID === pID) - OFFSET;
      });

      const element = document.querySelector('#p-' + index);
      if (element) {
        element.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    });
  }

  load(): void {
    this.subs.sink = this.resultState$
      .pipe(isNotNullOrUndefined())
      .subscribe((item) => {
        this.cdRef.detectChanges();
        this.updateFilterOptions(item.unfiltered);

        if (item.filters) {
          this.updateFilterLabels(item.filters);
        }
      });
  }

  updateFilterOptions(results: Array<any>): void {
    this._maxRent.next(0);
    this._minRent.next(0);
    this._minRent.next(Number.MAX_SAFE_INTEGER);
    let bedrooms;

    results.map((record) => {
      record.floorplans.map((f) => {
        if (f.price > this._maxRent.getValue()) {
          this._maxRent.next(f.price);
          this._currentMaxRent.next(f.price);
        }
        if (f.price < this._minRent.getValue()) {
          this._minRent.next(f.price);
          this._currentMinRent.next(f.price);
        }
        if (!this._bedrooms.getValue().includes(f.bedrooms)) {
          bedrooms = this._bedrooms.getValue().concat(f.bedrooms);
          this._bedrooms.next(bedrooms);
          this._currentBedrooms.next(bedrooms);
        }
      });
    });
  }

  updateFilterLabels(filters: ResultFilter): void {
    if (filters.bedrooms) {
      this._currentBedrooms.next(filters.bedrooms);
    }
    if (filters.maxPrice) {
      this._currentMaxRent.next(filters.maxPrice);
    }
  }

  updatePriceFilterLabel(max: number): void {
    this._currentMaxRent.next(max);
    this.store.dispatch(LayoutActions.mapResetZoom());
  }

  updateBedroomsFilterLabel(selectedBedrooms: Array<number>): void {
    this._currentBedrooms.next(selectedBedrooms);
    this.store.dispatch(LayoutActions.mapResetZoom());
  }

  onPriceFilterChange(newMax: number): void {
    this.updatePriceFilterLabel(newMax);
    this.toggleEditRentMode();
  }

  onBedroomFilterChanged(newBedroomSelections): any {
    this.updateBedroomsFilterLabel(newBedroomSelections);
    this.toggleEditBedMode();
  }

  toggleEditBedMode(): void {
    this.isEditBedMode = !this.isEditBedMode;
    if (this.isEditBedMode) {
      this.isEditRentMode = false;
    }
  }

  toggleEditRentMode(): void {
    this.isEditRentMode = !this.isEditRentMode;
    if (this.isEditRentMode) {
      this.isEditBedMode = false;
    }
  }

  onItemClick(dataItem: any): void {
    this.router
      .navigate([dataItem.propertyID], { relativeTo: this.route })
      .then(() => {
        this.store.dispatch(
          SelectionActions.select({ properyID: dataItem.propertyID })
        );
      });
    this.store.subscribe(console.log);
  }

  onRestoreList(): void {
    this.store.dispatch(ResultActions.filter({ filters: { favorite: false } }));
  }

  onToggleFav(data): void {
    this.store.dispatch(LayoutActions.toggleFavFilter());
    this.store.dispatch(
      ResultActions.filter({ filters: { favorite: this.isFavSelected } })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
