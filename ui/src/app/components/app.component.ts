import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { ApiService } from '../api.service';
import { State } from '../state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  

  constructor(private api:ApiService, private router: Router, private state: State) {
    this.router.events.subscribe(u => {
      if (u instanceof NavigationEnd) {
        const evt = u  as NavigationEnd;

        let page = this.router.routerState.snapshot.url.split('/').filter(x => x);

        if (!page || page.length < 1) page = ['home'];


        this.state.activePage.val = page[0];

        console.log('current page: ', this.state.activePage.val);
      }      
    });
  }

  
  ngOnInit(): void {

  }


}
