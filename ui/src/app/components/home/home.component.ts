import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { of, map } from 'rxjs';
import { ApiService } from 'src/app/api.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  name = new FormControl('');
 
  constructor(private api:ApiService, private router: Router) { }

  ngOnInit(): void {  }

  load(){
    const tname = this.name.getRawValue() || '';
    this.router.navigate([`/insights/${tname}`]);
  }

}  

