import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { ApiService } from "../api.service";

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
  feedbackMsg: string = '';

  constructor(public apiService: ApiService) {}

  ngOnInit(): void {
    this.client_id = localStorage.getItem('client_id') ?? '';
    this.client_secret = localStorage.getItem('client_secret') ?? '';
  }

  async saveCredentials(): Promise<void> {
    if(!this.client_id || !this.client_secret) {
      this.feedbackMsg = 'Please fill out both fields.';
      return;
    }
    try {
      await this.apiService.setCredentials(this.client_id, this.client_secret);
      this.feedbackMsg = 'Credentials saved.'
    } catch (e: any) {
      this.feedbackMsg = 'Id or password incorrect. Try again.';
    }
  }
}
