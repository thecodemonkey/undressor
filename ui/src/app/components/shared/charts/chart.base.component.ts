import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfig, chartConfig } from 'src/app/model/charts.options';

@Component({template: ''})
export abstract class ChartBaseComponent implements AfterViewInit {
  @ViewChild('chart')
  chart!: BaseChartDirective;
  config = chartConfig();
  options:any = this.config.options; //JSON.parse(JSON.stringify(chartConfig.options));;

  showLegend = true;

  constructor() { }

  ngAfterViewInit(): void { 
    this.init(this.chart?.chart);

    this.chart?.chart?.update();
  }

  init(chartObject: Chart | undefined): void {}


}
