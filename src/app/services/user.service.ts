import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../interfaces/response';
import { LoginRequest } from '../interfaces/login-request';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL:string = environment.endpoint + "User"

  constructor(private http:HttpClient) {
  }

  login(request:LoginRequest) : Observable<Response> {
    return this.http.post<Response>(`${this.API_URL}/login`, request)
  }

  getAll(): Observable<Response> {
    return this.http.get<Response>(this.API_URL)
  }

  create(request:User): Observable<Response> {
    return this.http.post<Response>(this.API_URL, request)
  }

  update(request:User): Observable<Response> {
    return this.http.put<Response>(this.API_URL, request)
  }

  delete(id:number): Observable<Response> {
    return this.http.delete<Response>(`${this.API_URL}/${id}`)
  }


}
