import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { State } from 'src/app/state';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  twitterName: string = '';
  data = of( { status: 'war hier...' } );

  constructor(private api:ApiService, private route: ActivatedRoute, public state: State) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.twitterName = params['name'] || 'none';

      if (this.twitterName !== 'none') {
        this.load(this.twitterName);
      }
    });    
  }

  load(name: string) {
    this.data = this.api.getData(name);
  }  

}
