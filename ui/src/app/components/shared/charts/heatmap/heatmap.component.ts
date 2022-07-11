import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, DateAdapter, _adapters } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { DataValue } from 'src/app/model/dataset';
import { ChartBaseComponent } from '../chart.base.component';
import * as helpers from 'chart.js/helpers';
import { rnd } from 'src/app/utils';
import { chartBgColor, chartLabelColor, chartLightColor } from 'src/app/model/charts.options';

const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su' ];

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss']
})
export class HeatmapComponent extends ChartBaseComponent {
  @Input() datavalues!: DataValue[];

  _options:ChartConfiguration['options'] = {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          stepSize: 1,
          font: {
            size: 24,
            family: 'Jura',
            weight: '300'
          },
          color: chartLightColor,
          padding: 10,
          callback: function(label:any, index: number) {
            return (label + '').padStart(2, '0');
          },          
        },
        grid: {
          display: false
        }
      },
      y: {
        offset: true,
        ticks: {
          stepSize: 1,
          callback: function(label:any, index: number) {
            return daysOfWeek[index];
          },
          font: {
            size: 24,
            family: 'Jura',
            weight: '300'            
          },
          color: chartLightColor,
          padding: 10
        },
        grid: {
          display: false
        }
      }
    },
    layout: {
      padding: {
        top: 10,
      }
    }
  };

  data: ChartConfiguration['data'] = {
    labels: [''],
    datasets: [{
      label: '',
      data: this.generateMatrix(),
      backgroundColor(context:any) {
        const maxR = context.dataset.data.map((d:any) => d.r).sort((a:number,b:number)=>b-a)[0];
        const value = context.dataset.data[context.dataIndex].r;
        const alpha = (value - 5) / maxR;
        return helpers.color(chartLabelColor).alpha(alpha).rgbString();
      },
      borderColor:'transparent',
      borderWidth: 1,
      width: ({chart}) => (chart.chartArea || {}).width / 24 - 1,
      height: ({chart}) =>(chart.chartArea || {}).height / 7 - 1
    }]
  };

  constructor() { 
    super();
    Chart.register(MatrixController, MatrixElement);
    this.showLegend = false;
  }


  override init(chrt:any) { 
    // const pntlbs = chrt?.options.scales.x.ticks;
    // if (pntlbs) {
    //   pntlbs.font = {
    //     family: 'Jura',
    //     size: 24
    //   }
    // }    
  }

  generateMatrix() {
    const matrix:{x:number, y:number, r: number}[] = [];

    for(let x = 0; x < 24; x++) {
      for(let y = 1; y <= 7; y++) {
        matrix.push({ x: x, y: y, r: rnd(1, 150)});
      }
    }

    return matrix;
  }

}
