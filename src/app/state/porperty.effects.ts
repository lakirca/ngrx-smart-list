// import { PropertyService } from '../core/services/property.service';
// import { Injectable } from '@angular/core';
// import { createEffect, Actions, ofType } from '@ngrx/effects';
// import * as SelectionActions from '../ngrx/actions/selection.actions';
// import { mergeMap, map, tap, catchError, switchMap } from 'rxjs/operators';
// import { of } from 'rxjs';

// @Injectable()

// export class PropertyEffects {
//     constructor(private actions$: Actions, private propertyService: PropertyService) { }

//     loadProperty$ = createEffect(() => {
//         return this.actions$
//             .pipe(
//                 ofType(SelectionActions.loadProperty),
//                 mergeMap((action) => this.propertyService.load(action.listID, action.propoertyID, action.token)
//                     .pipe(
//                         map(results =>
//                             SelectionActions.select({properyID: action.propoertyID}))
//                         //tap(results => SelectionActions.saveSelections({ selections: results.payload.records })),
//                     )),
//                 catchError(error => of(SelectionActions.loadPropertyError()))
//             )
//     })
// }