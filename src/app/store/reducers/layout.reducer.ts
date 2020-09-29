import { createReducer, on, createFeatureSelector, createSelector } from "@ngrx/store";

import * as LayoutActions from "../actions/layout.actions";
import { ILayoutState } from "../interfaces/ILayoutState";

const initialState: ILayoutState = {
    index: null,
    imageIndex: 0,
    images: [],
    isFavSelected: false,
}

const gatLayoutFeatureState = createFeatureSelector<ILayoutState>('layoutState');

// export const getLayoutSlice = createSelector(
//     gatLayoutFeatureState,
//     state => state
// );

// export const getIsFavSelected = createSelector(
//     gatLayoutFeatureState,
//     state => state.isFavSelected
// )

export const layoutReducer = createReducer<ILayoutState>(
    initialState,
    on(LayoutActions.displayPhoto, (state, action) => {
        return {
            ...state,
            index: action.images.findIndex(item => {
                action.selectedImageUrl.toLocaleLowerCase() === item.toLocaleLowerCase()
            }),
            subsystem: '',
            message: '',
            images: action.images,
            imageIndex: action.images.findIndex(item => {
                action.selectedImageUrl.toLocaleLowerCase() === item.toLocaleLowerCase()
            })
        }
    }),
    on(LayoutActions.hideGallery, (state) => {
        return {
            ...state,
            index: -1,
            subsystem: 'photo-gallery',
            message: 'close'
        }
    }),
    on(LayoutActions.mapResetZoom, (state) => {
        return {
            ...state,
            subsystem: 'map',
            message: 'reset-zoom'
        }
    }),
    on(LayoutActions.mapLoadComplete, (state) => {
        return {
            ...state,
            subsystem: 'map',
            message: 'load-complete'
        }
    }),
    on(LayoutActions.toggleFavFilter, (state, action) => {
        return {
            ...state,
            isFavSelected: action.isFavSelected,
        }
    })
)
