import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../api.service";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})

export class UsersComponent implements OnInit {
  public users: any;
  public filteredUsers: any;
  public nameQuery: string = '';
  public surnameQuery: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    if(localStorage.getItem('users') == 'undefined') {
      this.fetchData();
    } else {
      this.users = JSON.parse(localStorage.getItem('users') ?? '');
      this.filteredUsers = this.users;
    }
  }

  search(column: string, query: string): void {
    this.filteredUsers = this.users.filter((user: any) => {
      return user[column].toLowerCase().includes(query.toLowerCase());
    });
  }

  fetchData(): void {
    this.apiService.setAccessToken().then(() => {
      if (this.apiService.accessToken) {
        this.apiService.fetchDataFromApi('api/v1/Users').subscribe((data: any[]) => {
          this.users = data;
          this.filteredUsers = data;
          localStorage.setItem('users', JSON.stringify(data));
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
