import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartData } from 'chart.js';
import { chartBgColor } from 'src/app/model/charts.options';
import { DataValue } from 'src/app/model/dataset';
import { ChartBaseComponent } from '../chart.base.component';

@Component({
  selector: 'app-ring',
  templateUrl: './ring.component.html',
  styleUrls: ['./ring.component.scss']
})
export class RingComponent extends ChartBaseComponent {
  @Input() datavalues!: DataValue[];
 
  @ViewChild("lbl") elLabels!: ElementRef;

  data: ChartData<'doughnut'> = {labels: [], datasets: []};
  bgColors = ['#84BCB9', '#84BCB9aa', '#84BCB944'];
  lbls = [''];


  adjustLabels = (c: any) => {
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
    
    this.options.cutout = '60%';
    this.options.ticks = {
      display: true
    },

    this.options.onResize = this.adjustLabels;    
    this.options.datasets.doughnut = {
      borderColor: chartBgColor,
      borderWidth: 10
    }
  }

  override init(chrt: any) {
    const values = this.datavalues.map(d => d.value).sort((a, b) => (b-a));
    const max = values[0];
    const offset = (100 / max * 20);

    this.data.labels = this.datavalues.map(d => d.title);
    this.data.datasets = values.map((v, i:number) => ({
          data: [v-offset, max - (v - offset)],
          backgroundColor:[this.bgColors[i], '#84BCB900']
      })
    );


    this.lbls = this.datavalues.map(d => d.title || '');


    const lg = chrt?.options.plugins?.legend;
    if (lg) {
      lg.position = 'top';
      lg.labels = this.config.legend.labels;
    }

    this.adjustLabels(this.chart.chart);
  }  
}
