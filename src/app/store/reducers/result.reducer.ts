import { Action, createReducer, on } from '@ngrx/store';
import { ResultActions } from '../actions';
import { AppState } from '../app.state';
import { DataField } from '../interfaces/DataField';
import { ResultsFilter } from '../interfaces/ResultsFilter';
import { ResultsState } from '../interfaces/ResultsState';

export const resultFeatureKey = 'result';

export const initialState: ResultsState = {
  filters: null,
  unfiltered: [],
  filtered: [],
  showContactInfo: false,
  agentInfo: null,

  DisplayResults(): Array<object> {
    return !this.filters ? this.unfiltered : this.filtered;
  },
  error: '',
};

export const resultReducer = createReducer<ResultsState>(
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
  on(ResultActions.filterResults, (state, action: any) => {
    return {
      ...state,
      filters: { ...state.filters, ...action.filters }, // merge the two together
      filtered: getFilteredSelections(action.filters, state.unfiltered),
    };
  }),
  on(ResultActions.updatePropertyInItem, (state, action: any) => {
    if (!action.dataField || action.propertyID <= 0) {
      return { ...state };
    }

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
  }),
  on(
    ResultActions.filter,
    (state, action): ResultsState => {
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
);

function getFilteredSelections(
  filters: ResultsFilter,
  results: Array<any>
): Array<object> {
  if (!results) {
    return;
  }

  let bedrooms = [0, 1, 2, 3];
  let maxPrice = Number.MAX_SAFE_INTEGER;
  if (filters.bedrooms) {
    bedrooms = filters.bedrooms;
  }
  if (filters.maxPrice) {
    maxPrice = filters.maxPrice;
  }

  const filtered = [];
  results.forEach((record) => {
    const clone = { ...record };

    clone.floorplans = [];
    bedrooms.forEach((bedroom) => {
      const matches = record.floorplans.filter(
        (f) => f.bedrooms === bedroom && f.price <= maxPrice
      );
      if (matches.length) {
        clone.floorplans = clone.floorplans.concat(matches);
      }
    });

    if (filters.favorite && !clone.favorite) {
      // skip
    } else if (clone.floorplans.length) {
      filtered.push(clone);
    }
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
  if (index < 0) {
    return dataset;
  }

  const item = h[index];
  item[data.name] = data.value;
  h[index] = item;

  return h;
}
