import { Component, OnInit } from '@angular/core';
import { ApiDataService } from "../api-data.service";
import { ApiService } from "../api.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-absences',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './absences.component.html',
  styleUrl: './absences.component.css'
})

export class AbsencesComponent implements OnInit {
  absences: any = [];
  filteredAbsences: any = [];
  absenceDay: Date = new Date();
  infoMessage: string = '';
  fetchingAbsences: boolean = false;

  constructor(public apiDataService: ApiDataService, public apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    this.fetchingAbsences = true;
    this.absences = await this.apiDataService.getAbsences(false);
    this.filteredAbsences = this.absences;
    this.fetchingAbsences = false;
  }

  findAbsencesOnDay(): void {
    this.infoMessage = '';
    this.filteredAbsences = this.absences.filter((absence: any) => {
      return  absence.PartialTimeFrom <= this.absenceDay && absence.PartialTimeTo >= this.absenceDay;
    });
  }

  async refreshAbsences(): Promise<void> {
    this.infoMessage = 'Fetching absences...'
    this.absences = await this.apiDataService.getAbsences(true);
    this.filteredAbsences = this.absences;
    this.infoMessage = 'Fetched newest absences.'
  }
}
