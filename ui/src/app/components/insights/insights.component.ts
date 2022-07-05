import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { Insights } from 'src/app/model/insights';
import { faBars, faMagnifyingGlass, faLocationDot } from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnInit {
  twitterName: string = '';
  profile:any;
  insights: Insights[] = [];

  navOut: boolean = false;


  faBars = faBars;
  faMagnifyingGlass = faMagnifyingGlass;
  faLocationDot = faLocationDot;

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
    // this.data = this.api.getData(name);

    this.profile = { flollower: [
      { label: 'follower', value: 1000 },
      { label: 'following', value: 67 },
      { label: 'unfollowed', value: 1 }
    ], tweets: [
      { label: 'tweets', value: 1337 },
      { label: 'retweets', value: 788 },
      { label: 'likes', value: 860 },
      { label: 'mentions', value: 52 }
    ]};


    this.insights = [
      { id: 1, active: true, title: 'When exactly is undressor active?', text: 'Since undressor is most likely a BOT, it is active throughout the entire day. He is most active on Wednesday and Thursday between 16:00 and 18:00. He practically never sleeps.'},
      { id: 2, title: 'What is the Twitter behavior like?', text: 'undressor frequently replies to mentions and almost never initiates his own discussions. He never likes. Most of the time, undressor is active in Europe and uses English as his most common language. However, he also knows German. Many humans master 2 languages, for bots it is an over-average performance. Most often a server, is used as the end device and only rarely mobile device.'},
      { id: 3, title: 'What do the content look like?', text: 'undressor is an alrounder. He is interested in many different topics. The content is most often written in a neutral way and only rarely negative. The tweets rarely contain hashtags or texts. Links to external websites are most often included.'},
      { id: 4, title: 'What is the potential influence on the entire social network?', text: 'undressor does not like to follow other accounts, he likes to let others follow himself. Although he does not have a lot of followers, he is very active and is often mentioned in other tweets. Therefore, the potential influence is medium. The growth rate of his followers indicates an increasing growth.'},
    ];
  }  

  setItem(id: number) {
    
    this.insights.forEach(i => { 
      i.active = i.id == id;
    });

  }

}
