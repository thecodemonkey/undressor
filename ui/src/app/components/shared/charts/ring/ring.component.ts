import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart, ChartData } from 'chart.js';
import { ArgumentOutOfRangeError, timer } from 'rxjs';
import { chartBgColor } from 'src/app/model/charts.options';
import { DataValue } from 'src/app/model/dataset';
import { ChartBaseComponent } from '../chart.base.component';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-ring',
  templateUrl: './ring.component.html',
  styleUrls: ['./ring.component.scss']
})
export class RingComponent extends ChartBaseComponent {
  @Input() datavalues: DataValue[] | null = null;
  @Input() title: string = '';
 
  @ViewChild("lbl") elLabels!: ElementRef;

  data: ChartData<'doughnut'> = {labels: [], datasets: []};
  bgColors = ['#84BCB9', '#84BCB9aa', '#84BCB944'];
  lbls = [{lbl: '', val: 0}];


  adjustLabels = (c: any) => {
    const ofst = 60;
    const r = c._sortedMetasets[0]?.controller?.innerRadius - ofst;
    if (!isNaN(r)){
      this.elLabels.nativeElement.style['margin-bottom'] = `${Math.floor(r)}px`;

      const arc = c._sortedMetasets[0]?.data[0];

      console.log('resized offset: ', arc.x + ' | ' + arc.y);
    }      
  }

  constructor() { 
    super(); 
    //Chart.register(ChartDataLabels);

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


  override ngOnInit() {
    console.log('oninit data: ', this.datavalues);  
  }


  override init(chrt: any) {

    console.log('init data: ', this.datavalues);

    if(this.datavalues) {

      const values = this.datavalues.sort((a,b) => (b.value - a.value));
      const max = values[0].value;
      const offset = (100 / max * 20); 


      this.data.labels = this.datavalues.map(d => d.title);
      this.data.datasets = values.map((v, i:number) => {
        let vl:number = v.value;
        const r = 100 / max * v.value;
        
        const ra =  Math.floor(Math.floor(100 / 75) * r);

        vl = ra - (ra/100 * 25)

        // console.log(` ${v.title} - r: ${r} - ra: ${ra} - vl: ${vl} - raa% ${((100 / ra) * 25)}`);


        if (vl < 0) vl = 0;

        return {
            data: [vl, 100 - vl],
            backgroundColor:[this.bgColors[i], '#84BCB900'],
        }}
      );


      const lg = chrt?.options.plugins?.legend;
      if (lg) {
        lg.position = 'top';
        lg.labels = this.config.legend.labels;
      }

      timer(100).subscribe(() => {
        if (this.datavalues){
          this.lbls = this.datavalues.map(d => ({lbl: d.title || '', val: d.value}));
          this.adjustLabels(chrt);
        }
      });
    }
    
  }  
}
