import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LayoutState } from '../interfaces/LayoutState';

const getLayoutFeatureState = createFeatureSelector<LayoutState>('layoutState');

export const selectLayoutIndex = createSelector(
  getLayoutFeatureState,
  (state) => state.imageIndex
);

export const isFavSelected = createSelector(
  getLayoutFeatureState,
  (state) => state.isFavSelected
);
