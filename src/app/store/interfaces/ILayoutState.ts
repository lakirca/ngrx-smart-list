export interface ILayoutState {
    index?: number;
    subsystem?: string;
    message?: string;
    images: string[];
    imageIndex: number;
    isFavSelected: boolean;
}

export interface ILayoutAction {
    type: string;
    images: Array<string>;
    selectedImageUrl: string;
    isFavSelected: boolean;
}
