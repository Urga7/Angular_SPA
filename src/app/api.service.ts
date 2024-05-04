import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Data } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private readonly apiUrl = 'https://api4.allhours.com';
  private readonly tokenUrl = 'https://login.allhours.com/connect/token';
  accessToken: string = '';

  constructor(private http: HttpClient) {}

  setCredentials(client_id: string, client_secret: string): void {
    localStorage.setItem('client_id', client_id);
    localStorage.setItem('client_secret', client_secret);
  }

  async setAccessToken(): Promise<void> {
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', localStorage.getItem('client_id') ?? '');
    body.set('client_secret', localStorage.getItem('client_secret') ?? '');
    body.set('scope', 'api');

    try {
      const response = await this.http.post<any>(this.tokenUrl, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).toPromise();

      this.accessToken = response.access_token;
    } catch(error) {
      console.error("Error setting access token: ", error);
      throw error;
    }
  }

  fetchDataFromApi(endpoint: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}/${endpoint}`, { headers });
  }

  postDataToApi(endpoint: string, data: Data): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, data, { headers });
  }
}
