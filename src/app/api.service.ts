import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Data } from "@angular/router";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private readonly apiUrl: string = 'https://api4.allhours.com';
  private readonly tokenUrl: string = 'https://login.allhours.com/connect/token';
  accessToken: string = '';

  constructor(private http: HttpClient) {}

  async setCredentials(client_id: string, client_secret: string): Promise<void> {
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', client_id);
    body.set('client_secret', client_secret);
    body.set('scope', 'api');

    try {
      const response$ = this.http.post<any>(this.tokenUrl, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const token = await lastValueFrom(response$);
      if(token.access_token) {
        localStorage.setItem('client_id', client_id);
        localStorage.setItem('client_secret', client_secret);
      }
    } catch(error) {
      console.error("Error setting credentials: ", error);
      localStorage.setItem('client_id', '');
      localStorage.setItem('client_secret', '');
      throw error;
    }
  }

  async setAccessToken(): Promise<void> {
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', localStorage.getItem('client_id') ?? '');
    body.set('client_secret', localStorage.getItem('client_secret') ?? '');
    body.set('scope', 'api');
    try {
      const response$ = this.http.post<any>(this.tokenUrl, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const token = await lastValueFrom(response$);
      this.accessToken = token.access_token;
    } catch(error) {
      console.error("Error getting access token: ", error);
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

  async getData(endpoint: string): Promise<any> {
    try {
      await this.setAccessToken();
      if (this.accessToken) {
        const data$ = this.fetchDataFromApi(endpoint)
        return await lastValueFrom(data$);
      } else {
        console.error('Access token is not set.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  areCredentialsSet(): boolean {
    return localStorage.getItem('client_id') != 'undefined' &&
           localStorage.getItem('client_id') != null &&
           localStorage.getItem('client_id') != '' &&
           localStorage.getItem('client_secret') != 'undefined' &&
           localStorage.getItem('client_secret') != null &&
           localStorage.getItem('client_secret') != '';
  }
}
