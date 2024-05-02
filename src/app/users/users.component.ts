import { Component, inject, OnInit, NgModule } from '@angular/core';
import { ApiService } from "../api.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  public users: any;
  private apiService = inject(ApiService);

  ngOnInit(): void {
    this.apiService.fetchDataFromApi('api/v1/Users').subscribe(
      (data: any[]) => {
        this.users = data;
        console.log(this.users);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
}
