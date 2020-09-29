export interface IResultState {
    showContactInfo: boolean;
    agentInfo: object;
    filters: IResultsFilter;
    unfiltered: Array<object>;
    filtered: Array<object>;
    role?: string;
    error: string;

    DisplayResults(): Array<object>;
}

export interface IResultsFilter {
    bedrooms?: Array<number>;
    maxPrice?: number;
    favorite?: boolean;
}

export interface IDataField {
    name: string;
    value: any;
}