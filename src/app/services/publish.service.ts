import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Publication } from '../interfaces/publication';

@Injectable({
  providedIn: 'root',
})
export class PublishService {
  constructor(private httpClient: HttpClient) {}

  api: string = 'http://www.ezconnectgt.ml:3000/';

  createPublication(publish: any): Observable<any> {
    return this.httpClient.post<any>(this.api + 'publishes', publish);
  }

  getAll(): Observable<Publication[]> {
    return this.httpClient.get<Publication[]>(this.api + 'publishes');
  }
}
