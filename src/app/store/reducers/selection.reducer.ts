import { Action, createReducer, on } from '@ngrx/store';
import { SelectionItem } from 'src/app/shared/models/selection-item.model';
import { SelectionActions } from '../actions';
import { SelectionState } from '../interfaces/SelectionState';

export const selectionFeatureKey = 'selection';

export const initialState: SelectionState = {
  previousSelection: null,
  currentSelection: null,
  selections: [],
};

export const selectionReducer = createReducer(
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
    SelectionActions.unselectSelection,
    (state): SelectionState => {
      return {
        ...state,
        previousSelection: state.currentSelection,
        currentSelection: null,
        selections: state.selections.slice(),
      };
    }
  ),
  on(SelectionActions.selectSelection, (state, action) => {
    if (
      state.currentSelection &&
      action.properyID === state.currentSelection.propertyID
    ) {
      return state;
    }

    return {
      ...state,
      previousSelection: state.currentSelection,
      currentSelection: state.selections.find(
        (r) => r.propertyID === action.properyID
      ),
      selections: state.selections.slice(),
    };
  }),
  on(SelectionActions.favoriteSelection, (state, action) => {
    return {
      ...state,
      selections: toggleFavorite(action.propertyID, true, state.selections),
    };
  }),
  on(SelectionActions.unfavoriteSelection, (state, action) => {
    return {
      ...state,
      selections: toggleFavorite(action.propertyID, false, state.selections),
    };
  }),
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

function toggleFavorite(
  propertyID: number,
  isFav: boolean,
  selections: Array<SelectionItem>
): Array<SelectionItem> {
  const clone = selections.slice();
  const item = clone.find((f) => f.propertyID === propertyID);
  if (item) {
    item.favorite = isFav;
  }

  return clone;
}
