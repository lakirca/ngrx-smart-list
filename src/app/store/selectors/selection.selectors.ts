import { createFeatureSelector, createSelector } from '@ngrx/store';

const getSelectionFeatureState = createFeatureSelector<any>('selectionState');

export const selectSelections = createSelector(
  getSelectionFeatureState,
  (state) => state
);
