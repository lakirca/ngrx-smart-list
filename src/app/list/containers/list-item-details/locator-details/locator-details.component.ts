import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';
import { filter, switchMap } from 'rxjs/operators';

import { isNotNullOrUndefined, PropertyModel } from 'src/app/shared/_shared';
import { GalleryEvent } from './models/interfaces';
import { Observable } from 'rxjs';
import { LayoutState } from 'src/app/store/interfaces/LayoutState';
import { AppState } from 'src/app/store/app.state';
import { LayoutActions, SelectionActions } from 'src/app/store/actions';
import { PropertyService } from 'src/app/core/services/property.service';
import { LoggingService } from 'src/app/core/LoggingService';
import { ListService } from 'src/app/core/services/list.service';

@Component({
  selector: 'app-list-item-details-locator-details',
  templateUrl: './locator-details.component.html',
  styleUrls: ['./locator-details.component.scss'],
})
export class LocatorDetailsComponent implements OnInit, OnDestroy {
  static readonly MAX_NOTES_LENGTH = 130;

  subscriptions: Array<Subscription> = [];

  propertyID;
  propertyData: PropertyModel = null;
  agentInfo;

  isNotesExpanded;
  isSchoolsVisible;
  isGalleryVisible;
  displayFloorplans = [];
  showAllAmenities;
  layoutState$: Observable<LayoutState>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private loggingService: LoggingService,
    private listService: ListService,
    private store: Store<AppState>
  ) {}

  get phone() {
    return this.propertyData && this.propertyData.phone
      ? `tel:${this.propertyData.phone
          .replace('(', '')
          .replace('-', '')
          .replace(')', '')
          .trim()}`
      : '';
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnInit() {
    this.layoutState$ = this.store.select('layoutState');

    this.subscriptions.push(
      this.route.params
        .pipe(switchMap((params) => this.route.params))
        .subscribe((params) => {
          this.propertyID = +params.propertyID;
          this.propertyService.load(
            this.listService.ListID,
            this.propertyID,
            this.listService.Token
          );
        })
    );

    // todo: move this to a route resolver
    if (!this.listService || !this.listService.IsReady) {
      this.loadList();
    } else {
      this.agentInfo = this.listService.AgentInfo;
    }

    // todo: move to route resolver.
    this.loadProperty();
    this.loadGallery();
  }

  public goBack() {
    this.router
      .navigate(['../'], {
        relativeTo: this.route,
        fragment: 'p-' + this.propertyID.toString(),
      })
      .then(() => {
        this.store.dispatch(LayoutActions.mapResetZoom());
      });
  }

  private loadProperty() {
    this.subscriptions.push(
      this.propertyService.subscription
        .pipe(isNotNullOrUndefined())
        .subscribe((data: any) => {
          if (data.error) {
            this.router.navigate(['/access-denied']);
            return;
          }

          this.propertyData = data;
          this.displayFloorplans = this.propertyData.floorplans; // todo: apply filter here.
          this.propertyData.displayNotes = this.propertyData.notes;
          if (
            this.propertyData.displayNotes.length >
            LocatorDetailsComponent.MAX_NOTES_LENGTH
          )
            this.propertyData.displayNotes =
              this.propertyData.notes.substring(
                0,
                LocatorDetailsComponent.MAX_NOTES_LENGTH
              ) + '...';

          if (this.propertyData.highValueAmenities.length === 0)
            this.showAllAmenities = true;
        })
    );
  }

  private loadGallery() {
    this.subscriptions.push(
      this.layoutState$
        .pipe(
          filter(
            (item) =>
              (item !== null || item !== undefined) &&
              (item.index !== null || item.index !== undefined)
            //!isNullOrUndefined(item) && !isNullOrUndefined(item.index)
          )
        )

        .subscribe((item) => (this.isGalleryVisible = item.index >= 0))
    );
  }

  private loadList() {
    this.subscriptions.push(
      this.listService.subscription
        .pipe(isNotNullOrUndefined())
        .subscribe(() => {
          this.store.dispatch(
            SelectionActions.select({ properyID: this.propertyID })
          );
          this.agentInfo = this.listService.AgentInfo;
        })
    );
  }

  showRemainingAmenities() {
    this.showAllAmenities = true;
  }

  expandNotes() {
    this.propertyData.displayNotes = this.propertyData.notes;
    this.isNotesExpanded = true;
  }

  showGallery(data: GalleryEvent) {
    if (!data.visible) {
      this.store.dispatch(LayoutActions.hideGallery());
      return;
    }

    if (data.url) data.url = data.url.replace('/micros/', '/standard/');
    else data.url = this.propertyData.photos[0];

    this.store.dispatch(
      LayoutActions.displayPhoto({
        selectedImageUrl: data.url,
        images: this.propertyData.photos,
      })
    );
  }

  toggleFloorplanPhoto(floorplan) {
    if (this.displayFloorplans.length === 1) {
      this.displayFloorplans = [].concat(this.propertyData.floorplans);
    } else if (floorplan.photoUrl !== '') {
      this.displayFloorplans = [].concat(floorplan);
    }
  }

  toggleFav(state: boolean) {
    this.propertyData.favorite = state;
    this.subscriptions.push(
      this.listService
        .toggleFavorite(this.propertyID, this.propertyData.favorite)
        .subscribe(
          () => {},
          (error) => {
            this.loggingService.logException(
              'ListItemDetailsComponent.toggleFav()',
              '',
              error
            );
          }
        )
    );
  }
}
