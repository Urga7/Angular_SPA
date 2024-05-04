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
  users: any = [];
  filteredUsers: any = [];
  nameQuery: string = '';
  surnameQuery: string = '';
  userFormActive: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  infoMessage: string = '';
  absencesDefinitions: any;
  fetchingUsers: boolean = false;
  fetchingAbsencesDefinitions: boolean = false;

  userForm = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    birthday: new FormControl(''),
    email: new FormControl(''),
  })

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.fetchingUsers = true;
      this.users = await this.getUsers();
      localStorage.setItem('users', JSON.stringify(this.users));
      this.filteredUsers = this.users;
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      this.fetchingUsers = false;
    }

    try {
      this.fetchingAbsencesDefinitions = true;
      this.absencesDefinitions = await this.getAbsencesDefinitions();
      localStorage.setItem('absencesDefinitions', JSON.stringify(this.absencesDefinitions));
    } catch (error) {
      console.error('Error fetching absence definitions:', error);
    } finally {
      this.fetchingAbsencesDefinitions = false;
    }
  }

  async getUsers(): Promise<any> {
    try {
      if (localStorage.getItem('users') == 'undefined' || localStorage.getItem('users') == null) {
        return this.getData('api/v1/Users');
      } else {
        return JSON.parse(localStorage.getItem('users') ?? '');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  async getAbsencesDefinitions(): Promise<any> {
    try {
      if (localStorage.getItem('absencesDefinitions') == 'undefined' || localStorage.getItem('absencesDefinitions') == null) {
        return this.getData('/api/v1/AbsenceDefinitions');
      } else {
        return this.absencesDefinitions = JSON.parse(localStorage.getItem('absencesDefinitions') ?? '');
      }
    } catch (error) {
      console.error('Error fetching absence definitions:', error);
    }
  }

  search(column: string, query: string): void {
    this.filteredUsers = this.users.filter((user: any) => {
      return user[column].toLowerCase().includes(query.toLowerCase());
    });
  }

  addAbsence(): void {

  }

  hideForm(): void {
    this.userFormActive = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.infoMessage = '';
  }

  async getData(endpoint: string): Promise<any> {
    try {
      await this.apiService.setAccessToken();
      if (this.apiService.accessToken) {
        return this.apiService.fetchDataFromApi(endpoint).toPromise();
      } else {
        console.error('Access token is not set.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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
        this.users = this.getData('api/v1/Users');
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
