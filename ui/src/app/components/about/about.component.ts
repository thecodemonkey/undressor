import { Component, OnInit } from '@angular/core';
import { State } from 'src/app/state';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(public state: State) { }

  ngOnInit(): void {
  }

}
