import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { ApiService } from "../api.service";
import { UsersDataService } from "../users-data.service";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})

export class SettingsComponent implements OnInit {
  client_id: string = '';
  client_secret: string = '';

  constructor(private apiService: ApiService, private usersService: UsersDataService) {}

  ngOnInit(): void {
    this.client_id = this.apiService.getClientId();
    this.client_secret = this.apiService.getClientSecret();
    if(this.client_id && this.client_secret)
      this.fetchData();
  }

  saveCredentials(): void {
    this.apiService.setCredentials(this.client_id, this.client_secret);
    this.fetchData();
  }

  fetchData(): void {
    this.apiService.setAccessToken().then(() => {
      if (this.apiService.accessToken) {
        this.apiService.fetchDataFromApi('api/v1/Users').subscribe((data: any[]) => {
          this.usersService.setUsers(data);
        }, (error) => {
          console.error('Error fetching users:', error);
        });
      } else {
        console.error('Access token is not set.');
      }
    }).catch(error => {
      console.error('Error setting access token:', error);
    });
  }
}
