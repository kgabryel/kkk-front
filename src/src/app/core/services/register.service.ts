import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { authRoutes } from '../../config/routes.config';
import { messages } from '../messages/auth.messages';
import { RegisterRequest } from '../requests/auth.request';

@Injectable()
export class RegisterService {
  private httpClient: HttpClient;
  public constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public register(registerRequest: RegisterRequest): Observable<string> {
    return this.httpClient.post<null>(authRoutes.register, registerRequest).pipe(
      map<null, string>(() => ''),
      catchError(
        (error: HttpErrorResponse): Observable<string> =>
          error.status === 400 ? of(messages.emailInUse) : of(messages.serverError),
      ),
    );
  }
}
