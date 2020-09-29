import { createAction, props } from '@ngrx/store';
import { DataField } from '../interfaces/DataField';
import { ResultsFilter } from '../interfaces/ResultsFilter';

export const filterResults = createAction(
  '[Result] Filter Results',
  props<{ filters: ResultsFilter }>()
);

export const updatePropertyInItem = createAction(
  '[Result] Update Property In Item',
  props<{ propertyID: number; dataField: DataField }>()
);

export const loadResults = createAction(
  '[Result] Load Results',
  props<{ listID: number; token: string; receipt: string }>()
);

export const loadResultsSuccess = createAction(
  '[Result] Load Results Success',
  props<{ payload: any }>()
);

export const loadResultsFailure = createAction(
  '[Result] Load Results Failure',
  props<{ error: any }>()
);

export const save = createAction(
  '[Result Action] Save Results',
  props<{
    results: Array<object>;
    showContactInfo: boolean;
    agentInfo: object;
  }>()
);

export const filter = createAction(
  '[Result Action] Results Filter',
  props<{ filters: ResultsFilter }>()
);

export const updateField = createAction(
  '[Result Action] Update Property In Item',
  props<{ propertyID: number; dataField: DataField }>()
);
