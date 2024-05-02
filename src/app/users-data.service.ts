import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersDataService {
  private users: any[] = [];

  setUsers(users: any[]): void {
    this.users = users;
  }

  getUsers(): any[] {
    return this.users;
  }
}
