import { Component, Input } from '@angular/core';
import { ChartData } from 'chart.js';
import { axisConfig } from 'src/app/model/charts.options';
import { DataValue } from 'src/app/model/dataset';
import { ChartBaseComponent } from '../chart.base.component';

@Component({
  selector: 'app-linearea',
  templateUrl: './linearea.component.html',
  styleUrls: ['./linearea.component.scss']
})
export class LineareaComponent extends ChartBaseComponent {
  @Input() datavalues!: DataValue[];

  data: ChartData<'line'> = {
    labels: [  ],
    datasets: [ { data: [  ] }]
  };

  constructor() { 
    super();

    this.showLegend = false;
    this.options.datasets.line = {
      backgroundColor: '#84BCB922',
      borderColor: '#84BCB9',
      borderWidth: .8,
      pointBackgroundColor: '#84BCB9',
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      pointWidth: 0,
      fill: 'origin',      
    };
    this.options.scales = {
      xAxis : axisConfig(),
      yAxis : axisConfig()
    };

    this.options.elements = {
      line: {
        tension: .5
      },
      point: {
        radius: 0
      }
    }
  }

  override init(chrt: any) {
    this.data.labels = this.datavalues.map(d => d.title);
    this.data.datasets[0].data = this.datavalues.map(d => d.value);
  }
}
