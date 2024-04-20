import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SettingsComponent } from './settings/settings.component';
import { UsersComponent } from './users/users.component';
import { AbsencesComponent } from './absences/absences.component';

export const routes: Routes = [
  { path: 'settings', title: 'Settings', component: SettingsComponent },
  { path: 'users', title: 'Users', component: UsersComponent },
  { path: 'absences', title: 'Absences', component: AbsencesComponent },
  { path: '', redirectTo: '/settings', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
