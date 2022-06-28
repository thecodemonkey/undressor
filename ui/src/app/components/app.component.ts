import { Component, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private api:ApiService) {}

  data = of( { status: 'war hier...' } );

  ngOnInit(): void {
     this.data = this.api.getData()
                         .pipe(map(d => ({id: -1, status: `${d.status}-xx`})));
  }

}
