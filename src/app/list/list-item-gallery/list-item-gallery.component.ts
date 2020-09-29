import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { PropertyService } from '../../core/services/property.service';
import * as LayoutActions from '../../store/actions/layout.actions';
import { AppState } from 'src/app/state/app.state';

@Component({
  selector: 'app-list-item-gallery',
  templateUrl: './list-item-gallery.component.html',
  styleUrls: ['./list-item-gallery.component.scss'],
})
export class ListItemGalleryComponent implements OnInit, OnDestroy {
  property$;
  propertyData;

  constructor(
    private propertyService: PropertyService,
    private store: Store<AppState>
  ) { }

  ngOnDestroy() {
    this.property$.unsubscribe();
  }

  ngOnInit() {
    this.property$ = this.propertyService.subscription.subscribe(
      (data: any) => {
        if (!data) return;

        this.propertyData = data;
      }
    );
  }

  showGallery(url) {
    this.store.dispatch(LayoutActions.displayPhoto(
      {
        selectedImageUrl: url.replace('/previews/', '/standard/'),
        images: this.propertyData.photos
      }
    ));
  }
}
