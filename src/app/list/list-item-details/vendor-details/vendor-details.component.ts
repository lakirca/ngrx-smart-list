import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { ListService } from '../../../core/services/list.service';
import { Subscription } from 'rxjs/Subscription';
//import { isNullOrUndefined } from 'util';
import { isNotNullOrUndefined } from 'src/app/shared/_shared';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import * as LayoutActions from '../../../store/actions/layout.actions';
import * as SelectionActions from '../../../store/actions/selection.actions';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LayoutState } from 'src/app/store/interfaces/LayoutState';


@Component({
  selector: 'app-list-item-details-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss'],
})
export class VendorDetailsComponent implements OnInit, OnDestroy {
  static readonly MAX_NOTES_LENGTH = 130;

  subscriptions: Array<Subscription> = [];

  propertyID;
  propertyData;

  isMgmtExpanded;
  isNotesExpanded;
  isGalleryVisible;
  showAllAmenities;
  specialClassification: string;
  layoutState$: Observable<LayoutState>;


  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private router: Router,
    private propertyService: PropertyService,
    private listService: ListService,
    private store: Store<AppState>
  ) { }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
    this.layoutState$ = this.store.select('layoutState');

    this.subscriptions.push(
      this.route.params
        .pipe(
          switchMap(params => this.route.params))
        .subscribe(params => {
          this.propertyID = +params.propertyID;
          this.propertyService.load(
            this.listService.ListID,
            this.propertyID,
            this.listService.Token
          );
        })
    )

    // todo: move this to a route resolver
    if (!this.listService || !this.listService.IsReady) {
      this.loadList();
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

  private getSpecialClassification(): string {
    if (this.propertyData.section8) return 'Section 8';
    if (this.propertyData.studentHousing) return 'Student Housing';
    if (this.propertyData.seniroHousing) return 'Senior Housing';

    return '';
  }

  private loadProperty() {
    this.subscriptions.push(
      this.propertyService.subscription
        .pipe(isNotNullOrUndefined())
        .subscribe((data: any) => {
          if (data.error) {
            this.router.navigate(['/access-denied']).then();
            return;
          }

          this.propertyData = data;
          this.specialClassification = this.getSpecialClassification();
          this.propertyData.displayNotes = this.propertyData.notes;
          if (
            this.propertyData.displayNotes.length >
            VendorDetailsComponent.MAX_NOTES_LENGTH
          )
            this.propertyData.displayNotes =
              this.propertyData.notes.substring(
                0,
                VendorDetailsComponent.MAX_NOTES_LENGTH
              ) + '...';

          if (this.propertyData.highValueAmenities.length === 0)
            this.showAllAmenities = true;

          if (this.propertyData.propertyID === 0) {
            this.propertyData.management += ' Offices';
            this.expandMgmt();
          }
        })
    )
  };

  private loadGallery() {
    this.subscriptions.push(
      this.layoutState$
        .pipe(
          filter(item =>
            (item !== null || item !== undefined) && (item.index !== null || item.index !== undefined)
          )
        )
        .subscribe(item =>
          (this.isGalleryVisible = item.index >= 0)
        )
    );
  }

  private loadList() {
    this.subscriptions.push(
      this.listService.subscription
        .pipe(isNotNullOrUndefined())
        .subscribe(() => {
          this.store.dispatch(SelectionActions.select({ properyID: this.propertyID }));
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

  expandMgmt() {
    this.isMgmtExpanded = true;
  }

  showGallery(visible, url) {
    if (!visible) {
      this.store.dispatch(LayoutActions.hideGallery());
      return;
    }

    if (url) url = url.replace('/micros/', '/standard/');
    else url = this.propertyData.photos[0];

    this.store.dispatch(LayoutActions.displayPhoto({ selectedImageUrl: url, images: this.propertyData.photos }))
    this.initAlbum();
  }

  initAlbum() {
    const inputElement = this.renderer.selectRootElement(
      'i.fa.fa-times-circle'
    );
    this.renderer.listen(inputElement, 'click', () => {
      this.store.dispatch(LayoutActions.hideGallery());
    });
  }
}
