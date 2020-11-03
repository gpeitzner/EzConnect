import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  user: User;

  api: string = 'http://localhost:3000/';

  register(newUser: any): Observable<User> {
    return this.httpClient.post<User>(this.api + 'users', newUser);
  }

  login(userCredentials: any): Observable<User> {
    return this.httpClient.post<User>(
      this.api + 'users/login',
      userCredentials
    );
  }

  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.api + 'users');
  }
}
