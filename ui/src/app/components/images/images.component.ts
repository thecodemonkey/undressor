import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, first, firstValueFrom, flatMap, from, map, Observable, of, single, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { DataMatrixCell, DataValue } from 'src/app/model/dataset';
import { State } from 'src/app/state';
import * as humanize from 'humanize-plus';


@Component({
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {
  id: string = '';
  userId: string = '';


  data$: Observable<DataValue[]> = of([{title:'', value:0}]);
  data2$: Observable<DataValue[]> = of([{title:'', value:0}]);
  tweetsTitle = 'tweets / 24h';

  dataWeekly$: Observable<DataMatrixCell[]> = of([{x:0, y:0, r:0}]);


  data: DataValue[] = [{ title: 'a', value: 0}]; //[{ title: 'follower', value: 20}, { title: 'followed', value: 550}, { title: '', value: 0}];

  dsInterests: DataValue[] = [{ title: 'politics', value: 130  }, { title: 'science', value: 151  }, { title: 'sport', value: 87  }, { title: 'fashion', value: 2  }, { title: 'society', value: 100  }];
  dsLanguages: DataValue[] = [{ title: 'de', value: 100}, { title: 'en', value: 80}, { title: 'other', value: 5 }];
  dsFolower: DataValue[] = [{ title: 'follower', value: 20}, { title: 'followed', value: 550}, { title: '', value: 0}];

  constructor(private api: ApiService, private route: ActivatedRoute, public state: State) { 

   }

  ngOnInit(): void {
       
    this.route.params.subscribe(params => {
      this.id = params['id'] || '';
      this.userId = params['userid'] || '';
      
      this.loadData();
    });    
  }

  async loadData() {
    switch(this.id) {
      case 'interests': // polar
        //this.data$ = this.api.getInterests(this.userId);
        break;
      case 'hashtags':
        this.data$ = this.api.getHashtags(this.userId);
        break;
      case 'weekly':
        this.dataWeekly$ = this.api.getWeeklyUsage(this.userId);
        break;
      case 'basics':
        
        //this.data2$ = of([{ title: 'follower', value: 20}, { title: 'followed', value: 550}, { title: '', value: 0}])
        this.data$ = this.api.getProfileBasics(this.userId)               
                             .pipe(map((d:any) => [
                                  { title: 'follower', value: d.followers_count}, 
                                  { title: 'followed', value: d.following_count}, 
                                  { title: 'listed', value: d.listed_count}
                            ]));


        this.data2$ = this.api.getProfileBasics(this.userId)
          .pipe(tap((d:any) => {
            this.tweetsTitle = `${this.tweetsTitle}<br/><span class="digit" style="font-size:3.4rem">${humanize.compactInteger(d.tweet_count + d.reply_count)}</span>`;
          }))
          .pipe(map((d:any) => [
            { title: 'tweets', value: d.tweet_count}, 
            { title: 'replies', value: d.reply_count}, 
            { title: 'mentions', value: d.mention_count}            
          ])
        )       

        break;

      case 'radar':
        break;
      case 'line':
        break;
      case 'bar':
        break;
    }
  }
}
