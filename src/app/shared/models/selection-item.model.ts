export class SelectionItem {
  constructor(
    public propertyID: number,
    public lat: number,
    public lng: number,
    public marker: any,
    public favorite: boolean,
    public order: number
  ) { }
}
