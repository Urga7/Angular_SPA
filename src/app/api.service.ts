import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private readonly apiUrl = 'https://api4.allhours.com';
  private accessToken: string = '';

  constructor(private http: HttpClient) {}

  setAccessToken(client_id: string, client_secret: string): void {
    const tokenUrl = 'https://login.allhours.com/connect/token';
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', client_id);
    body.set('client_secret', client_secret);
    body.set('scope', 'api');

    this.http.post<any>(tokenUrl, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).subscribe(response => {
      this.accessToken = response.access_token;
    });
  }

  fetchDataFromApi(endpoint: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}/${endpoint}`, { headers });
  }
}
