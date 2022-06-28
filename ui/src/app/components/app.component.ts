import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, of } from 'rxjs';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  name = new FormControl('');
  data = of( { status: 'war hier...' } );

  constructor(private api:ApiService) {}

  
  ngOnInit(): void {

  }

  load(){
    this.data = this.api.getData(this.name.getRawValue() || '')
    .pipe(map(d => ({id: -1, status: `${d.status}-xx`, profile: d?.profile })));
  }
}
