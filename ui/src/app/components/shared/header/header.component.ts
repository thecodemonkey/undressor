import { Component, OnInit } from '@angular/core';
import { faXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { State } from 'src/app/state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  faMagnifyingGlass = faMagnifyingGlass;
  close = faXmark;

  constructor(public state: State) { }

  ngOnInit(): void {
  }

}
