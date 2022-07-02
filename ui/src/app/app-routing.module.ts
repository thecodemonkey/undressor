import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { InsightsComponent } from './components/insights/insights.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'insights/:name', component: InsightsComponent },
  { path: 'insights', component: InsightsComponent },
  { path: 'dashboard/:name', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '',   component: HomeComponent, pathMatch: 'full' },
  { path: '**',   component: NotfoundComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
