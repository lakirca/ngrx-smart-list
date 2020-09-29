import { ISelectionsState } from "src/app/store/interfaces/ISelectionState";
import { ILayoutState } from "src/app/store/interfaces/ILayoutState";
import { IResultState } from "src/app/store/interfaces/IResultState";

export interface AppState {
    selectionsState: ISelectionsState,
    resultsState: IResultState,
    layoutState: ILayoutState
}