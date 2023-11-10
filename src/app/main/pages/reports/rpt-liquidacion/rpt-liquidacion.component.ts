import { style } from "@angular/animations";
import { CurrencyPipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PeriodService } from "app/services/period.service";
import { ReportesService } from "app/services/reportes.service";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-rpt-liquidacion",
  templateUrl: "./rpt-liquidacion.component.html",
  styleUrls: ["./rpt-liquidacion.component.scss"],
})
export class RptLiquidacionComponent implements OnInit {
  @Input() selectPeriodo: any[];
  @Input() listPeriod: any[];

  form: FormGroup;
  public submitted: boolean = false;

  constructor(
    private _reportesService: ReportesService,
    private fb: FormBuilder,
    private currencyPipe: CurrencyPipe
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      periodo: ["", [Validators.required]],
    });
  }

  reportliquidationHours(periodo) {
    this._reportesService.liquidationsHours(periodo).subscribe(
      (data: any) => {
        console.log(data);
        this.generateReportliquidationHours(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  generateReportliquidationHours(data) {
    const docDefinition = {
      watermark: {
        text: "Documento confidencial",
        color: "dark",
        opacity: 0.3,
        bold: true,
        italics: false,
      },
      header: {
        margin: 8,
        columns: [
          {
            // usually you would use a dataUri instead of the name for client-side printing
            // sampleImage.jpg however works inside playground so you can play with it
            image:
              "data:image/png;base64,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",
            width: 40,
          },
          {
            margin: [10, 10, 10, 10],
            text: "NEORIS",
          },
        ],
        style: {
          fontSize: 18,
        },
      },
      pageMargins: [40, 60, 40, 60],
      content: [],
      styles: {
        header: {
          fontSize: 15,
          bold: true,
          alignment: "center",
          decoration: "underline",
          margin: [0, 0, 0, 0],
        },
        subheeader: {
          fontSize: 15,
          alignment: "center",
          bold: true,
          margin: [0, 0, 0, 0],
        },
        subheeader2: {
          fontSize: 13,
          margin: [0, 0, 0, 5],
        },
        tableExample: {
          fontSize: 12,
          margin: [0, 5, 0, 5],
        },
      },
    };
    let periodo = this.selectPeriodo.filter(
      (x) => x.value === this.form.controls.periodo.value
    )[0].name;
    let infoPeriodo = this.listPeriod.filter(
      (x) => x.idPeriodo == this.form.controls.periodo.value
    )[0];

    docDefinition.content.push({
      text: "Liquidación de horas. Servicio de Soporte y Mantenimiento de Aplicaciones",
      style: "header",
    });
    docDefinition.content.push({
      text: "(" + infoPeriodo.fechaInicio + " al " + infoPeriodo.fechaFin + ")",
      style: "subheeader",
    });
    docDefinition.content.push({ text: "\n" });
    docDefinition.content.push({
      text: "Periodo: " + periodo,
      style: "subheeader2",
    });
    docDefinition.content.push({
      text: "Horas del mes: " + infoPeriodo.cantidadHoras,
      style: "subheeader2",
    });
    let total = data
      .map((item) => item.total)
      .reduce((prev, curr) => prev + curr, 0);
    var table = [
      {
        style: "tableExample",
        table: {
          widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto"],
          body: [
            [
              {
                text: "Nro",
                bold: true,
                alignment: "center",
                border: [true, true, true, true],
              },
              {
                text: "Proyecto",
                bold: true,
                alignment: "center",
                border: [true, true, true, true],
              },
              {
                text: "Colaborador",
                bold: true,
                alignment: "center",
                border: [true, true, true, true],
              },
              {
                text: "Perfil",
                bold: true,
                alignment: "center",
                border: [true, true, true, true],
              },
              {
                text: "Tarifa S/",
                bold: true,
                alignment: "center",
                border: [true, true, true, true],
              },
              {
                text: "Horas Mes",
                bold: true,
                alignment: "center",
                border: [true, true, true, true],
              },
              {
                text: "Total Colaborador S/",
                bold: true,
                alignment: "center",
                border: [true, true, true, true],
              },
            ],
            ...data.map((ed, index) => {
              return [
                { text: index + 1, border: [true, true, true, true] },
                { text: ed.proyecto, border: [true, true, true, true] },
                { text: ed.nombreCompleto, border: [true, true, true, true] },
                { text: ed.perfil, border: [true, true, true, true] },
                {
                  text: this.currencyPipe.transform(ed.tarifa, "S/."),
                  alignment: "right",
                  border: [true, true, true, true],
                },
                {
                  text: ed.horasMes,
                  alignment: "right",
                  border: [true, true, true, true],
                },
                {
                  text: this.currencyPipe.transform(ed.total, "S/."),
                  alignment: "right",
                  border: [true, true, true, true],
                },
              ];
            }),
            [
              { text: "" },
              { text: "" },
              { text: "" },
              { text: "" },
              { text: "" },
              { text: "TOTAL", bold: true },
              {
                text: this.currencyPipe.transform(total, "S/."),
                alignment: "right",
                bold: true,
                border: [true, true, true, true],
              },
            ],
          ],
        },
        layout: {
          fillColor: function (rowIndex, node, columnIndex) {
            return rowIndex === 0 ? "#CCCCCC" : null;
          },
          defaultBorder: false,
        },
      },
    ];
    docDefinition.content.push(table);
    docDefinition.content.push({ text: "* Los montos no incluye IGV", style: "subheeader2" });

    //text: "Total " + this.currencyPipe.transform(total, 'S/.'), style: "subheeader"
    pdfMake
      .createPdf(docDefinition)
      .download("Reporte_de_liquidacion_horas_" + periodo + ".pdf");
  }


  generarPdf() {
    this.submitted = true;
    if (this.form.invalid) {
      return this.form.markAllAsTouched();
    }

    this.reportliquidationHours(this.form.controls.periodo.value);
  }
}
