import {
  createReducer,
  on,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import * as SelectionActions from '../actions/selection.actions';
import { SelectionItem } from 'src/app/shared/models/selection-item.model';
import { SelectionState } from '../interfaces/SelectionState';

const initialState: SelectionState = {
  previousSelection: null,
  currentSelection: null,
  selections: [],
};

const gatSelectionFeatureState = createFeatureSelector<SelectionState>(
  'selectionState'
);

export const getPreviousSelection = createSelector(
  gatSelectionFeatureState,
  (state) => state.previousSelection
);

// export const getCurrentSelection = createSelector(
//     gatSelectionFeatureState,
//     state => state.currentSelection
// );

// export const getSelections = createSelector(
//     gatSelectionFeatureState,
//     state => state.selections
// );

// export const getUnselect = createSelector(
//     gatSelectionFeatureState,
//     state => state.selections.slice()
// );

// export const getSelectionSlice = createSelector(
//     gatSelectionFeatureState,
//     state => state
// );

function toggleFavorite(
  propertyID: number,
  isFav: boolean,
  selections: Array<SelectionItem>
): Array<SelectionItem> {
  const clone = selections.slice();
  const item = clone.find((f) => f.propertyID === propertyID);
  if (item) item.favorite = isFav;

  return clone;
}

export const selectionReducer = createReducer<SelectionState>(
  initialState,
  on(
    SelectionActions.saveSelections,
    (state, action): SelectionState => {
      return {
        ...state,
        previousSelection: null,
        currentSelection: null,
        selections: [].concat(action.selections),
      };
    }
  ),
  on(
    SelectionActions.unselect,
    (state): SelectionState => {
      return {
        ...state,
        previousSelection: state.currentSelection,
        currentSelection: null,
        selections: state.selections.slice(),
      };
    }
  ),
  on(SelectionActions.select, (state, action) => {
    if (
      state.currentSelection &&
      action.properyID === state.currentSelection.propertyID
    )
      return state;

    return {
      ...state,
      previousSelection: state.currentSelection,
      currentSelection: state.selections.find(
        (r) => r.propertyID === action.properyID
      ),
      selections: state.selections.slice(),
    };
  }),
  on(SelectionActions.favorite, (state, action) => {
    return {
      ...state,
      selections: toggleFavorite(action.propertyID, true, state.selections),
    };
  }),
  on(SelectionActions.unfavorite, (state, action) => {
    return {
      ...state,
      selections: toggleFavorite(action.propertyID, false, state.selections),
    };
  })
);
