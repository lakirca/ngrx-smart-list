import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/publishLast';
import { LoggingService } from '../LoggingService';

@Injectable()
export class PropertyService {
  private readonly baseUrl = 'https://app.smartapartmentdata.com/List/json';
  private subscription$: BehaviorSubject<any> = new BehaviorSubject(null);
  private listID: number;
  private token: string;
  private db = new Map<number, any>();
  private data: any;

  get subscription(): Observable<any> {
    return this.subscription$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private loggingService: LoggingService
  ) {}

  private fetch(propertyID: number): any {
    return this.http
      .get(
        `${this.baseUrl}/propertyItem.aspx?listID=${this.listID}&propertyID=${propertyID}&token=${this.token}`
      )
      .publishLast()
      .refCount();
  }

  private publish(data: Array<object>) {
    this.subscription$.next(data);
  }

  private transform(data: any) {
    function getWasherDryer(wdCode: string) {
      switch (wdCode) {
        case '':
          return 'No Connections';
        case 'STACKABLE_CONNECTIONS':
          return 'Stackable Connections';
        case 'STACKABLE_FURNISHED':
          return 'Stackable Included';
        case 'FULLSIZE_CONNECTIONS':
          return 'Fullsize Connections';
        case 'FULLSIZE_FURNISHED':
          return 'Fullsize Included';
      }
    }

    function getPetOptions(petInfo: any) {
      if (!petInfo || !petInfo.allowed) return [].concat('Not Allowed.');

      let desc = [];
      if (petInfo.breedRestriction) desc = desc.concat('No Aggressive Breeds');
      if (petInfo.limit === 1) desc = desc.concat('1 Pet Max');
      else if (petInfo.limit < 10)
        desc = desc.concat(petInfo.limit + ' Pets Max');

      if (petInfo.weight < 200)
        desc = desc.concat(petInfo.weight + ' lbs. limit');
      else if (petInfo.weight > 200) desc = desc.concat('No Weight Limit');

      if (petInfo.extraRent)
        desc = desc.concat('$' + petInfo.extraRent + '/mo extra');
      if (petInfo.nonRefundableFee > 0)
        desc = desc.concat(
          '$' + petInfo.nonRefundableFee + ' non-refundable deposit'
        );
      if (petInfo.interview) desc = desc.concat('Visual Inspection Required');

      return desc;
    }

    function getParkingOptions(parkingInfo: any) {
      let options = [];
      if (!parkingInfo) return options;
      if (parkingInfo.reserved) options = options.concat('Reserved');
      if (parkingInfo.garage) options = options.concat('Garage');
      if (parkingInfo.covered) options = options.concat('Covered');
      if (parkingInfo.detached) options = options.concat('Detached');
      return options;
    }

    data = { ...data, petOptions: getPetOptions(data.petInfo) };
    data = { ...data, parkingOptions: getParkingOptions(data.parking) };
    data.floorplans = data.floorplans.map((f) => {
      return {
        ...f,
        washerDryer: getWasherDryer(f.washerDryer),
      };
    });

    return data;
  }

  public load(listID: number, propertyID: number, token: string): void {
    this.listID = listID;
    this.token = token;

    // todo: bug https://hackernoon.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4
    // if (this.db && this.db.has(propertyID)) {
    //   this.data = this.db.get(propertyID);
    //   this.publish(this.data);
    //   return;
    // }

    this.fetch(propertyID).subscribe(
      (packet) => {
        if ('error' in packet) {
          this.publish(packet);
          return;
        }

        this.data = this.transform(packet);
        this.db.set(propertyID, this.data);
        this.publish(this.data);
      },
      (error) => {
        this.loggingService.logException('PropertyService.load()', '', error);
      }
    );
  }
}
