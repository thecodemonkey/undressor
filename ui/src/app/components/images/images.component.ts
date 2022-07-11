import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, flatMap, map, Observable, of, single, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { DataValue } from 'src/app/model/dataset';

@Component({
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {
  id: string = '';
  userId: string = '';
  data$ = new Observable<DataValue[]>();
  // data: DataValue[] | null = [{ title: 'follower', value: 20}, { title: 'followed', value: 550}, { title: '', value: 0}];

  dsInterests: DataValue[] = [{ title: 'politics', value: 130  }, { title: 'science', value: 151  }, { title: 'sport', value: 87  }, { title: 'fashion', value: 2  }, { title: 'society', value: 100  }];
  dsLanguages: DataValue[] = [{ title: 'de', value: 100}, { title: 'en', value: 80}, { title: 'other', value: 5 }];
  dsFolower: DataValue[] = [{ title: 'follower', value: 20}, { title: 'followed', value: 550}, { title: '', value: 0}];

  dsWords = [
    { title: 'word', value: 10 },
    { title: 'words', value: 8 },
    { title: 'sprite', value: 7 },
    { title: 'placed', value: 5 },
    { title: 'layout', value: 4 },
    { title: 'algorithm', value: 4 },
    { title: 'area', value: 4 },
    { title: 'without', value: 3 },
    { title: 'step', value: 3 },
    { title: 'bounding', value: 3 },
    { title: 'retrieve', value: 3 },
    { title: 'operation', value: 3 },
    { title: 'collision', value: 3 },
    { title: 'candidate', value: 3 },
    { title: '32', value: 2 },
    { title: 'placement', value: 2 },
    { title: 'time', value: 2 },
    { title: 'possible', value: 2 },
    { title: 'even', value: 2 },
    { title: 'simple', value: 2 },
    { title: 'starting', value: 2 },
    { title: 'previously', value: 2 },
    { title: 'move', value: 2 },
    { title: 'perform', value: 2 },
    { title: 'hierarchical', value: 2 },
    { title: 'draw', value: 2 },
    { title: 'pixel', value: 2 },
    { title: 'data', value: 2 },
    { title: 'separately', value: 2 },
    { title: 'expensive', value: 2 },
    { title: 'pixels', value: 2 },
    { title: 'masks', value: 2 },
    { title: 'implementation', value: 2 },
    { title: 'detection', value: 2 },
    { title: 'larger', value: 2 },
    { title: 'whole', value: 2 },
    { title: 'comparing', value: 2 },
    { title: 'box', value: 2 },
    { title: 'large', value: 2 },
    { title: 'think', value: 2 },
    { title: 'version', value: 2 },
    { title: 'single', value: 2 },
    { title: 'tree', value: 2 },
    { title: 'Cloud', value: 1 },
    { title: 'Generator', value: 1 },
    { title: 'Works', value: 1 },
    { title: 'positioning', value: 1 },
    { title: 'overlap', value: 1 },
    { title: 'available', value: 1 },
    { title: 'GitHub', value: 1 },
    { title: 'open', value: 1 },
    { title: 'source', value: 1 },
    { title: 'license', value: 1 },
    { title: 'd3cloud', value: 1 },
    { title: 'Note', value: 1 },
    { title: 'code', value: 1 },
    { title: 'converting', value: 1 },
    { title: 'text', value: 1 },
    { title: 'rendering', value: 1 },
    { title: 'final', value: 1 },
    { title: 'output', value: 1 },
    { title: 'requires', value: 1 },
    { title: 'additional', value: 1 },
    { title: 'development', value: 1 },
    { title: 'quite', value: 1 },
    { title: 'slow', value: 1 },
    { title: 'hundred', value: 1 },
    { title: 'run', value: 1 },
    { title: 'asynchronously', value: 1 },
    { title: 'configurable', value: 1 },
    { title: 'size', value: 1 },
    { title: 'makes', value: 1 },
    { title: 'animate', value: 1 },
    { title: 'stuttering', value: 1 },
    { title: 'recommended', value: 1 },
    { title: 'always', value: 1 }
  ];

  constructor(private api: ApiService, private route: ActivatedRoute) { 

    this.data$ = this.api.getProfileBasics('chillya');
   }

  ngOnInit(): void {
    
    this.data$ = of(this.dsFolower);

    this.route.params.subscribe(params => {
      this.id = params['id'] || '';
      this.userId = params['userid'] || '';

      this.loadData();
    });    
  }

  loadData() {
    switch(this.id) {
      case 'interests': // polar
        //this.data$ = this.api.getInterests(this.userId);
        break;
      case 'hashtags':
        //this.data$ = this.api.getHashtags(this.userId);
        break;
      case 'weekly':
        //this.data$ = this.api.getWeeklyUsage(this.userId);
        break;
      case 'basics':
        //this.data$ = of([{ title: 'follower', value: 20}, { title: 'followed', value: 550}, { title: '', value: 0}])
        // this.data$ = this.api.getProfileBasics(this.userId)
        //                      .pipe(map(r => ([
        //                           { title: 'follower', value: 0}, 
        //                           { title: 'followed', value: 9}, 
        //                           { title: 'listed', value: 9}
        //                       ]) as DataValue[]
        //                      ));
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
