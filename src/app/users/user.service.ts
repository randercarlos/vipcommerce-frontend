import { throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { environment } from './../../environments/environment';
import { User } from './user.model';
import { BaseCrudService } from '../core/services/base-crud.service';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseCrudService<User> {

  constructor(private injector: Injector) {
    super(environment.apiUrl + '/users', injector, 'users');
  }

  loadAllOrderedByName(): Observable<User[]> {
    return this.http.get<User[]>(environment.apiUrl + '/users', {
      headers: new HttpHeaders().set('X-LoadAll-Without-Pagination', 'true')
    })
    .pipe(
      catchError((err: any) => {
        return throwError(`Fail on load users ordered by name!`);    //Rethrow it back to component
      })
    );
  }
}
