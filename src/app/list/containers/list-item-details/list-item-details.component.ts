import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ListService } from 'src/app/core/services/list.service';

import { isNotNullOrUndefined } from 'src/app/shared/_shared';

@Component({
  selector: 'app-list-item-details',
  templateUrl: './list-item-details.component.html',
  styleUrls: ['./list-item-details.component.scss'],
})
export class ListItemDetailsComponent implements OnDestroy, OnInit {
  subscriptions: Array<Subscription> = [];
  role;

  constructor(
    private listService: ListService
  ) { }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  load() {
    this.subscriptions.push(
      this.listService.subscription
        .pipe(isNotNullOrUndefined())
        .subscribe((data: any) => {
          this.role = data.role;
        })
    );
  }
}
