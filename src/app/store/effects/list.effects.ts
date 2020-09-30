import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { ListService } from 'src/app/core/services/list.service';
import { LayoutActions, ResultActions } from '../actions';
import { AppState } from '../app.state';

@Injectable()
export class ListEffects {
  constructor(
    private actions$: Actions,
    private listService: ListService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  loadList$ = createEffect((): any => {
    return this.actions$.pipe(
      ofType(ResultActions.loadResults),
      mergeMap((action) =>
        this.listService.loadListData(action.listID, action.token).pipe(
          map((results: any) =>
            ResultActions.loadResultsSuccess({ payload: results })
          ),
          catchError((error: any) =>
            of(ResultActions.loadResultsFailure({ error }))
          )
        )
      )
    );
  });
}
