import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private API_URL:string = environment.endpoint + "Dashboard"
  constructor(private http: HttpClient) { }

  summary(): Observable<Response>{
    return this.http.get<Response>(this.API_URL + "/summary")
  }
}
