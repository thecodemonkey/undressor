import { NONE_TYPE } from '@angular/compiler';
import { ChartOptions, LayoutPosition } from 'chart.js';

const fontSize = 16;

export interface ChartConfig {
    legend: {
        position: LayoutPosition,
        labels:any
    },
    options: ChartOptions
}

export const chartConfig:ChartConfig = {
    legend: {
        position: 'bottom',
        labels: { font : { size: fontSize } }
    },
    options: {
        responsive:true, 
        maintainAspectRatio:false,
        scales: {
          r: {
            grid: { 
                color: '#84BCB944',
                circular: true
            },
            ticks: { 
                color: '#84BCB9', 
                backdropColor: '#171D1E', 
                backdropPadding: 15
            },
            pointLabels: {
                font: {
                  size: fontSize,
                },
                color: '#84BCB988'

           }            
          }
        },
        datasets: {
          polarArea: {
            backgroundColor: ['#84BCB944', '#84BCB9aa', '#84BCB9'],
            borderColor: '#171D1E',
            borderWidth: 1
          },
          radar: {
            backgroundColor: ['#84BCB944', '#84BCB9aa', '#84BCB9'],
            borderColor: '#171D1E',
            borderWidth: 1,
            pointBorderWidth: 0,
            pointRadius: 2,
            pointBackgroundColor: '#84BCB9'
          },
          doughnut: {
            backgroundColor: ['#84BCB9', '#84BCB901'],
            borderColor: '#171D1E',
            borderWidth: 10
          }
        },
        plugins: {}
    }
}