import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { colors } from 'app/colors.const';
import { DashboardService } from 'app/services/dashboard.service';
import { SecurityService } from 'app/services/security.service';
import { UtilService } from 'app/services/util.service';
import { ShtModalDetailComponent } from './sht-modal-detail/sht-modal-detail.component';

@Component({
  selector: 'app-summary-hours-total',
  templateUrl: './summary-hours-total.component.html',
  styleUrls: ['./summary-hours-total.component.scss']
})
export class SummaryHoursTotalComponent implements OnInit {
  @Input() periods: string;
  public data = {
    goalOverview: {
      series: [0],
      analyticsData: {
        completed: '0',
        inProgress: '0'
      }
    }
  };;
  public averageHours = 0;
  public goalChartoptions;
  public isMenuToggled = false;
  public CurrentPeriod : Number;
  public textCurrentPeriod : String = "";
  private $goalStrokeColor2 = '#51e5a8';
  private $strokeColor = '#ebe9f1';
  private $textHeadingColor = '#5e5873';
  constructor(private _dashboardService: DashboardService,
    private _utilService: UtilService,
    private modalService: NgbModal) {
    this.CurrentPeriod = _utilService.getCurrentPeriod();
    this.textCurrentPeriod = _utilService.getTextCurrentPeriod(this.CurrentPeriod);
  }

  ngOnInit(): void {
    this.buildChartSummaryHours();
    this.summaryHours(this.CurrentPeriod);
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

  summaryHours(periodo:Number) {
    this._dashboardService.summaryHoursTotal(periodo).subscribe((data: any) => {
      let horasRegistradas = data[0].totalHoras;
      this.averageHours = data[0].horasPeriodo;
      let percentage: Number = this.getPercentage(horasRegistradas, this.averageHours);
      this.data = {
        goalOverview: {
          series: [Number(percentage.toFixed(2))],
          analyticsData: {
            completed: this.averageHours.toString(),
            inProgress: horasRegistradas.toString()
          }
        }
      };
    }, (err) => {
      console.log(err)
    })
  }

  summaryHoursPerPeriod(periodo){
    this.CurrentPeriod = periodo;
    this.textCurrentPeriod = this._utilService.getTextCurrentPeriod(periodo);
    this.summaryHours(Number(periodo));
  }

  getPercentage(partialValue, totalValue): Number {
    return (100 * partialValue) / totalValue;
  }

  modalOpenSLCIM() {
   const modalRef = this.modalService.open(ShtModalDetailComponent, {size: 'xl', scrollable: true});
   modalRef.componentInstance.textCurrentPeriod = this.textCurrentPeriod;
   modalRef.componentInstance.CurrentPeriod = this.CurrentPeriod;
    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }
} 
