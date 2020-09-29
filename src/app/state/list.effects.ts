// import { ListService } from '../core/services/list.service';
// import { Injectable } from '@angular/core';
// import { createEffect, Actions, ofType } from '@ngrx/effects';
// import * as ResultsActions from '../ngrx/actions/result.actions';
// import * as SelectionActions from '../ngrx/actions/selection.actions';
// import { mergeMap, map, tap, catchError, switchMap } from 'rxjs/operators';
// import { of } from 'rxjs';

// @Injectable()

// export class ListEffects {
//     constructor(private actions$: Actions, private listService: ListService) { }

//     loadList$ = createEffect(() => {
//         return this.actions$
//             .pipe(
//                 ofType(ResultsActions.loadResult),
//                 mergeMap((action) => this.listService.load(action.listID, action.token, action.receipt)
//                     .pipe(
//                         map(results =>
//                             ResultsActions.loadResultSuccess({ payload: results }))
//                         //tap(results => SelectionActions.saveSelections({ selections: results.payload.records })),
//                     )),
//                 catchError(error => of(ResultsActions.loadResultError({ error })))
//             )
//     })
// }