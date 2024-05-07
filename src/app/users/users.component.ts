import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormGroup, FormsModule, FormControl} from "@angular/forms";
import { ApiDataService } from "../api-data.service";
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
  absenceDefinitions: any;
  filteredUsers: any = [];
  nameQuery: string = '';
  surnameQuery: string = '';
  userFormActive: boolean = false;
  userFeedbackMessage: string = '';
  absenceFeedbackMessage: string = '';
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

  constructor(private apiService: ApiService, private apiDataService: ApiDataService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.fetchingUsers = true;
      this.users = await this.apiDataService.getUsers();
      this.filteredUsers = this.users;
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      this.fetchingUsers = false;
    }

    try {
      this.fetchingAbsencesDefinitions = true;
      this.absenceDefinitions = await this.apiDataService.getAbsenceDefinitions();
    } catch (error) {
      console.error('Error fetching absence definitions:', error);
    } finally {
      this.fetchingAbsencesDefinitions = false;
    }
  }

  search(): void {
    this.filteredUsers = this.users.filter((user: any) => {
      const firstNameMatch = !this.nameQuery || user['FirstName'].toLowerCase().includes(this.nameQuery.toLowerCase());
      const lastNameMatch = !this.surnameQuery || user['LastName'].toLowerCase().includes(this.surnameQuery.toLowerCase());
      return firstNameMatch && lastNameMatch;
    });
  }

  addAbsenceHandler(userId: string): void {
    if(!this.absenceForm.value.absenceId || !this.absenceForm.value.startDate || !this.absenceForm.value.endDate) {
      this.absenceFeedbackMessage = 'Please fill all the fields.';
      return;
    }
    this.absenceFeedbackMessage = 'Adding absence...';
    this.addAbsence(userId);
  }

  addAbsence(userId: string): void {
    const newAbsence = {
        "UserId": userId,
        "AbsenceDefinitionId": this.absenceForm.value.absenceId,
        "Timestamp": new Date().toISOString(),
        "PartialTimeFrom": this.absenceForm.value.startDate,
        "PartialTimeTo": this.absenceForm.value.endDate,
    };

    this.apiService.setAccessToken().then(() => {
      this.apiService.postDataToApi('api/v1/Absences', newAbsence).subscribe(() => {
        this.absenceFeedbackMessage = 'Absence added.';
      }, error => {
        this.absenceFeedbackMessage = 'Error adding absence. Please try again.';
        console.log(error);
      });
    });
  }

  addUserHandler(): void {
    if(!this.userForm.value.name || !this.userForm.value.surname) {
      this.userFeedbackMessage = 'First name and last name are mandatory fields.';
      return;
    }

    this.userFeedbackMessage = 'Adding user...';
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
        this.userFeedbackMessage = 'User ' + data.FirstName + ' ' + data.LastName + ' has been added.';
        this.users = this.apiService.getData('api/v1/Users');
        this.userForm.reset();
      }, error => {
        this.userFeedbackMessage = 'Error adding user. Please try again.';
        console.log(error);
      });
    });
  }
}
