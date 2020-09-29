import { SelectionItem } from 'src/app/shared/models/selection-item.model'

export interface ISelectionsState {
    previousSelection: SelectionItem;
    currentSelection: SelectionItem;
    selections: Array<SelectionItem>;
}