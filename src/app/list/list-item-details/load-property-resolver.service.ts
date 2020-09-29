// import { Injectable } from '@angular/core';
// import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { ListService } from 'src/app/core/services/list.service';
// import { PropertyService } from 'src/app/core/services/property.service';
// import { Observable } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class LoadPropertyResolver implements Resolve<any> {
//     constructor(private propertyService: PropertyService, private listService: ListService) { }

//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
//         this.propertyService.load()
//     }
// }