import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormGroup, FormsModule, FormControl} from "@angular/forms";
import { ApiService } from "../api.service";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})

export class UsersComponent implements OnInit {
  public users: any;
  public filteredUsers: any;
  public nameQuery: string = '';
  public surnameQuery: string = '';
  public userFormActive: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  infoMessage: string = '';

  userForm = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    birthday: new FormControl(''),
    email: new FormControl(''),
  })

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

  hideForm(): void {
    this.userFormActive = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.infoMessage = '';
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

  addUserHandler(): void {
    if(!this.userForm.value.name || !this.userForm.value.surname) {
      this.errorMessage = 'First name and last name are mandatory fields.';
      this.successMessage = '';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.infoMessage = 'Adding user...';
    this.addUser();
  }

  addUser(): void {
    const newUser: any = {
      FirstName: this.userForm.value.name,
      LastName: this.userForm.value.surname,
      BirthDate: this.userForm.value.birthday,
      Email: this.userForm.value.email,
    };

    this.apiService.setAccessToken().then(() => {
      this.apiService.postDataToApi('api/v1/Users', newUser).subscribe((data: any) => {
        this.successMessage = 'User ' + data.FirstName + ' ' + data.LastName + ' has been added.';
        this.errorMessage = '';
        this.infoMessage = '';
        this.fetchData();
        this.userForm.reset();
      }, error => {
        this.errorMessage = 'Error adding user. Please try again.';
        this.successMessage = '';
        this.infoMessage = '';
        console.log(error);
      });
    });
  }
}
