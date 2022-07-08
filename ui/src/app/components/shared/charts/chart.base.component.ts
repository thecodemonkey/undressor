import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { chartConfig } from 'src/app/model/charts.options';

@Component({template: ''})
export abstract class ChartBaseComponent implements AfterViewInit {
  @ViewChild('chart')
  chart!: BaseChartDirective;
  options = JSON.parse(JSON.stringify(chartConfig.options));;

  showLegend = true;

  constructor() { }

  ngAfterViewInit(): void { 
    this.setCustomOptions(this.chart?.chart);

    this.chart?.chart?.update();
  }

  setCustomOptions(chartObject: Chart | undefined): void {}


}
