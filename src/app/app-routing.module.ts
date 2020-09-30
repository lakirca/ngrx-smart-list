import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessDeniedComponent } from './core/components/access-denied/access-denied.component';
import { ListItemDetailsComponent } from './list/containers/list-item-details/list-item-details.component';

import { ListItemsComponent } from './list/containers/list-items/list-items.component';
import { ListMainComponent } from './list/containers/list-main/list-main.component';
//import { LoadPropertyResolver } from './list/list-item-details/load-property-resolver.service';

const appRoutes: Routes = [
  {
    path: ':listID/:token',
    component: ListMainComponent,
    children: [
      { path: '', component: ListItemsComponent },
      { path: ':propertyID', component: ListItemDetailsComponent }, //resolve: { poperties: LoadPropertyResolver } },
    ],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
    data: { title: 'Access Denied' },
  },
  {
    path: '**',
    redirectTo: '/access-denied',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
