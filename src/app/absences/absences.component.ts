import {Component, OnInit} from '@angular/core';
import { ApiDataService } from "../api-data.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-absences',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './absences.component.html',
  styleUrl: './absences.component.css'
})
export class AbsencesComponent implements OnInit {
  absences: any = [];
  filteredAbsences: any = [];
  absenceDay: Date = new Date();
  showingAll: boolean = true;
  infoMessage: string = '';

  constructor(public apiDataService: ApiDataService) {}

  async ngOnInit(): Promise<void> {
    this.absences = await this.apiDataService.getAbsences(false);
    this.filteredAbsences = this.absences;
  }

  findAbsencesOnDay(): void {
    this.infoMessage = '';
    this.showingAll = false;
    this.filteredAbsences = this.absences.filter((absence: any) => {
      return  absence.PartialTimeFrom <= this.absenceDay && absence.PartialTimeTo >= this.absenceDay;
    });
  }

  async refreshAbsences(): Promise<void> {
    this.absences = await this.apiDataService.getAbsences(true);
    this.filteredAbsences = this.absences;
    this.showingAll = true;
    this.infoMessage = 'Fetched newest absences.'
  }
}
