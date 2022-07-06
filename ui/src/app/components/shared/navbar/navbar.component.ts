import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faHouse, faChartColumn, faGrip, faCircleQuestion, faXmark, faInfo } from '@fortawesome/free-solid-svg-icons';
import { timer } from 'rxjs';
import { State } from 'src/app/state';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  close = faXmark;


  nav = [
    {icon: faHouse, title: 'home', active: false, url: '/'},
    {icon: faChartColumn, title: 'insights', active: false, url: '/insights'},
    {icon: faGrip, title: 'dashboard', active: false, url: '/dashboard'},
    {icon: faInfo, title: 'about', active: false,  url: '/about'}
  ];


  mover: boolean = false;

  @HostListener('mouseleave')
  onMouseOut() {
    this.mover = false

    timer(1000).subscribe(() => {
      if (!this.mover) {
        this.state.navbarOn.val = false;
      }
    });
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.mover = true;
  }


  constructor(public state: State, private router: Router) { 
    this.state.activePage.val$.subscribe(p => {
      this.nav.forEach(n => {
        n.active = n.title === p
      });
    });
  }

  ngOnInit(): void { }

  navigate(url: string) {
    this.state.navbarOn.val = false;

    timer(600).subscribe(() => {
      this.router.navigate([url]);
    });

  }
}
