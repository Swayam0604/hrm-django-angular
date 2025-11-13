import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Department {
  id?: number;
  dept_name: string;
  description?: string;
  status?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private baseUrl = `${environment.apiUrl}/departments/`;

  constructor(private http: HttpClient) {}

  list(search?: string, includeInactive = false, page = 1): Observable<any> {
    let params = new HttpParams().set('page', page);
    if (search) params = params.set('search', search);
    if (includeInactive) params = params.set('include_inactive', '1');
    return this.http.get<any>(this.baseUrl, { params });
  }

  get(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}${id}/`);
  }

  create(payload: Department): Observable<Department> {
    return this.http.post<Department>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<Department>): Observable<Department> {
    return this.http.patch<Department>(`${this.baseUrl}${id}/`, payload);
  }

  softDelete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}
