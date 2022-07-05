import { Component, OnInit } from '@angular/core';
import { faHouse, faChartColumn, faGrip, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  home = faHouse;
  insights = faChartColumn;
  dashboard = faGrip;
  about = faCircleQuestion;

  constructor() { }

  ngOnInit(): void {
  }

}
