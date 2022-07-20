import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { Insights } from 'src/app/model/insights';
import { faBars, faMagnifyingGlass, faLocationDot, faChartColumn } from '@fortawesome/free-solid-svg-icons';
import { State } from 'src/app/state';
import { ViewportScroller } from '@angular/common';

@Component({
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnInit {
  twitterName: string = '';
  profile:any = {};
  insights: Insights[] = [];

  navOut: boolean = false;


  faBars = faBars;
  faMagnifyingGlass = faMagnifyingGlass;
  faLocationDot = faLocationDot;
  faChartColumn = faChartColumn;

  constructor(private api:ApiService, 
    private route: ActivatedRoute, 
    public state: State, 
    private scroller: ViewportScroller) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.twitterName = params['name'] || 'none';

      // if (this.twitterName !== 'none') {
        this.load(this.twitterName);
      //}
    });
  }

  load(name: string) {
    // this.data = this.api.getData(name);

    this.api.getProfile(name)
            .subscribe(p => {
              this.profile = p;
            });

    this.api.getInsights(name)            
            .subscribe(i => {
              this.insights = i;
            })
  }

  setItem(id: number) {
    
    this.insights.forEach(i => { 
      i.active = i.id == id;
    });

  }

  toggleItem(id: number) {
    
    const item = this.insights.find(i => i.id == id);
    if (item) {
      item.active = !item.active;

      const achorId = item.active? `dat-${id}` : `cnt-${id}` 
      this.scroller.scrollToAnchor(achorId);
      
    }

  }

}
