import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { InsightsComponent } from './components/insights/insights.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FaceComponent } from './components/home/face/face.component';
import { LoaderComponent } from './components/shared/loader/loader.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SinglebarComponent } from './components/shared/charts/singlebar/singlebar.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { AboutComponent } from './components/about/about.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { ImagesComponent } from './components/images/images.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotfoundComponent,
    InsightsComponent,
    DashboardComponent,
    FaceComponent,
    LoaderComponent,
    FooterComponent,
    SinglebarComponent,
    NavbarComponent,
    AboutComponent,
    HeaderComponent,
    ImagesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
