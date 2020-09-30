import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/publishLast';
import { AppState } from 'src/app/store/app.state';
import { SelectionActions, ResultActions } from '../../store/actions/index';
import { LoggingService } from '../LoggingService';

@Injectable()
export class ListService {
  private readonly baseUrl = 'https://app.smartapartmentdata.com/List/json';
  private subscription$: BehaviorSubject<any> = new BehaviorSubject(null);
  private isDirty: boolean;
  private data: any;
  private listID: number;
  private token: string;
  private receipt = undefined;

  get IsReady(): boolean {
    return this.data;
  }

  get ListID(): number {
    return this.listID;
  }

  get Token(): string {
    return this.token;
  }

  get Records(): Array<object> {
    return this.data.records;
  }

  get AgentInfo(): object {
    return this.data.agentInfo;
  }

  // this is a finite observable so we do not need to worry about unsubscribe
  get subscription(): Observable<any> {
    return this.subscription$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private loggingService: LoggingService,
    private store: Store<AppState>
  ) {}

  private fetch(listID: number, token: string) {
    this.listID = listID;
    this.token = token;

    return this.http
      .get(
        `${this.baseUrl}/listItems.aspx?listID=${this.listID}&token=${this.token}&receipt=${this.receipt}`
      )
      .publishLast()
      .refCount();
  }

  loadListData(listID: number, token: string): any {
    this.listID = listID;
    this.token = token;

    return this.http.get(
      `${this.baseUrl}/listItems.aspx?listID=${this.listID}&token=${this.token}`
    );
  }
  public toggleFavorite(propertyID: number, isFavorite: boolean) {
    if (isFavorite) {
      this.store.dispatch(SelectionActions.favorite({ propertyID }));
      this.store.dispatch(
        ResultActions.updateField({
          propertyID,
          dataField: { name: 'favorite', value: true },
        })
      );
    } else {
      this.store.dispatch(SelectionActions.unfavorite({ propertyID }));
      this.store.dispatch(
        ResultActions.updateField({
          propertyID,
          dataField: { name: 'favorite', value: false },
        })
      );
    }

    this.isDirty = true;

    const payload = {
      listID: this.listID,
      token: this.token,
      propertyID,
      isFavorite,
    };

    return this.http.post(
      `${this.baseUrl}/updateListItem.aspx`,
      JSON.stringify(payload)
    );
  }

  public publish(data: Array<object>) {
    this.subscription$.next(data);
  }

  public load(listID: number, token: string, receipt?: string): void {
    this.listID = listID;
    this.token = token;
    if (receipt) this.receipt = receipt;

    if (this.data && !this.isDirty) {
      this.data = this.subscription$.getValue();
      return;
    }

    this.fetch(listID, token).subscribe(
      (packet) => {
        this.isDirty = false;
        this.data = packet;
        this.publish(this.data);
      },
      (error) => {
        this.loggingService.logException('ListService.load()', '', error);
      }
    );
  }
}
