import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { UsersDataService } from "../users-data.service";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  public users: any;

  constructor(private usersService: UsersDataService) {}

  ngOnInit(): void {
    this.users = this.usersService.getUsers();
  }
}
