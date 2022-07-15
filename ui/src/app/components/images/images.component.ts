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
  title: string = '';
  title2: string | null = null;

  linkDomains$ : Observable<any[]> = of ([]);

  dataActivity$: Observable<any[]> = of([]);

  data$: Observable<DataValue[]> = of([{title:'', value:0}]);
  data2$: Observable<DataValue[]> = of([{title:'', value:0}]);
  tweetsTitle = 'activity / 24h';

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
        this.title = `what topics is <strong>@${this.userId}</strong> interested in?`;
        break;
      case 'weekly':
        this.dataWeekly$ = this.api.getWeeklyUsage(this.userId);
        this.title = `when does <strong>@${this.userId}</strong> tweet most often?`;
        break;
      case 'basics':
        this.data$ = this.api.getProfileBasics(this.userId)               
                             .pipe(map((d:any) => [
                                  { title: 'follower', value: d.followers_count}, 
                                  { title: 'followed', value: d.following_count}, 
                                  { title: 'listed', value: d.listed_count}
                            ]));


        this.data2$ = this.api.getProfileBasics(this.userId)
          .pipe(tap((d:any) => {
            this.tweetsTitle = `${this.tweetsTitle}<br/><span class="digit" style="font-size:3.4rem">${humanize.compactInteger(d.tweet_count + d.reply_count + d.likes_count)}</span>`;
          }))
          .pipe(map((d:any) => [
            { title: 'tweets', value: d.tweet_count}, 
            { title: 'replies', value: d.reply_count}, 
            { title: 'likes', value: d.likes_count}            
          ])
        )       

        this.title = `how popular is <strong>@${this.userId}</strong>?`; 
        this.title2 = `how much has <strong>@${this.userId}</strong> tweeted in the last 24 hours?`;

        break;

      case 'activity':
        this.dataActivity$ = this.api.getActivity(this.userId);
        this.title = `how do the tweets from <strong>@${this.userId}</strong> look like? `;
        break;
      case 'link-domains':
        this.linkDomains$ = this.api.getLinkAnalysis(this.userId)
                                    .pipe(tap((d:any) => {
                                      this.title = `other tweets with the url <strong>${ d.url }</strong> could be approximately mapped to these domains.`;
                                    }))        
                                    .pipe(map((d: any) => 
                                      d.domains.map((dom:any) => ({
                                        title: dom.domain, value: dom.count
                                      }))))
        break;
      case 'link-hashtags':
        this.data$ = this.api.getLinkAnalysis(this.userId)
                             .pipe(tap((d:any) => {
                              this.title = `other tweets with url <strong>${ d.url }</strong> contained these hashtags.`;
                             }))        
                             .pipe(map((d: any) => d.hashtags))
        break;
      case 'link-annotations':
        this.data$ = this.api.getLinkAnalysis(this.userId)
                            .pipe(tap((d:any) => {
                              this.title = `other tweets with url <strong>${ d.url }</strong> contained these annotations.`;
                            }))
                            .pipe(map((d: any) => 
                              d.annotations.map((a:any) => ({
                                title: a.text, value: a.count
                              }))))
        break;
      case 'link-entities':
        this.data$ = this.api.getLinkAnalysis(this.userId)
                            .pipe(tap((d:any) => {
                              this.title = `other tweets with url <strong>${ d.url }</strong> contained these entities.`;
                            }))
                            .pipe(map((d: any) => 
                              d.entities.map((a:any) => ({
                                title: a.name, value: a.count
                            }))))


        break;
      case 'line':
        break;

    }
  }
}
