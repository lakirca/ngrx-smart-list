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
import { map } from 'rxjs/operators';
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
  layoutState$: Observable<LayoutState>;
  selectionState$: Observable<SelectionState>;

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
    private cdRef: ChangeDetectorRef,
    private listService: ListService
  ) {}

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
    this.resultState$ = this.store.select('resultState');

    this.agentInfo$ = this.store.select(selectAgentInfo);
    this.role$ = this.store.select(selectRole);
    this.results$ = this.store.select(selectResults);
    this.favoriteResults$ = this.store.select(selectFavoriteResults);
    this.filters$ = this.store.select(selectFilters);
    this.unfiltered$ = this.store.select(selectUnfiltered);
    this.isFavSelected$ = this.store.select(isFavSelected);

    this.load();

    this.layoutState$.subscribe(
      (state) => (this.isFavSelected = state.isFavSelected)
    );
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
        console.log(items);
        index = +items.findIndex((r) => r.propertyID === pID) - OFFSET;
      });

      const element = document.querySelector('#p-' + index);
      if (element) {
        element.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    });
  }

  load(): void {
    this.resultState$.pipe(isNotNullOrUndefined()).subscribe((item) => {
      this.cdRef.detectChanges();
      this.updateFilterOptions(item.unfiltered);

      if (item.filters) {
        this.updateFilterLabels(item.filters);
      }
    });
  }

  updateFilterOptions(results: Array<any>) {
    this._minRent.next(Number.MAX_SAFE_INTEGER);

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
          const bedrooms = this._bedrooms.getValue().concat(f.bedrooms);
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

  onBedroomFilterChanged(newBedroomSelections): void {
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
    console.log(dataItem);
    this.router
      .navigate([dataItem.propertyID], { relativeTo: this.route })
      .then(() => {
        this.store.dispatch(
          SelectionActions.select({ properyID: dataItem.propertyID })
        );
      });
  }

  onRestoreList(): void {
    this.store.dispatch(ResultActions.filter({ filters: { favorite: false } }));
  }

  onToggleFav(data): void {
    console.log(data);
    // this.store.dispatch(
    //   LayoutActions.toggleFavFilter({ isFavSelected: !this.isFavSelected })
    // );
    // this.store.dispatch(
    //   ResultActions.filterResults({ filters: { favorite: this.isFavSelected } })
    // );
  }

  ngOnDestroy(): void {}
}
