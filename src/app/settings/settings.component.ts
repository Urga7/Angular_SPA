import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { ApiService } from "../api.service";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})

export class SettingsComponent implements OnInit {
  client_id: string = '';
  client_secret: string = '';
  credentialsSaved: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.client_id = localStorage.getItem('client_id') ?? '';
    this.client_secret = localStorage.getItem('client_secret') ?? '';
  }

  saveCredentials(): void {
    this.apiService.setCredentials(this.client_id, this.client_secret);
    this.credentialsSaved = true;
  }
}
