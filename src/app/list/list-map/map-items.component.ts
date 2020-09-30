import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { SelectionItem } from '../../shared/models/selection-item.model';
import { Store } from '@ngrx/store';

import * as SelectionActions from '../../store/actions/selection.actions';
import * as LayoutActions from '../../store/actions/layout.actions';

import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators';
import * as mapboxgl from 'mapbox-gl';
import { Observable } from 'rxjs';
import { LayoutState } from 'src/app/store/interfaces/LayoutState';
import { ResultState } from 'src/app/store/interfaces/ResultState';
import { SelectionState } from 'src/app/store/interfaces/SelectionState';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-map-items',
  templateUrl: './map-items.component.html',
  styleUrls: ['./map-items.component.scss'],
})
export class MapItemsComponent implements OnInit, OnDestroy, AfterViewInit {
  static readonly unselectedMarkerIcon = '/assets/images/pin/pin-red.svg';
  static readonly unselectedFavMarkerIcon =
    '/assets/images/pin/pin-red-heart.svg';
  static readonly selectedMarkerIcon = '/assets/images/pin/pin-blue.svg';
  static readonly selectedFavMarkerIcon =
    '/assets/images/pin/pin-blue-heart.svg';

  static readonly unselectedCircleIcon = '/assets/images/map-circle-red.svg';
  static readonly unselectedFavCircleIcon =
    '/assets/images/map-circle-red-heart.svg';
  static readonly selectedCircleIcon = '/assets/images/map-circle-blue.svg';
  static readonly selectedFavCircleIcon =
    '/assets/images/map-circle-blue-heart.svg';

  @Output() markerClicked = new EventEmitter<null>();

  @ViewChild('map', { static: false }) map: ElementRef;

  subscriptions: Array<Subscription> = [];
  rawMap: mapboxgl.Map;
  displayItems: Array<object>;
  showContactInfo: boolean;

  boundsList: any;
  layoutState$: Observable<LayoutState>;
  selectionState$: Observable<SelectionState>;
  resultsState$: Observable<ResultState>;

  constructor(private store: Store<AppState>) {}

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnInit() {
    this.layoutState$ = this.store.select('layoutState');
    this.selectionState$ = this.store.select('selectionState');
    this.resultsState$ = this.store.select('resultState');

    this.subscriptions.push(
      // this.store
      //   .select('selectionsState')
      this.selectionState$
        .pipe(filter((item) => item !== undefined))
        .subscribe((item) => {
          if (item.previousSelection && !item.currentSelection)
            this.unselect(item.previousSelection);
          else if (item.currentSelection)
            this.processItemClick(
              item.currentSelection,
              item.previousSelection
            );
        })
    );

    this.subscriptions.push(
      // this.store
      //   .select('layoutState')
      this.layoutState$.subscribe((item) => {
        if (!this.rawMap || !item || item.subsystem !== 'map') return;

        if (
          item.message === 'reset-zoom' &&
          this.displayItems &&
          this.displayItems.length > 0
        ) {
          this.configurePoi();
          this.store.dispatch(SelectionActions.unselect());
          const bounds = new mapboxgl.LngLatBounds();

          this.displayItems.forEach((dataItem: any) => {
            bounds.extend(
              new mapboxgl.LngLat(
                +dataItem.geocode.Longitude,
                +dataItem.geocode.Latitude
              )
            );
            this.rawMap.setCenter({
              lng: +dataItem.geocode.Longitude,
              lat: +dataItem.geocode.Latitude,
            });
          });
          this.rawMap.fitBounds(bounds);
        }
      })
    );
  }

  /**
   * Temporary solution for fit map bounds.
   */
  fitBounds() {
    setTimeout(() => {
      this.rawMap.fitBounds(this.boundsList);
    }, 200);
  }

