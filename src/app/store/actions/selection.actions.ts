import { createAction, props } from '@ngrx/store';
import { SelectionItem } from 'src/app/shared/models/selection-item.model';

export const loadSelections = createAction('[Selection] Load Selections');

export const loadSelectionsSuccess = createAction(
  '[Selection] Load Selections Success',
  props<{ data: any }>()
);

export const loadSelectionsFailure = createAction(
  '[Selection] Load Selections Failure',
  props<{ error: any }>()
);

export const saveSelections = createAction(
  '[Selection Action] Save Selection',
  props<{ selections: Array<SelectionItem> }>()
);

export const selectSelection = createAction(
  '[Selection Action] Select Selection',
  props<{ properyID: number }>()
);

export const unselectSelection = createAction('[Selection Action] Unselect');

export const favoriteSelection = createAction(
  '[Selection Action] Favorite Selection',
  props<{ propertyID: number }>()
);
export const unfavoriteSelection = createAction(
  '[Selection Action] Unfavorite Selection',
  props<{ propertyID: number }>()
);

// export const loadProperty = createAction(
//     'Load Property',
//     props<{ listID: number, propoertyID: number, token: string }>()
// )
// export const loadPropertySuccess = createAction(
//     'Load Property Success',
// )
// export const loadPropertyError = createAction(
//     'Load Property Error',
// )
export const select = createAction(
  '[Selection Action] Select',
  props<{ properyID: number }>()
);
export const unselect = createAction('[Selection Action] Unselect');
export const favorite = createAction(
  '[Selection Action] Favorite',
  props<{ propertyID: number }>()
);
export const unfavorite = createAction(
  '[Selection Action] Unfavorite',
  props<{ propertyID: number }>()
);
