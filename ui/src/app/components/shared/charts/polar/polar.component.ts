import { Component } from '@angular/core';
import { BubbleDataPoint, Chart, ChartData, ChartTypeRegistry, ScatterDataPoint } from 'chart.js';
import { chartConfig } from 'src/app/model/charts.options';
import { ChartBaseComponent } from '../chart.base.component';

@Component({
  selector: 'app-polar',
  templateUrl: './polar.component.html',
  styleUrls: ['./polar.component.scss']
})
export class PolarComponent extends ChartBaseComponent { 

  data: ChartData<'polarArea'> = {
    labels: [ 'Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales' ],
    datasets: [ {
      data: [ 300, 500, 100, 40, 120 ]
    }]
  };


  constructor() { 
    super();
  }

  override setCustomOptions(chartObject: Chart<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint | null)[], unknown> | undefined): void {
    const lg = chartObject?.options.plugins?.legend;
    if (lg) {
      lg.position = chartConfig.legend.position;
      lg.labels = chartConfig.legend.labels;     
    }
  }
}