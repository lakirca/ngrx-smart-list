import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';

import { ListService } from './core/services/list.service';
import { GlobalErrorHandler } from './core/GlobalErrorHandler';
import { ListItemsComponent } from './list/containers/list-items/list-items.component';
import { VendorItemComponent } from './list/containers/list-items/vendor-item/vendor-item.component';
import { selectionReducer } from './store/reducers/selection.reducer';
import { layoutReducer } from './store/reducers/layout.reducer';
import { resultReducer } from './store/reducers/result.reducer';
import { PropertyService } from './core/services/property.service';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './core/components/footer/footer.component';
import { LoggingService } from './core/LoggingService';
import { ListFilterBedroomComponent } from './list/components/filters/bedroom/bedroom.component';
import { FavoriteComponent } from './list/components/filters/favorite/favorite.component';
import { ListFilterPriceComponent } from './list/components/filters/price/price.component';
import { ListItemGalleryComponent } from './list/components/list-item-gallery/list-item-gallery.component';
import { TipFreeServiceComponent } from './list/components/list-splash/list-splash';
import { ImageArrowComponent } from './list/containers/image-big-view/image-arrow/image-arrow.component';
import { ImageBigViewComponent } from './list/containers/image-big-view/image-big-view.component';
import { ListItemDetailsComponent } from './list/containers/list-item-details/list-item-details.component';
import { LocatorDetailsAmenitiesComponent } from './list/containers/list-item-details/locator-details/locator-details-amenities/locator-details-amenities.component';
import { LocatorDetailsExtraInfoComponent } from './list/containers/list-item-details/locator-details/locator-details-extra-info/locator-details-extra-info.component';
import { LocatorDetailsFaviconComponent } from './list/containers/list-item-details/locator-details/locator-details-favicon/locator-details-favicon.component';
import { LocatorDetailsFloorplansComponent } from './list/containers/list-item-details/locator-details/locator-details-floorplans/locator-details-floorplans.component';
import { LocatorDetailsLinksComponent } from './list/containers/list-item-details/locator-details/locator-details-links/locator-details-links.component';
import { LocatorDetailsNotesComponent } from './list/containers/list-item-details/locator-details/locator-details-notes/locator-details-notes.component';
import { LocatorDetailsPhotosComponent } from './list/containers/list-item-details/locator-details/locator-details-photos/locator-details-photos.component';
import { LocatorDetailsSpecialsComponent } from './list/containers/list-item-details/locator-details/locator-details-specials/locator-details-specials.component';
import { LocatorDetailsSubheadingComponent } from './list/containers/list-item-details/locator-details/locator-details-subheading/locator-details-subheading.component';
import { LocatorDetailsComponent } from './list/containers/list-item-details/locator-details/locator-details.component';
import { VendorDetailsManagerComponent } from './list/containers/list-item-details/vendor-details/vendor-details-manager/vendor-details-manager.component';
import { VendorDetailsRegionalComponent } from './list/containers/list-item-details/vendor-details/vendor-details-regional/vendor-details-regional.component';
import { VendorDetailsComponent } from './list/containers/list-item-details/vendor-details/vendor-details.component';
import { CardComponent } from './list/containers/list-items/locator-item/locator-item.component';
import { ListMainExpandMapSwitchComponent } from './list/containers/list-main/list-main-expand-map-switch/list-main-expand-map-switch.component';
import { ListMainMapSwitchComponent } from './list/containers/list-main/list-main-map-switch/list-main-map-switch.component';
import { ListMainComponent } from './list/containers/list-main/list-main.component';
import { MapItemsComponent } from './list/containers/list-map/map-items.component';
import { AccessDeniedComponent } from './core/components/access-denied/access-denied.component';
import { ListEffects } from './store/effects/list.effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    AppComponent,
    ListItemsComponent,
    ListItemDetailsComponent,
    MapItemsComponent,
    ListMainComponent,
    ListItemGalleryComponent,
    ListFilterBedroomComponent,
    ListFilterPriceComponent,
    TipFreeServiceComponent,
    FavoriteComponent,
    FooterComponent,
    CardComponent,
    VendorItemComponent,
    LocatorDetailsComponent,
    VendorDetailsComponent,
    LocatorDetailsLinksComponent,
    LocatorDetailsSubheadingComponent,
    LocatorDetailsPhotosComponent,
    LocatorDetailsFaviconComponent,
    LocatorDetailsNotesComponent,
    ListMainMapSwitchComponent,
    LocatorDetailsSpecialsComponent,
    LocatorDetailsFloorplansComponent,
    LocatorDetailsExtraInfoComponent,
    LocatorDetailsAmenitiesComponent,
    VendorDetailsManagerComponent,
    VendorDetailsRegionalComponent,
    ListMainExpandMapSwitchComponent,
    ImageBigViewComponent,
    ImageArrowComponent,
    AccessDeniedComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTabsModule,
    StoreModule.forRoot({
      selectionState: selectionReducer,
      layoutState: layoutReducer,
      resultState: resultReducer,
    }),
    StoreDevtoolsModule.instrument({
      name: 'Smart App Dev Tool',
      maxAge: 50,
    }),
    EffectsModule.forRoot([ListEffects]),
  ],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    LoggingService,
    ListService,
    PropertyService,
    //ListItemDetailsResolver,
    //LoadPropertyResolver
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
