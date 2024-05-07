import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  constructor(private apiService: ApiService) {}

  async getUsers(): Promise<any> {
    try {
      if (localStorage.getItem('users') == 'undefined' || localStorage.getItem('users') == null) {
        const userData = await this.apiService.getData('api/v1/Users');
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
        const absenceDef = await this.apiService.getData('api/v1/AbsenceDefinitions');
        localStorage.setItem('absenceDefinitions', JSON.stringify(absenceDef));
      }

      return JSON.parse(localStorage.getItem('absenceDefinitions') ?? '');
    } catch (error) {
      console.error('Error fetching absence definitions:', error);
    }
  }

  async getAbsences(forceRefresh: boolean): Promise<any> {
    try {
      if (forceRefresh || localStorage.getItem('absences') == 'undefined' || localStorage.getItem('absences') == null) {
        const absences = await this.apiService.getData('api/v1/Absences');
        localStorage.setItem('absences', JSON.stringify(absences));
      }

      return JSON.parse(localStorage.getItem('absences') ?? '');
    } catch (error) {
      console.error('Error fetching absences:', error);
    }
  }
}
