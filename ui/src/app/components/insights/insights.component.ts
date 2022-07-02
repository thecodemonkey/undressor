import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from 'src/app/api.service';

@Component({
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnInit {
  twitterName: string = '';
  data = of( { status: 'war hier...' } );

  constructor(private api:ApiService, private route: ActivatedRoute) { }

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
