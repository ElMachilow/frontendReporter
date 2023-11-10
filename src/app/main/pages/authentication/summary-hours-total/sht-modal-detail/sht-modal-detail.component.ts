import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { colors } from 'app/colors.const';
import { DashboardService } from 'app/services/dashboard.service';
import { UtilService } from 'app/services/util.service';

@Component({
  selector: 'app-sht-modal-detail',
  templateUrl: './sht-modal-detail.component.html',
  styleUrls: ['./sht-modal-detail.component.scss']
})
export class ShtModalDetailComponent implements OnInit {
  @Input() public textCurrentPeriod;@Input() public CurrentPeriod;
  public data = {
    goalOverview: {
      series: [0],
      analyticsData: {
        completed: '0',
        inProgress: '0'
      }
    }
  };
  isload:boolean = false;
  public dataArr = [];
  public descripcionPeriodo:String = "";
  public goalChartoptions;
  public isMenuToggled = false;
  private $goalStrokeColor2 = '#51e5a8';
  private $strokeColor = '#ebe9f1';
  private $textHeadingColor = '#5e5873';
  constructor(private _dashboardService: DashboardService, private modalService: NgbModal) {
    
  }

  ngOnInit(): void {
    this.buildChartSummaryHours();
    this.summaryHoursTotalDetail(this.CurrentPeriod);
  }

buildChartSummaryHours(){
  this.goalChartoptions = {
    chart: {
      height: 245,
      type: 'radialBar',
      sparkline: {
        enabled: true
      },
      dropShadow: {
        enabled: true,
        blur: 3,
        left: 1,
        top: 1,
        opacity: 0.1
      }
    },
    colors: [this.$goalStrokeColor2],
    plotOptions: {
      radialBar: {
        offsetY: -10,
        startAngle: -150,
        endAngle: 150,
        hollow: {
          size: '77%'
        },
        track: {
          background: this.$strokeColor,
          strokeWidth: '50%'
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            color: this.$textHeadingColor,
            fontSize: '2.86rem',
            fontWeight: '600'
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: [colors.solid.info],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    grid: {
      padding: {
        bottom: 30
      }
    }
  };
}

summaryHoursTotalDetail(periodo) {
  this.isload= false;
    this._dashboardService.summaryHoursTotalDetail(periodo).subscribe((data: any) => {
      
      data.forEach(element => {
        let horasRegistradas = element.totalHoras;
        let averageHours = element.horasPeriodo;
        let percentage: Number = this.getPercentage(horasRegistradas, averageHours);
        let data = {
          NombreCompleto: element.nombreCompleto,
          celular: element.celular.replaceAll(" ","").replaceAll("(","").replaceAll(")",""),
          goalOverview: {
          series: [Number(percentage.toFixed(2))],
          analyticsData: {
            completed: averageHours,
            inProgress: horasRegistradas.toString()
          }
        }
      };
      this.dataArr.push(data);
      this.isload = true
      });
      console.log(this.dataArr);
    }, (err) => {
      this.isload = false;
      console.log(err)
    })
  }


  getPercentage(partialValue, totalValue): Number {
    return (100 * partialValue) / totalValue;
  }

  closeModal(){
    this.modalService.dismissAll();
  }
} 
