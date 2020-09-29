import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import { LayoutActions } from '../actions';
import { LayoutState } from '../interfaces/LayoutState';

const initialState: LayoutState = {
  index: null,
  imageIndex: 0,
  images: [],
  isFavSelected: false,
};

const gatLayoutFeatureState = createFeatureSelector<LayoutState>('layoutState');

export const layoutReducer = createReducer(
  initialState,
  on(LayoutActions.displayPhoto, (state, action) => {
    return {
      ...state,
      index: action.images.findIndex((item) => {
        action.selectedImageUrl.toLocaleLowerCase() ===
          item.toLocaleLowerCase();
      }),
      subsystem: '',
      message: '',
      images: action.images,
      imageIndex: action.images.findIndex((item) => {
        action.selectedImageUrl.toLocaleLowerCase() ===
          item.toLocaleLowerCase();
      }),
    };
  }),
  on(LayoutActions.hideGallery, (state) => {
    return {
      ...state,
      index: -1,
      subsystem: 'photo-gallery',
      message: 'close',
    };
  }),
  on(LayoutActions.mapResetZoom, (state) => {
    return {
      ...state,
      subsystem: 'map',
      message: 'reset-zoom',
    };
  }),
  on(LayoutActions.mapLoadComplete, (state) => {
    return {
      ...state,
      subsystem: 'map',
      message: 'load-complete',
    };
  }),
  on(LayoutActions.toggleFavFilter, (state, action) => {
    return {
      ...state,
      isFavSelected: action.isFavSelected,
    };
  })
);
