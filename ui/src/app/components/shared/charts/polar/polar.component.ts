import { Component, Input } from '@angular/core';
import { BubbleDataPoint, Chart, ChartData, ChartTypeRegistry, ScatterDataPoint } from 'chart.js';
import { chartBgColor, chartConfig, radialConfig } from 'src/app/model/charts.options';
import { DataRow, DataValue } from 'src/app/model/dataset';
import { ChartBaseComponent } from '../chart.base.component';

@Component({
  selector: 'app-polar',
  templateUrl: './polar.component.html',
  styleUrls: ['./polar.component.scss']
})
export class PolarComponent extends ChartBaseComponent { 
   @Input() datavalues!: DataValue[];


  data: ChartData<'polarArea'> = {labels: [], datasets: []};


  constructor() { 
    super();
    this.showLegend = false;
    this.options.scales.r = radialConfig();
    this.options.scales.r.pointLabels.display = true;
    this.options.scales.r.pointLabels.centerPointLabels = true;

    this.options.datasets.polarArea = {
      backgroundColor: ['#84BCB944', '#84BCB9aa', '#84BCB9'],
      borderColor: chartBgColor,
      borderWidth: 1
    }        
  }

  override init(chrt: any) {
    this.data.labels = this.datavalues.map(d => d.title);
    this.data.datasets =  [{data: this.datavalues.map(d => d.value)}];
  
    const lg = chrt?.options.plugins?.legend;
    if (lg) {
      lg.position = this.config.legend.position;
      lg.labels = this.config.legend.labels;     
    }

    const pntlbs = chrt?.options.scales.r.pointLabels;
    if (pntlbs) {
      pntlbs.display = true;
      pntlbs.centerPointLabels = true;
      pntlbs.padding = 30;
      pntlbs.font = {
        family: 'Jura',
        weight: 300,
        size: 32
      }
    }
  }
}