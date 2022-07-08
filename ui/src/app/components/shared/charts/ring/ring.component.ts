import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BubbleDataPoint, Chart, ChartData, ChartTypeRegistry, ScatterDataPoint } from 'chart.js';
import { of } from 'rxjs';
import { chartConfig } from 'src/app/model/charts.options';
import { ChartBaseComponent } from '../chart.base.component';

@Component({
  selector: 'app-ring',
  templateUrl: './ring.component.html',
  styleUrls: ['./ring.component.scss']
})
export class RingComponent extends ChartBaseComponent {
  labels = [ 'en', 'de', 'other'];
  

  @ViewChild("lbl") elLabels!: ElementRef;

  data: ChartData<'doughnut'> = {
    labels: this.labels,
    datasets: [ 
      { data: [ 80, 20 ] },
      { data: [ 50, 50 ] },
      { data: [ 20, 70 ] }
    ]
  };

  udjustLabels = (c: any) => {
    const ofst = 80;
    const r = c._sortedMetasets[0]?.controller?.innerRadius - ofst;
    if (!isNaN(r)){
      this.elLabels.nativeElement.style['margin-bottom'] = `${Math.floor(r)}px`;

      console.log('resized offset: ', r);
    }      
  }

  constructor() { 
    super(); 
    this.showLegend = false;
    
    delete this.options.scales.r;
    this.options.cutout = '60%';
    this.options.ticks = {
      display: true
    },

    this.options.onResize = this.udjustLabels;

    
  }

  override setCustomOptions(chartObject: Chart<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint | null)[], unknown> | undefined): void {
    const lg = chartObject?.options.plugins?.legend;
    if (lg) {
      lg.position = 'top';
      lg.labels = chartConfig.legend.labels;
    }

    this.udjustLabels(this.chart.chart);
    console.log('legend', lg);
  }  

}
