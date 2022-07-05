import { Component, Input, OnInit } from '@angular/core';


export interface SingleBarData {
  value: number;
  label: string;
  ratio?: number;
}

@Component({
  selector: 'app-singlebar',
  templateUrl: './singlebar.component.html',
  styleUrls: ['./singlebar.component.scss']
})
export class SinglebarComponent implements OnInit {
  @Input() data: SingleBarData[] = [];
  constructor() { }


  calcRatio = (data: SingleBarData[]) => {
    const sum = data.map(d => d.value).reduce((a, v) => (a + v), 0);

    data.forEach(d => {
      d.ratio = Math.floor(100 / sum * d.value)
    });
  }


  ngOnInit(): void {
    this.calcRatio(this.data);
  }

}
