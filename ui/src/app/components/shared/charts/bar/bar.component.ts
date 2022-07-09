import { Component, Input, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { chartFontSize, chartLabelColor, chartGridColorY, axisConfig } from 'src/app/model/charts.options';
import { DataValue } from 'src/app/model/dataset';
import { ChartBaseComponent } from '../chart.base.component';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent extends ChartBaseComponent {
  @Input() datavalues!: DataValue[];

  data: ChartData<'bar'> = {
    labels: [  ],
    datasets: [ { data: [  ] }]
  };

  constructor() { 
    super();

    this.showLegend = false;
    this.options.datasets.bar = {
      backgroundColor: '#84BCB9',
      borderWidth: 0
    };

    this.options.scales = {
      xAxis : axisConfig(),
      yAxis : axisConfig()
    };
  }

  override init(chrt: any) {
    this.data.labels = this.datavalues.map(d => d.title);
    this.data.datasets[0].data = this.datavalues.map(d => d.value);

  }

}
