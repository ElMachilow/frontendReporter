import { Component, OnInit, ViewChild } from "@angular/core";
import { DashboardService } from "app/services/dashboard.service";
import { SecurityService } from "app/services/security.service";
import { UtilService } from "app/services/util.service";
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStates,
  ApexGrid,
  ApexTitleSubtitle
} from "ng-apexcharts";


type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

var colors = [
  "#008FFB",
  "#00E396",
  "#FEB019",
  "#FF4560",
  "#775DD0",
  "#00D9E9",
  "#FF66C3"
];

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  subtitle: ApexTitleSubtitle;
  colors: string[];
  states: ApexStates;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  tooltip: any; //ApexTooltip;
};

declare global {
  interface Window {
    Apex: any;
  }
}

window.Apex = {
  chart: {
    toolbar: {
      show: false
    }
  },
  tooltip: {
    shared: false
  },
  legend: {
    show: false
  }
};

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.scss']
})
export class DistributionComponent implements OnInit{
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartQuarterOptions: Partial<ChartOptions>;
  public dataChart = [];
  public isLoad = false;
  constructor(private _dashboardService :DashboardService,
    private _utilService: UtilService,
    private _securityService: SecurityService) {
   // this.buildChart();
  }

  ngOnInit(): void {
    this.getDistribution();
  }

  getDistribution(){
    this.isLoad = false;
    this._dashboardService.distribution(this._securityService.getIdUsuario()).subscribe((data:any) => {
     this.dataChart = data;
     this.buildChart();
     this.isLoad = true;
    }, (err) => {
      this.isLoad = false;
      console.log(err)
    })
  }

  buildChart(){
    this.chartOptions = {
      series: [
        {
          name: "year",
          data: this.makeData(this.dataChart)
        }
      ],
      chart: {
        id: "barYear",
        height: 400,
        width: "100%",
        type: "bar",
        events: {
          dataPointSelection: (e, chart, opts) => {
            var quarterChartEl = document.querySelector("#chart-quarter");
            var yearChartEl = document.querySelector("#chart-year");

            if (opts.selectedDataPoints[0].length === 1) {
              if (quarterChartEl.classList.contains("active")) {
                this.updateQuarterChart(chart, "barQuarter");
              } else {
                yearChartEl.classList.add("chart-quarter-activated");
                quarterChartEl.classList.add("active");
                this.updateQuarterChart(chart, "barQuarter");
              }
            } else {
              this.updateQuarterChart(chart, "barQuarter");
            }

            if (opts.selectedDataPoints[0].length === 0) {
              yearChartEl.classList.remove("chart-quarter-activated");
              quarterChartEl.classList.remove("active");
            }
          },
          updated: (chart) => {
            this.updateQuarterChart(chart, "barQuarter");
          }
        }
      },
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: true,
          barHeight: "75%",
          dataLabels: {
            position: "bottom"
          }
        }
      },
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"]
        },
        formatter: function(val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex];
        },
        offsetX: 0,
        dropShadow: {
          enabled: true
        }
      },

      colors: colors,

      states: {
        normal: {
          filter: {
            type: "desaturate"
          }
        },
        active: {
          allowMultipleDataPointsSelection: true,
          filter: {
            type: "darken",
            value: 1
          }
        }
      },
      tooltip: {
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function(val, opts) {
              return opts.w.globals.labels[opts.dataPointIndex];
            }
          }
        }
      },title: {
        text: "Últimos 5 Periodos",
        offsetX: 15
      },
      subtitle: {
        text: "(Click para visualizar detalle)",
        offsetX: 15
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };

    this.chartQuarterOptions = {
      series: [
        {
          name: "quarter",
          data: []
        }
      ],
      chart: {
        id: "barQuarter",
        height: 400,
        width: "100%",
        type: "bar",
        stacked: true
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          horizontal: false
        }
      },
      legend: {
        show: false
      },
      grid: {
        yaxis: {
          lines: {
            show: false
          }
        },
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      title: {
        text: "Total de peticiones por proyecto y tarea",
        offsetX: 10
      },
      tooltip: {
        x: {
          formatter: function(val, opts) {
            return opts.w.globals.seriesNames[opts.seriesIndex];
          }
        },
        y: {
          title: {
            formatter: function(val, opts) {
              return opts.w.globals.labels[opts.dataPointIndex];
            }
          }
        }
      }
    };
  }

  public makeData(arrayData): any {
    var dataSet = this.shuffleArray(arrayData);
    let obj = {};
    var dataYearSeries = [];
    dataSet.forEach((element,i) => {
      obj = {
        x: this._utilService.getTextCurrentPeriod(element.periodo),
        y: element.cantidadPeticiones,
        color: colors[i],
      quarters: element.detalle
      }
      dataYearSeries.push(obj);
    });
    

    return dataYearSeries;
  }

  public shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  public updateQuarterChart(sourceChart, destChartIDToUpdate) {
    var series = [];
    var seriesIndex = 0;
    var colors = [];

    if (sourceChart.w.globals.selectedDataPoints[0]) {
      var selectedPoints = sourceChart.w.globals.selectedDataPoints;
      for (var i = 0; i < selectedPoints[seriesIndex].length; i++) {
        var selectedIndex = selectedPoints[seriesIndex][i];
        var yearSeries = sourceChart.w.config.series[seriesIndex];
        series.push({
          name: yearSeries.data[selectedIndex].x,
          data: yearSeries.data[selectedIndex].quarters
        });
        colors.push(yearSeries.data[selectedIndex].color);
      }

      if (series.length === 0)
        series = [
          {
            data: []
          }
        ];

      return window.ApexCharts.exec(destChartIDToUpdate, "updateOptions", {
        series: series,
        colors: colors,
        fill: {
          colors: colors
        }
      });
    }
  }
}
