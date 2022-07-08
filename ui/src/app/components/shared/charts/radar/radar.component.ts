import { Component, OnInit } from '@angular/core';
import { BubbleDataPoint, Chart, ChartData, ChartTypeRegistry, ScatterDataPoint } from 'chart.js';
import { ChartBaseComponent } from '../chart.base.component';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss']
})
export class RadarComponent extends ChartBaseComponent {
  
  constructor() { 
    super(); 
    this.showLegend = false;
  }

  data: ChartData<'radar'> = {
    labels: [ 'Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales' ],
    datasets: [ {
      data: [ 300, 500, 100, 40, 120 ]
    }]
  };

}
