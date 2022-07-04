import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-face',
  templateUrl: './face.component.html',
  styleUrls: ['./face.component.scss']
})
export class FaceComponent implements OnInit {

  @Input() img: string = '';
  @Input() off: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
