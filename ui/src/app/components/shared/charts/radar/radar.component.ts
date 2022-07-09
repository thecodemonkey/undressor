import { Component, Input, OnInit } from '@angular/core';
import { BubbleDataPoint, Chart, ChartData, ChartTypeRegistry, ScatterDataPoint } from 'chart.js';
import { chartBgColor, chartLightColor, radialConfig } from 'src/app/model/charts.options';
import { DataRow, DataValue } from 'src/app/model/dataset';
import { ChartBaseComponent } from '../chart.base.component';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss']
})
export class RadarComponent extends ChartBaseComponent {
  @Input() datavalues!: DataValue[];
  
  constructor() { 
    super(); 
    this.showLegend = false;
    this.options.scales.r = radialConfig();

    this.options.datasets.radar = {
      backgroundColor: ['#84BCB944', '#84BCB9aa', '#84BCB9'],
      borderColor: chartBgColor,
      borderWidth: 1,
      pointBorderWidth: 0,
      pointRadius: 2,
      pointBackgroundColor: chartLightColor
    }
  }

  data: ChartData<'radar'> = {labels: [], datasets: []};


  override init(chrt:any ) {
    this.data.labels = this.datavalues.map(d => d.title);
    this.data.datasets =  [{
        data: this.datavalues.map(d => d.value)
    }];
  }
}
