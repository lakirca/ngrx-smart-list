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

import { FooterComponent } from './core/footer/footer.component';

import { ListService } from './core/services/list.service';
import { LoggingService } from './core/services/LoggingService';
import { GlobalErrorHandler } from './shared/GlobalErrorHandler';

import { ListItemsComponent } from './list/list-items/list-items.component';
import { ListItemDetailsComponent } from './list/list-item-details/list-item-details.component';
import { MapItemsComponent } from './list/list-map/map-items.component';
import { ListMainComponent } from './list/list-main/list-main.component';
import { ListItemGalleryComponent } from './list/list-item-gallery/list-item-gallery.component';
import { ListFilterBedroomComponent } from './list/filters/bedroom/bedroom.component';
import { ListFilterPriceComponent } from './list/filters/price/price.component';
import { TipFreeServiceComponent } from './list/list-splash/list-splash';
import { FavoriteComponent } from './list/filters/favorite/favorite.component';
import { CardComponent } from './list/list-items/locator-item/locator-item.component';
import { VendorItemComponent } from './list/list-items/vendor-item/vendor-item.component';
import { LocatorDetailsComponent } from './list/list-item-details/locator-details/locator-details.component';
import { VendorDetailsComponent } from './list/list-item-details/vendor-details/vendor-details.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsLinksComponent } from './list/list-item-details/locator-details/locator-details-links/locator-details-links.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsSubheadingComponent } from './list/list-item-details/locator-details/locator-details-subheading/locator-details-subheading.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsPhotosComponent } from './list/list-item-details/locator-details/locator-details-photos/locator-details-photos.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsFaviconComponent } from './list/list-item-details/locator-details/locator-details-favicon/locator-details-favicon.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsNotesComponent } from './list/list-item-details/locator-details/locator-details-notes/locator-details-notes.component';
import { AppRoutingModule } from './app-routing.module';
import { ListMainMapSwitchComponent } from './list/list-main/list-main-map-switch/list-main-map-switch.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsSpecialsComponent } from './list/list-item-details/locator-details/locator-details-specials/locator-details-specials.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsFloorplansComponent } from './list/list-item-details/locator-details/locator-details-floorplans/locator-details-floorplans.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsExtraInfoComponent } from './list/list-item-details/locator-details/locator-details-extra-info/locator-details-extra-info.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsAmenitiesComponent } from './list/list-item-details/locator-details/locator-details-amenities/locator-details-amenities.component';
// tslint:disable-next-line: max-line-length
import { VendorDetailsManagerComponent } from './list/list-item-details/vendor-details/vendor-details-manager/vendor-details-manager.component';
// tslint:disable-next-line: max-line-length
import { VendorDetailsRegionalComponent } from './list/list-item-details/vendor-details/vendor-details-regional/vendor-details-regional.component';
import { ListMainExpandMapSwitchComponent } from './list/list-main/list-main-expand-map-switch/list-main-expand-map-switch.component';
import { ImageBigViewComponent } from './list/image-big-view/image-big-view.component';
import { ImageArrowComponent } from './list/image-big-view/image-arrow/image-arrow.component';

import { selectionsReducer } from './store/reducers/selection.reducer';
import { layoutReducer } from './store/reducers/layout.reducer';
import { resultsReducer } from './store/reducers/result.reducer';
//import { EffectsModule } from '@ngrx/effects';
//import { ListEffects } from './state/list.effects';
import { AccessDeniedModule } from './modules/access-denied/access-denied.module';
import { PropertyService } from './core/services/property.service';
//import { LoadPropertyResolver } from './list/list-item-details/load-property-resolver.service';

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
      selectionsState: selectionsReducer,
      layoutState: layoutReducer,
      resultsState: resultsReducer,
    }),
    StoreDevtoolsModule.instrument({
      name: 'Smart App Dev Tool',
      maxAge: 50,
    }),
    //EffectsModule.forRoot([ListEffects]),
    AccessDeniedModule,
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
