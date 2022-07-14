import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, pipe, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataMatrixCell, DataValue } from './model/dataset';
import { Insights } from './model/insights';
import { Profile } from './model/profile';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(private http: HttpClient) { }

  getData(userId: string) {
    return this.http.get<Profile>(`${environment.apiUrl}profile/${userId}`);
  }

  getInsights(userid: string) {
    return this.http.get<Insights>(`${environment.apiUrl}insights/${userid}`);
  }


  getInterests(userId: string) {
    return this.http.get<Profile>(`${environment.apiUrl}profile/${userId}/interests`);
  }  

  getHashtags(userId: string) {
    return this.http.get<DataValue[]>(`${environment.apiUrl}profile/${userId}/hashtags`);
  }    

  getWeeklyUsage(userId: string) {
    return this.http.get<DataMatrixCell[]>(`${environment.apiUrl}profile/${userId}/weekly`);
  }

  getActivity(userId: string) {
    return this.http.get<any[]>(`${environment.apiUrl}${userId}/activity`);
  }

  getProfileBasics(userId: string) {
    return this.http.get<DataValue[]>(`${environment.apiUrl}profile/${userId}/basics`);
  }
}
