import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListMainComponent } from './list/list-main/list-main.component';
import { ListItemsComponent } from './list/list-items/list-items.component';
import { ListItemDetailsComponent } from './list/list-item-details/list-item-details.component';
//import { LoadPropertyResolver } from './list/list-item-details/load-property-resolver.service';

const appRoutes: Routes = [
  {
    path: ':listID/:token',
    component: ListMainComponent,
    children: [
      { path: '', component: ListItemsComponent },
      { path: ':propertyID', component: ListItemDetailsComponent }//resolve: { poperties: LoadPropertyResolver } },
    ],
  },
  {
    path: 'access-denied',
    loadChildren: () => import('./modules/access-denied/access-denied.module').then(m => m.AccessDeniedModule),
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
export class AppRoutingModule { }
