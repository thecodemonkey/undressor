import { ChartOptions, LayoutPosition } from 'chart.js';

export const chartFontSize = 36;
export const chartLightColor = '#84BCB9';
export const chartBgColor = '#171D1E';
export const chartGridColor = '#84BCB944';
export const chartGridColorY = '#84BCB911';
export const chartLabelColor = '#84BCB9';

export interface ChartConfig {
    legend: {
        position: LayoutPosition,
        labels:any
    },
    options: ChartOptions
}

export const radialConfig = () => ({
    grid: { 
        color: chartGridColor,
        circular: true
    },
    ticks: { 
        color: chartLightColor, 
        backdropColor: chartBgColor, 
        backdropPadding: 15,
        display: false
    },
    pointLabels: {
        font: {
          size: chartFontSize,
        },
        color: chartLabelColor
   }            
});

export const axisConfig = () => ({   
      ticks: {
        font: {
          size: chartFontSize
        },
        color: chartLabelColor
      },
      grid: {
        color: chartGridColorY,
      }
 });


export function chartConfig(): ChartConfig {
    return ({
        legend: {
            position: 'bottom',
            labels: { font: { size: chartFontSize } }
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation : {
                // duration: 0
            },
            scales: { },
            datasets: { },
            plugins: {}
        }
    });
}