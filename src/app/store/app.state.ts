import { LayoutState } from './interfaces/LayoutState';
import { ResultsState } from './interfaces/ResultsState';
import { SelectionState } from './interfaces/SelectionState';

export class AppState {
  selectionState: SelectionState;
  resultState: ResultsState;
  layoutState: LayoutState;
}

export const InitialAppState: AppState = {
  selectionState: {
    previousSelection: null,
    currentSelection: null,
    selections: [],
  },

  resultState: {
    filters: null,
    unfiltered: [],
    filtered: [],
    showContactInfo: false,
    agentInfo: null,
    error: '',
    DisplayResults(): Array<object> {
      return !this.filters ? this.unfiltered : this.filtered;
    },
  },

  layoutState: {
    index: null,
    imageIndex: 0,
    images: [],
    isFavSelected: false,
  },
};
