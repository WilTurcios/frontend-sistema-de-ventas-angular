import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../interfaces/response';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private API_URL:string = environment.endpoint + "Product"

  constructor(private http: HttpClient) { }

  getAll(): Observable<Response> {
    return this.http.get<Response>(this.API_URL)
  }

  create(request:Product): Observable<Response> {
    return this.http.post<Response>(this.API_URL, request)
  }

  update(request:Product): Observable<Response> {
    return this.http.put<Response>(this.API_URL, request)
  }

  delete(id:number): Observable<Response> {
    return this.http.delete<Response>(`${this.API_URL}/${id}`)
  }
}
