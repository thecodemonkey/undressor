import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import { BaseChartDirective } from 'ng2-charts';
import { chartLightColor, chartGridColor } from 'src/app/model/charts.options';
import { DataValue } from 'src/app/model/dataset';
import { ChartBaseComponent } from '../chart.base.component';

@Component({
  selector: 'app-tagcloud',
  templateUrl: './tagcloud.component.html',
  styleUrls: ['./tagcloud.component.scss']
})
export class TagcloudComponent extends ChartBaseComponent {
  @Input() datavalues!: DataValue[];
  
  _options:ChartConfiguration['options'] = {
    responsive: true,
    animation: false,
    maintainAspectRatio: false

  };

  data: ChartConfiguration['data'] = {
    labels: ['ich', 'war', 'hier'],
    datasets: [ {
      label: 'ds',
      data: [12, 20, 30],
      overflow: true,
      fit: true
    }]    
  };

  constructor() { 
    super();
    Chart.register(WordCloudController, WordElement);

    this.showLegend=false;
  }

  override init(chrt:any) {
    this.data.labels = this.datavalues.map(d => d.title);
    //const m = this.datavalues.map(d => d.value).sort((a,b) => b-a )[0];


    this.data.datasets[0].data = this.datavalues.map(d => {
      
      return  2 + d.value * 10
    });

    
    const max = (this.data.datasets[0].data as number[]).map(d => d).sort((a,b) => b-a)[0];
    console.log('max is: ', max);

    const ds = (this.data.datasets[0] as any);
    ds.color = (ctx:any) => {
      const r = Math.floor((100 / max * ctx.raw));
      let clr = '#84BCB911';

      if (r > 20 && r < 40) {
        clr = '#84BCB933'
      } else if (r > 39 && r < 60) {
        clr = '#84BCB966'
      } else if (r > 59 && r < 80) {
        clr = '#84BCB9aa'
      } else if (r > 79 ) {
        clr = '#84BCB9'
      }

      console.log(`r: ${r} | max: ${max}`);

      return clr;
    };
  }
}
