import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private API_URL:string = environment.endpoint + "Role"

  constructor(private http:HttpClient) { }


  getAll(): Observable<Response> {
    return this.http.get<Response>(this.API_URL)
  }
}