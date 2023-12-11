import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {authRoutes} from '../../../config/routes.config';
import {RegisterRequest} from '../../requests/auth.request';
import {messages} from '../../messages/auth.messages';

@Injectable()
export class RegisterService {

  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public register(registerRequest: RegisterRequest): Observable<string> {
    return this.httpClient.post<null>(authRoutes.register, registerRequest).pipe(
      map<null, string>(() => ''),
      catchError(error => error.status === 400 ? of(messages.emailInUse) : of(messages.serverError))
    );
  }
}
