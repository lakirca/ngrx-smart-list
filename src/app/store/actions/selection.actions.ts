import { createAction, props } from '@ngrx/store'

import { SelectionItem } from 'src/app/shared/models/selection-item.model'

export const saveSelections = createAction(
    '[Selection Action] Save Selection',
    props<{ selections: Array<SelectionItem> }>()
)
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
)
export const unselect = createAction(
    '[Selection Action] Unselect'
)
export const favorite = createAction(
    '[Selection Action] Favorite',
    props<{ propertyID: number }>()
)
export const unfavorite = createAction(
    '[Selection Action] Unfavorite',
    props<{ propertyID: number }>()
)

export interface ISelectionsAction {
    type: string;
    propertyID?: number;
    selections?: Array<any>;
}