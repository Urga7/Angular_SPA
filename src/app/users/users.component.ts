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

  userSuccessMessage: string = '';
  userErrorMessage: string = '';
  userInfoMessage: string = '';

  absenceSuccessMessage: string = '';
  absenceErrorMessage: string = '';
  absenceInfoMessage: string = '';

  absenceDefinitions: any;
  fetchingUsers: boolean = false;
  fetchingAbsencesDefinitions: boolean = false;

  userForm = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    birthday: new FormControl(''),
    email: new FormControl(''),
  });

  absenceForm = new FormGroup({
    absenceId: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
  })

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.fetchingUsers = true;
      this.users = await this.getUsers();
      this.filteredUsers = this.users;
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      this.fetchingUsers = false;
    }

    try {
      this.fetchingAbsencesDefinitions = true;
      this.absenceDefinitions = await this.getAbsenceDefinitions();
    } catch (error) {
      console.error('Error fetching absence definitions:', error);
    } finally {
      this.fetchingAbsencesDefinitions = false;
    }
  }

  async getUsers(): Promise<any> {
    try {
      if (localStorage.getItem('users') == 'undefined' || localStorage.getItem('users') == null) {
        const userData = await this.getData('api/v1/Users');
        localStorage.setItem('users', JSON.stringify(userData));
      }

      return JSON.parse(localStorage.getItem('users') ?? '');
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  async getAbsenceDefinitions(): Promise<any> {
    try {
      if (localStorage.getItem('absenceDefinitions') == 'undefined' || localStorage.getItem('absenceDefinitions') == null) {
        const absences = await this.getData('api/v1/AbsenceDefinitions');
        localStorage.setItem('absenceDefinitions', JSON.stringify(absences));
      }

      return JSON.parse(localStorage.getItem('absenceDefinitions') ?? '');
    } catch (error) {
      console.error('Error fetching absence definitions:', error);
    }
  }

  search(column: string, query: string): void {
    this.filteredUsers = this.users.filter((user: any) => {
      return user[column].toLowerCase().includes(query.toLowerCase());
    });
  }

  hideForm(): void {
    this.userFormActive = false;
    this.userErrorMessage = '';
    this.userSuccessMessage = '';
    this.userInfoMessage = '';
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

  addAbsenceHandler(userId: string): void {
    this.addAbsence(userId);
  }

  addAbsence(userId: string): void {
    console.log("Gonna add absence..")
    const startDateValue = this.absenceForm.value.startDate;
    const endDateValue = this.absenceForm.value.endDate;
    let newAbsence: any;

    if (startDateValue && endDateValue) {
      console.log("Inside IF")
      const startDateParts = startDateValue.split('/');
      const endDateParts = endDateValue.split('/');

      const startDate = new Date(`${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}T00:00:00+00:00`);
      const endDate = new Date(`${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}T00:00:00+00:00`);

      newAbsence = {
        UserId: userId,
        AbsenceDefinitionId: this.absenceForm.value.absenceId,
        PartialTimeFrom: startDate.toISOString(),
        PartialTimeTo: endDate.toISOString(),
      };

    } else {
      console.log('Start date or end date is null or undefined');
    }

    console.log(newAbsence);
    this.apiService.setAccessToken().then(() => {
      this.apiService.postDataToApi('api/v1/Absences', newAbsence).subscribe((data: any) => {
        this.absenceSuccessMessage = 'Absence added.';
        this.absenceErrorMessage = '';
        this.absenceInfoMessage = '';
        console.log("success!");
        console.log(data);
      }, error => {
        this.absenceErrorMessage = 'Error adding user. Please try again.';
        this.absenceSuccessMessage = '';
        this.absenceInfoMessage = '';
        console.log(error);
      });
    });
  }

  addUserHandler(): void {
    if(!this.userForm.value.name || !this.userForm.value.surname) {
      this.userErrorMessage = 'First name and last name are mandatory fields.';
      this.userSuccessMessage = '';
      return;
    }

    this.userErrorMessage = '';
    this.userSuccessMessage = '';
    this.userInfoMessage = 'Adding user...';
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
        this.userSuccessMessage = 'User ' + data.FirstName + ' ' + data.LastName + ' has been added.';
        this.userErrorMessage = '';
        this.userInfoMessage = '';
        this.users = this.getData('api/v1/Users');
        this.userForm.reset();
      }, error => {
        this.userErrorMessage = 'Error adding user. Please try again.';
        this.userSuccessMessage = '';
        this.userInfoMessage = '';
        console.log(error);
      });
    });
  }
}
