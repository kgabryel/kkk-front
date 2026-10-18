import type { HttpErrorResponse } from '@angular/common/http';
import type { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import type { RegisterRequest } from '@/app/core/requests/auth.request';

import { authRoutes } from '@/app/config/routes.config';
import { messages } from '@/app/core/messages/auth.messages';

@Injectable()
export class RegisterService {
  private httpClient: HttpClient = inject(HttpClient);

  public register(registerRequest: RegisterRequest): Observable<string> {
    return this.httpClient.post<null>(authRoutes.register, registerRequest).pipe(
      map<null, string>(() => ''),
      catchError((error: HttpErrorResponse): Observable<string> =>
        error.status === 400 ? of(messages.emailInUse) : of(messages.serverError),
      ),
    );
  }
}
