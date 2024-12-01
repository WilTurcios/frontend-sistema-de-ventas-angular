import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../interfaces/response';
import { Sale } from '../interfaces/sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private API_URL:string = environment.endpoint + "Sale";
  constructor(private http:HttpClient) { }

  history(
    searchBy: string,
    saleNumber: string,
    startDate:string,
    endDate:string
  ): Observable<Response> {
    return this.http.get<Response>(
      this.API_URL +
      `/history?searchBy=${searchBy}&saleNumber=${saleNumber}&startDate=${startDate}&endDate=${endDate}`
    )
  }

  report(startDate:string, endDate:string): Observable<Response> {
    return this.http.get<Response>(
      this.API_URL +
      `/report?startDate=${startDate}&endDate=${endDate}`
    )
  }

  register(request:Sale): Observable<Response> {
    return this.http.post<Response>(this.API_URL, request)
  }

}
