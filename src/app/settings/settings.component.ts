import { Component, inject, OnInit } from '@angular/core';
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
  protected readonly localStorage: Storage = localStorage;
  private apiService = inject(ApiService);
  client_id: string = '';
  client_secret: string = '';

  ngOnInit(): void {
    this.client_id = this.localStorage.getItem('client_id') ?? '';
    this.client_secret = this.localStorage.getItem('client_secret') ?? '';
  }

  saveCredentials(): void {
    localStorage.setItem('client_id', this.client_id);
    localStorage.setItem('client_secret', this.client_secret);
    this.apiService.setAccessToken(this.client_id, this.client_secret);
  }
}
