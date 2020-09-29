import { createAction, props } from '@ngrx/store';

export const loadLayouts = createAction('[Layout] Load Layouts');

export const loadLayoutsSuccess = createAction(
  '[Layout] Load Layouts Success',
  props<{ data: any }>()
);

export const loadLayoutsFailure = createAction(
  '[Layout] Load Layouts Failure',
  props<{ error: any }>()
);

export const displayPhoto = createAction(
  '[Layout Action] Display Photo',
  props<{ selectedImageUrl: string; images: Array<string> }>()
);

export const hideGallery = createAction('[Layout Action] Hide Gallery');

export const mapResetZoom = createAction('[Layout Action] Map Reset Zoom');

export const mapLoadComplete = createAction(
  '[Layout Action] Map Load Complete'
);

export const toggleFavFilter = createAction(
  '[Layout Action] Toggle Favorite Filter',
  props<{ isFavSelected: boolean }>()
);
