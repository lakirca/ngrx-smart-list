import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDrawer } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isNotNullOrUndefined, XS_SCREEN } from 'src/app/shared/_shared';
import { MapItemsComponent } from '../list-map/map-items.component';
import { animationShow } from './configs/animations';
import { PropertyService } from 'src/app/core/services/property.service';
import { ListService } from 'src/app/core/services/list.service';
import { SelectionState } from 'src/app/store/interfaces/SelectionState';
import { LayoutState } from 'src/app/store/interfaces/LayoutState';
import { AppState } from 'src/app/store/app.state';
import { LayoutActions, ResultActions } from 'src/app/store/actions';
import { NgxGalleryImage } from 'src/app/shared/models/ngrx-gallery.model';

@Component({
  selector: 'app-list-main',
  templateUrl: './list-main.component.html',
  styleUrls: ['./list-main.component.scss'],
  animations: [animationShow],
})
export class ListMainComponent implements OnInit, OnDestroy {
  @ViewChild('drawer', { static: false })
  drawer: MatDrawer;

  @ViewChild('mapRef', { static: false })
  mapRef: MapItemsComponent;

  showWelcome: 'never' | 'show' | 'shown' = 'never';
  showAlbum = false;
  showMap = true;
  showSideNav = true;
  mobileVersion = false;
  showExpandButton = false;
  screenWidth = 0;
  mapOpened = false;
  //results$: Observable<any>;
  //error$: Observable<string>;
  selectionState$: Observable<SelectionState>;
  layoutState$: Observable<LayoutState>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private listService: ListService,
    private title: Title
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.showWelcome === 'show') {
      return;
    }

    this.manageSlider(window.innerWidth);
  }

  private manageSlider(width: number) {
    this.screenWidth = width;
    if (this.screenWidth < XS_SCREEN) {
      if (!this.mobileVersion) {
        this.mobileVersion = true;
      }
    } else if (this.screenWidth >= XS_SCREEN) {
      this.mapOpened = false;
      this.mobileVersion = false;
      this.showExpandButton = false;

      if (this.drawer && !this.drawer.opened) {
        this.drawer.toggle();
      }
      if (this.mapRef) {
        this.mapRef.fitBounds();
      }
    }
  }

  scrollToTop() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const contentContainer =
          <any>(
            document.querySelector(
              '.mat-sidenav.mat-sidenav-opened.mat-sidenav-side'
            )
          ) || window;
        contentContainer.scrollTop = 0;
      });
  }

  ngOnInit() {
    this.store.dispatch(
      ResultActions.loadResults({
        listID: 5363950,
        token: '5AE7DFB40500DDC03BC84BD3F0A8AC0F18784B1E',
        receipt: undefined,
      })
    );
    
    this.selectionState$ = this.store.select('selectionState');
    this.layoutState$ = this.store.select('layoutState');

    this.manageSlider(window.innerWidth);
    this.scrollToTop();
    this.loadList();

    this.layoutState$.subscribe((item) => {
      if (
        item &&
        item.subsystem === 'map' &&
        item.message === 'load-complete'
      ) {
        this.onMapLoaded();
      }

      if (
        item &&
        item.subsystem === 'photo-gallery' &&
        item.message === 'close'
      ) {
        this.hideGallery();
      }

      if (!item || item.index == null) return;

      if (item.index < 0) {
        this.showAlbum = false;
        this.showMap = true;
        return;
      }

      this.showWelcome = 'shown';
      this.showAlbum = true;
      this.showMap = false;
    });

    this.selectionState$
      .pipe(filter((item) => item !== null && item.currentSelection !== null))
      .subscribe((item) => {
        console.log(item);
        this.router.navigate([item.currentSelection.propertyID], {
          relativeTo: this.route,
        });
      });
  }

  onToggle(opened: boolean) {
    if (!this.showMap) {
      this.showMap = true;
    }
    this.mapOpened = opened;
    if (opened && this.mapRef) {
      this.mapRef.fitBounds();
    }
    this.showExpandButton = false;
  }

  onMapZoomedIn() {
    if (this.showSideNav) {
      this.showExpandButton = true;
    }

    if (this.mobileVersion && this.drawer && !this.drawer.opened) {
      this.mapOpened = false;
      this.showExpandButton = false;
      this.drawer.toggle();
    }
  }

  onExpandMap() {
    if (this.mapRef) {
      this.mapRef.fitBounds();
      this.showExpandButton = false;
    }
  }

  private loadList() {
    if (
      !this.route.snapshot.paramMap.has('listID') ||
      !this.route.snapshot.paramMap.has('token')
    )
      return;

    this.listService.load(
      +this.route.snapshot.paramMap.get('listID'),
      this.route.snapshot.paramMap.get('token'),
      this.route.snapshot.queryParams['receipt']
    );


    this.listService.subscription
        .pipe(isNotNullOrUndefined())
        .subscribe((data: any) => {
          if (data.error) this.router.navigate(['/access-denied']);

          this.title.setTitle(data.agentInfo.company);
          this.store.dispatch(
            ResultActions.save({
              results: data.records,
              showContactInfo: data.showContactInfo,
              agentInfo: data.agentInfo,
            })
          );
          this.store.dispatch(LayoutActions.mapResetZoom());
        })
  }

  onMapLoaded() {
    this.store.dispatch(LayoutActions.mapResetZoom());

    if ('receipt' in this.route.parent.snapshot.queryParams) {
      this.showSideNav = false;
      if (this.showWelcome === 'never') {
        this.showSplashScreen();
      } else {
        this.showWelcome = 'shown';
      }
    }
  }

  hideGallery() {
    this.showWelcome = 'shown';
    this.showAlbum = false;
    this.showMap = true;
  }

  private showSplashScreen() {
    this.showMap = false;
    this.showWelcome = 'show';
  }

  closeSplashScreen() {
    this.showWelcome = 'shown';
    this.showSideNav = true;
    this.showMap = true;

    setTimeout(() => {
      this.drawer.toggle();
    }, 200);

    this.manageSlider(window.innerWidth);

    if (this.showMap && this.mapRef) {
      this.mapRef.fitBounds();
    }
  }

  get needToShowGallery() {
    return !this.showMap && this.showWelcome !== 'show';
  }

  get needToShowMenuIcon() {
    return (
      this.mobileVersion &&
      !this.showAlbum &&
      this.mapOpened &&
      this.showWelcome !== 'show'
    );
  }

  get needToShowMapIcon() {
    return (
      this.mobileVersion &&
      !this.showAlbum &&
      !this.mapOpened &&
      this.showWelcome !== 'show'
    );
  }

  get needToShowExpandMapIcon() {
    return this.mobileVersion && this.showExpandButton && !this.showAlbum;
  }

  ngOnDestroy(): void {}
}
