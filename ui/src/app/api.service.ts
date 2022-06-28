import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Profile } from './model/profile';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(private http: HttpClient) { }

  getData(name: string) {
    return this.http.get<Profile>(`${environment.apiUrl}profile/${name}`);
  }
}