  setMap() {
    let selections = Array<SelectionItem>();
    this.subscriptions.push(
      // this.store
      //   .select('resultsState')
      this.resultsState$.subscribe((item) => {
        if (!item || !item.unfiltered) return;

        this.showContactInfo = item.showContactInfo;
        this.removeMarkers(selections);
        selections = Array<SelectionItem>();
        this.displayItems = item.DisplayResults();
        const sw = new mapboxgl.LngLat(-90, 90);
        const ne = new mapboxgl.LngLat(-1, 1);
        const bounds = new mapboxgl.LngLatBounds(); //(sw, ne);

        this.displayItems.map((dataItem: any) => {
          bounds.extend(
            new mapboxgl.LngLat(
              +dataItem.geocode.Longitude,
              +dataItem.geocode.Latitude
            )
          );

          selections.push(
            this.loadSelection(dataItem, {
              lng: +dataItem.geocode.Longitude,
              lat: +dataItem.geocode.Latitude,
            })
          );
        });
        //this.store.dispatch(SelectionActions.saveSelections({ selections }));
        this.store.dispatch(LayoutActions.mapLoadComplete());
        //this.rawMap.fitBounds(bounds);
        this.boundsList = bounds;
      })
    );
  }

  ngAfterViewInit() {
    this.rawMap = new mapboxgl.Map({
      container: this.map.nativeElement,
      style:
        'https://api.maptiler.com/maps/eef16200-c4cc-4285-9370-c71ca24bb42d/style.json?key=CH1cYDfxBV9ZBu1lHGqh',
      // center: [0, 0],
      //zoom: 20,
    });
    this.setMap();
    this.rawMap.on('load', () => {
      this.rawMap.resize();
    });
  }

  configurePoi() {
    // if (this.showContactInfo) return;
    // this.rawMap.setLayoutProperty('background', 'visibility', 'none');
  }

  removeMarkers(selections: Array<SelectionItem>): void {
    selections.map((s) => {
      s.marker.remove();
    });
  }

  getMarkerIcon(dataItem: SelectionItem, selected: boolean = false) {
    let icon = '';
    if (!this.showContactInfo) {
      if (selected) {
        icon = MapItemsComponent.selectedCircleIcon;
        if (dataItem.favorite) icon = MapItemsComponent.selectedFavCircleIcon;
      } else {
        icon = MapItemsComponent.unselectedCircleIcon;
        if (dataItem.favorite) icon = MapItemsComponent.unselectedFavCircleIcon;
      }
    } else {
      if (selected) {
        icon = MapItemsComponent.selectedMarkerIcon;
        if (dataItem.favorite) icon = MapItemsComponent.selectedFavMarkerIcon;
      } else {
        icon = MapItemsComponent.unselectedMarkerIcon;
        if (dataItem.order > 0)
          icon = icon.replace('.svg', '-' + dataItem.order + '.svg');
        if (dataItem.favorite) icon = MapItemsComponent.unselectedFavMarkerIcon;
      }
    }
    return icon;
  }

  loadSelection(dataItem: any, position: any) {
    let icon = new Image();
    icon.src = this.getMarkerIcon(dataItem);
    icon.className = 'pointer';
    const marker = new mapboxgl.Marker({
      element: icon,
    })
      .setLngLat([position.lng, position.lat])
      .addTo(this.rawMap);

    icon.addEventListener('click', () => {
      this.store.dispatch(
        SelectionActions.select({ properyID: dataItem.propertyID })
      );
      this.markerClicked.emit();
    });

    return new SelectionItem(
      dataItem.propertyID,
      position.lat,
      position.lng,
      marker,
      dataItem.favorite,
      dataItem.order
    );
  }

  unselect(selectionItem: SelectionItem) {
    let icon = new Image();
    icon.src = this.getMarkerIcon(selectionItem);
    selectionItem.marker._element = icon;
  }

  processItemClick(
    currentSelection: SelectionItem,
    previousSelection: SelectionItem
  ) {
    if (!this.rawMap) {
      return;
    }

    this.rawMap.flyTo({
      center: [currentSelection.lng, currentSelection.lat],
      zoom: 16,
    });

    if (previousSelection) {
      let pIcon = new Image();
      pIcon.src = this.getMarkerIcon(previousSelection);
      previousSelection.marker._element = this.getMarkerIcon(previousSelection);
      let cIcon = new Image();
      cIcon.src = this.getMarkerIcon(currentSelection, true);
      currentSelection.marker._element = this.getMarkerIcon(
        currentSelection,
        true
      );
    }
  }
}
