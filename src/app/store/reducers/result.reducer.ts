import {
  createReducer,
  on,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { ResultActions } from '../actions';

import { DataField } from '../interfaces/DataField';
import { ResultFilter } from '../interfaces/ResultFilter';
import { ResultState } from '../interfaces/ResultState';

const initialState: ResultState = {
  filters: null,
  unfiltered: [],
  filtered: [],
  showContactInfo: false,
  agentInfo: null,
  role: '',
  error: '',

  DisplayResults(): Array<object> {
    return !this.filters ? this.unfiltered : this.filtered;
  },
};

function getFilteredSelections(
  filters: ResultFilter,
  results: Array<any>
): Array<object> {
  if (!results) return;

  let bedrooms = [0, 1, 2, 3];
  let maxPrice = Number.MAX_SAFE_INTEGER;
  if (filters.bedrooms) bedrooms = filters.bedrooms;
  if (filters.maxPrice) maxPrice = filters.maxPrice;

  const filtered = [];
  results.forEach((record) => {
    const clone = { ...record };

    clone.floorplans = [];
    bedrooms.forEach((bedroom) => {
      const matches = record.floorplans.filter(
        (f) => f.bedrooms === bedroom && f.price <= maxPrice
      );
      if (matches.length) clone.floorplans = clone.floorplans.concat(matches);
    });

    if (filters.favorite && !clone.favorite) {
      // skip
    } else if (clone.floorplans.length) filtered.push(clone);
  });

  return filtered;
}

function updateDataField(
  dataset: Array<object>,
  data: DataField,
  propertyID: number
) {
  const h = [].concat(dataset);
  const index = h.findIndex((r) => r.propertyID === propertyID);
  if (index < 0) return dataset;

  const item = h[index];
  item[data.name] = data.value;
  h[index] = item;

  return h;
}

export const resultReducer = createReducer<ResultState>(
  initialState,
  on(ResultActions.loadResultsSuccess, (state, action): any => {
    return {
      ...state,
      filters: null,
      filtered: [],
      unfiltered: action.payload.records,
      showContactInfo: action.payload.showContactInfo,
      agentInfo: action.payload.agentInfo,
      role: action.payload.role,
    };
  }),
  on(ResultActions.loadResultsFailure, (state, action) => {
    return {
      ...state,
      filters: null,
      filtered: [],
      unfiltered: [],
      error: action.error,
    };
  }),
  on(
    ResultActions.filter,
    (state, action): ResultState => {
      return {
        ...state,
        filters: { ...state.filters, ...action.filters },
        filtered: getFilteredSelections(action.filters, state.unfiltered),
      };
    }
  ),
  on(ResultActions.save, (state, action) => {
    return {
      ...state,
      filters: null,
      filtered: [],
      unfiltered: action.results,
      showContactInfo: action.showContactInfo,
      agentInfo: action.agentInfo,
    };
  }),
  on(ResultActions.updateField, (state, action) => {
    if (!action.dataField || action.propertyID <= 0) return { ...state };
    const filtered = updateDataField(
      state.filtered,
      action.dataField,
      action.propertyID
    );
    const unfiltered = updateDataField(
      state.unfiltered,
      action.dataField,
      action.propertyID
    );
    return {
      ...state,
      filtered: filtered,
      unfiltered: unfiltered,
    };
  })
  // on(ResultActions.loadResult, (state) => {
  //     return {
  //         ...state
  //     }
  // }),
  // on(ResultActions.loadResultSuccess, (state, action) => {
  //     return {
  //         ...state,
  //         filters: null,
  //         filtered: [],
  //         unfiltered: action.payload.records,
  //         showContactInfo: action.payload.showContactInfo,
  //         agentInfo: action.payload.agentInfo,
  //         role: action.payload.role
  //     }
  // }),
  // on(ResultActions.loadResultError, (state, action) => {
  //     return {
  //         ...state,
  //         filters: null,
  //         filtered: [],
  //         unfiltered: [],
  //         error: action.error
  //     }
  // }),
);
