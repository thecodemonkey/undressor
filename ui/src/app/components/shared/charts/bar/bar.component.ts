import { Component, Input, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { chartFontSize, chartLabelColor, chartGridColorY, axisConfig, chartThirdColor } from 'src/app/model/charts.options';
import { DataValue } from 'src/app/model/dataset';
import { ChartBaseComponent } from '../chart.base.component';
import { chartLightColor, chartSecondColor } from '../../../../model/charts.options';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent extends ChartBaseComponent {
  @Input() datavalues!: any[];

  data: ChartData<'bar'> = {
    labels: ['7 days ago', '6', '5', '4', '3', 'yesterday', 'today'],
    datasets: [ 
      { label: 'thread started', data: [], stack: 'a', backgroundColor: chartThirdColor},
      { label: 'thread answered', data: [], stack: 'a', backgroundColor: chartSecondColor },
      { label: 'likes', data: [], stack: 'a', backgroundColor: chartLightColor}
    ]
  };

  constructor() { 
    super();

    this.showLegend = true;
    // this.options.datasets.bar = {
    //   backgroundColor: [chartLabelColor],
    //   borderWidth: 0
    // };

    this.options.scales = {
      xAxis : axisConfig(),
      yAxis : axisConfig(),
      y: { stacked: true, display: false},
      x: { stacked: true, display: false}
    };

    this.options.animation = false;


    this.options.scales.yAxis.ticks.font.size = 22;
    this.options.scales.yAxis.ticks.color = chartSecondColor;
    this.options.scales.xAxis.ticks.font.size = 22;
  }

  override init(chrt: any) {
    //this.data.labels = this.datavalues.map(d => d.title);
    const dat = this.datavalues.reverse();

    this.data.datasets[0].data = dat.map(d => d.a_count);
    this.data.datasets[1].data = dat.map(d => d.t_count);
    this.data.datasets[2].data = dat.map(d => d.l_count);

    const lg = chrt?.options.plugins?.legend;
    if (lg) {
      lg.position = 'bottom';
      lg.labels = {
        color: chartSecondColor,
        font: {
          size: 20,
          family: 'Jura',
          weight: '300'
        },
        padding: 50
      };     
    }    
  }

}
