import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PeriodService } from "app/services/period.service";
import { petitionService } from "app/services/petition.service";
import { UserService } from "app/services/user.service";
import { Constantes } from "app/util/Constantes";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { map } from "rxjs/operators";
import { UtilService } from "app/services/util.service";
import { forkJoin } from "rxjs";
import { ReportesService } from "app/services/reportes.service";
@Component({
  selector: "app-rpt-hours",
  templateUrl: "./rpt-hours.component.html",
  styleUrls: ["./rpt-hours.component.scss"],
})
export class RptHoursComponent implements OnInit {
  @Input() selectPeriodo: any[];
  public contentHeader: object;
  public isCollapsed5 = false;
  public colaborador = "";
  public selectUsuario: any = [];
  totalHorasEncabezado = 0;
  totalHorasDetalleExcel = 0;
  public submitted: boolean = false;
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _periodService: PeriodService,
    private _reporteService: ReportesService,
    private _userService: UserService,
    private _utilService: UtilService,
    private _petitionService: petitionService
  ) { }

  ngOnInit(): void {
    this.loadParameters();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      usuarios: ["", [Validators.required]],
      periodo: ["", [Validators.required]],
    });
  }

  loadParameters() {
    this._userService.listUserByRol(Constantes.ROL_USER).subscribe(
      (data: any) => {
        let arr = [];
        data.forEach((element) => {
          let obj = {
            name: element.nombres + " " + element.apellidos,
            value: element.idUsuario,
          };
          arr.push(obj);
          this.selectUsuario = arr;
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  reportHeadDetailPetition(idUsuario, periodo) {
    this._petitionService
      .listPetitionHeadDetailByIdUserPeriod(idUsuario, periodo)
      .subscribe(
        (data: any) => {
          console.log(data);
          this.generateReportHeadDetailPetition(data);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  generateReportHeadDetailPetition(data) {
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
          decoration: "underline",
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        subheeader: {
          fontSize: 13,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        subheeader2: {
          fontSize: 13,
          margin: [0, 0, 0, 5],
        },
        detalles: {
          fontSize: 13,
          bold: true,
          margin: [0, 0, 0, 5],
        },
        tableExample: {
          fontSize: 12,
          alignment: "center",
          margin: [0, 5, 0, 5],
        },
      },
    };

    let colaborador = this.selectUsuario.filter(
      (x) => x.value == this.form.controls.usuarios.value
    )[0].name;
    let periodo = this.selectPeriodo.filter(
      (x) => x.value == this.form.controls.periodo.value
    )[0].name;
    docDefinition.content.push({ text: "Reporte de Horas", style: "header" });
    docDefinition.content.push({
      text: "Colaborador: " + colaborador,
      style: "subheeader2",
    });
    docDefinition.content.push({
      text: "Periodo: " + periodo,
      style: "subheeader2",
    });
    docDefinition.content.push({
      text: "Total de Horas: " + this.getTotalHoras(data),
      style: "subheeader2",
    });

    data.forEach((x, i) => {

      var table = [
        {
          text: [
            { text: "\n\nPetición Nro. " + (i + 1) + ": ", style: "detalles" },
            { text: x.peticion },
          ],
        },
        {
          text: [
            { text: "Proyecto: ", style: "detalles" },
            { text: x.proyecto },
            { text: " Tipo de Tarea: ", style: "detalles" },
            { text: x.tarea },
            { text: " Nro. Petición: ", style: "detalles" },
            { text: x.nroPeticion },
            { text: " Total Horas: ", style: "detalles" },
            { text: x.totalHoras },
          ],
        }, {
          text: [
            { text: "\n" }
          ],
        },
        this.getDetailPetition(x.listpeticionDetalleDTO),
      ];
      docDefinition.content.push(table);
    });
    pdfMake
      .createPdf(docDefinition)
      .download("Reporte_de_horas_" + periodo + "_" + colaborador + ".pdf");
  }

  getDetailPetition(dataDetalle) {
    return {
      table: {
        style: "tableExample",
        widths: ["*", 396, "*"],
        body: [
          [
            {
              text: "Fecha",
              style: "tableExample",
              bold: true,
            },
            {
              text: "Descripción",
              style: "tableExample",
              bold: true,
            },
            {
              text: "Horas",
              style: "tableExample",
              bold: true,
            },
          ],
          ...dataDetalle.map((ed) => {
            return [ed.fechaAtencion, ed.descripcion, { text: ed.horas, alignment: "right", }];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex, node, columnIndex) {
          return rowIndex === 0 ? "#CCCCCC" : null;
        },
      },
    };
  }

  getTotalHoras(data) {
    let total = data
      .map((item) => item.totalHoras)
      .reduce((prev, curr) => prev + curr, 0);
    return total;
  }

  generarPdf() {
    this.submitted = true;
    if (this.form.invalid) {
      return this.form.markAllAsTouched();
    }

    this.reportHeadDetailPetition(
      this.form.controls.usuarios.value,
      this.form.controls.periodo.value
    );
  }

  generarExcel() {
    this.submitted = true;
    if (this.form.invalid) {
      return this.form.markAllAsTouched();
    }
    this.colaborador = this.selectUsuario.filter(
      (x) => x.value == this.form.controls.usuarios.value
    )[0].name;

    forkJoin([
      this._petitionService.listPetitionHeadDetailByIdUserPeriod(this.form.controls.usuarios.value, this.form.controls.periodo.value),
      this._reporteService.petitionByPeriod(this.form.controls.periodo.value, this.form.controls.usuarios.value),
      this._reporteService.additional(this.form.controls.periodo.value, this.form.controls.usuarios.value)
    ]).subscribe((res: any) => {
      let dataResumen: any = [], dataDetalle: any = [];

      res[0].map(((item: any) => dataResumen.push({ proyecto: item.proyecto, tarea: item.tarea, nroPeticion: item.nroPeticion, peticion: item.peticion, totalHoras: item.totalHoras })))

      let total = res[0]
        .map((item) => item.totalHoras)
        .reduce((prev, curr) => prev + curr, 0);

      dataResumen.push({orden:'TOTAL', proyecto: '', tarea: '', nroPeticion: '', peticion: '', totalHoras: total })

      res[1].map(((item: any) => dataDetalle.push({ proyecto: item.descripcionProyecto, tipoTarea: item.descripcionTarea, nroPeticion: item.nroPeticion, peticion: item.nombre, fecha: item.fechaAtencion, descripcion: item.descripcion, horas: item.horas })))
      this.totalHorasDetalleExcel = res[1]
        .map((item) => item.horas)
        .reduce((prev, curr) => prev + curr, 0);

      this.exportExcel(dataResumen, dataDetalle,res[2], this.form.controls.periodo.value);
    },
      (err) => {
        console.log(err);
      });
  }

  exportExcel(dataResumen: any, dataDetalle: any,dataAdicionales, periodo: any) {
    //WOORKSHEET RESUMEN
    let workbook = new Workbook();
    this.hojaResumen(workbook, dataResumen, periodo);
    this.detalleHoras(workbook, dataDetalle, periodo);
    this.adicionales(workbook,dataAdicionales,periodo);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'FORUM-'+periodo+"-Liquidación Horas-"+this.colaborador+"v0.1"+".xlsx");
    })
  }

  hojaResumen(workbook: any, data: any, periodo: any) {
    const title = 'NEORIS - RESUMEN DE HORAS ' + this._utilService.getTextCurrentPeriod(periodo).toUpperCase();
    const header = ["Nº","PROYECTO", "TIPO DE TAREA", "NRO. PETICIÓN", "PETICIÓN", "TOTAL DE HORAS"]
    let dataForExcel = [];
    data.forEach((row: any,index:number) => {
      if(index == data.length-1){
        dataForExcel.push(Object.values(row))
      }else{
        dataForExcel.push(Object.values(this.addOrderResumen(row,index+1)))
      }
    })

    //Create workbook and worksheet

    let worksheet = workbook.addWorksheet('Resumen');

    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);

    titleRow.font = { name: 'Arial', family: 4, size: 16, underline: 'double', bold: true }
    worksheet.addRow([]);
    let subTitleRow = worksheet.addRow(['COLABORADOR : ' + this.colaborador])
    subTitleRow.eachCell((cell) => {
      cell.font = { size: 12 }
    })
    //Add Image
    worksheet.mergeCells('A1:E2');
    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(header);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'BFBFBF' },
        bgColor: { argb: 'BFBFBF' }
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.font = { bold: true, size: 12 }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    dataForExcel.forEach(d => {
      let row = worksheet.addRow(d);
    });


    worksheet.addRow([]);
    let rowIndex = 6;
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 50;
    worksheet.getColumn(6).width = 15;
    for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
      worksheet.getRow(rowIndex).alignment = { vertical: 'middle', wrapText: true };
      worksheet.getRow(rowIndex).eachCell(cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true },
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      })

      if (rowIndex == worksheet.rowCount) {
        worksheet.getRow(rowIndex - 1).eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'BFBFBF' },
            bgColor: { argb: 'BFBFBF' }
          }
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          cell.font = { bold: true, size: 12 }
        })

        worksheet.mergeCells(`A${rowIndex - 1}:E${rowIndex - 1}`);
      }
    }

  }

  //agrupacion
  detalleHorasAgrupacion(workbook: any, data: any, periodo: any) {
    const title = 'NEORIS - Detalle de horas ' + this._utilService.getTextCurrentPeriod(periodo).toUpperCase();
    const header = ["Proyecto", "Tipo de Tarea", "Nro Petición", "Tarea", "Fecha", "Descripción de Tarea", "Horas"]
    let dataForExcel = [];
    data.forEach((row: any) => {
      dataForExcel.push(Object.values(row))
    })
    //Create workbook and worksheet

    let worksheet = workbook.addWorksheet('Detalle de Horas');

    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);

    titleRow.font = { name: 'Arial', family: 4, size: 16, underline: 'double', bold: true }
    worksheet.addRow([]);
    let subTitleRow = worksheet.addRow(['Colaborador : '+this.colaborador])
    subTitleRow.eachCell((cell) => {
      cell.font = { size: 12 }
    })
    //Add Image
    worksheet.mergeCells('A1:D2');
    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(header);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'BFBFBF' },
        bgColor: { argb: 'BFBFBF' }
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.font = { bold: true, size: 12 }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    dataForExcel.forEach(d => {
      let row = worksheet.addRow(d);
    });

    let rowIndex = 6;
    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 50;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 60;
    worksheet.getColumn(7).width = 10;
    for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
      worksheet.getRow(rowIndex).alignment = { vertical: 'middle', wrapText: true };
      worksheet.getRow(rowIndex).eachCell(cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true },
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      })
    }

    const uniqueData = [...new Set(data.map(item => item.nroPeticion))];
    uniqueData.forEach((item) => {
      let index = data.map(object => object.nroPeticion).indexOf(item);
      let lastindex = data.map(object => object.nroPeticion).lastIndexOf(item);
      worksheet.mergeCells(`D${index + 6}:D${lastindex + 6}`);
      worksheet.mergeCells(`A${index + 6}:A${lastindex + 6}`);
      worksheet.mergeCells(`B${index + 6}:B${lastindex + 6}`);
      worksheet.mergeCells(`C${index + 6}:C${lastindex + 6}`);
    })
    worksheet.addRow(['Total','','','','','',this.totalHorasDetalleExcel]);
    worksheet.getRow(worksheet.rowCount).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'BFBFBF' },
        bgColor: { argb: 'BFBFBF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.font = { bold: true, size: 12 }
    })
    worksheet.mergeCells(`A${worksheet.rowCount}:F${worksheet.rowCount}`);
  }

  detalleHoras(workbook: any, data: any, periodo: any) {
    const title = 'NEORIS - DETALLE DE HORAS ' + this._utilService.getTextCurrentPeriod(periodo).toUpperCase();
    const header = ["Nº","PROYECTO", "TIPO DE TAREA", "NRO. PETICIÓN", "TAREA", "FECHA", "DESCRIPCIÓN DE TAREA", "HORAS"]
    let dataForExcel = [];
    console.log(data);
    data.forEach((row: any,index:number) => {
      dataForExcel.push(Object.values(this.addOrderDetalleHoras(row,index+1)))
    });
    //Create workbook and worksheet

    let worksheet = workbook.addWorksheet('Detalle de Horas');

    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);

    titleRow.font = { name: 'Arial', family: 4, size: 16, underline: 'double', bold: true }
    worksheet.addRow([]);
    let subTitleRow = worksheet.addRow(['COLABORADOR : '+this.colaborador])
    subTitleRow.eachCell((cell) => {
      cell.font = { size: 12 }
    })
    //Add Image
    worksheet.mergeCells('A1:E2');
    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(header);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'BFBFBF' },
        bgColor: { argb: 'BFBFBF' }
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.font = { bold: true, size: 12 }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    dataForExcel.forEach(d => {
      let row = worksheet.addRow(d);
    });

    let rowIndex = 6;
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 50;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 60;
    worksheet.getColumn(8).width = 10;
    for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
      worksheet.getRow(rowIndex).alignment = { vertical: 'middle', wrapText: true };
      worksheet.getRow(rowIndex).eachCell(cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true },
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      })
    }

    worksheet.addRow(['TOTAL','','','','','','',this.totalHorasDetalleExcel]);
    worksheet.getRow(worksheet.rowCount).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'BFBFBF' },
        bgColor: { argb: 'BFBFBF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.font = { bold: true, size: 12 }
    })
    worksheet.mergeCells(`A${worksheet.rowCount}:G${worksheet.rowCount}`);
  }

  adicionales(workbook: any, data: any, periodo: any) {
    const title = 'NEORIS - DISTRIBUCIÓN DE PETICIONES Y HORAS ' + this._utilService.getTextCurrentPeriod(periodo).toUpperCase();
    const header1 = ["","EVOLUTIVO","", "INCIDENCIAS","", "NORMATIVOS","", "TOTALES",""]
    const header = ["PROYECTO", "CANT. ATENCIONES", "CANT. HORAS", "CANT. ATENCIONES", "CANT. HORAS", "CANT. ATENCIONES", "CANT. HORAS","CANT. ATENCIONES", "CANT. HORAS"]
    let dataForExcel = [];
    data.forEach((row: any) => {
      dataForExcel.push(Object.values(row))
    })
    
    //Create workbook and worksheet

    let worksheet = workbook.addWorksheet('Adicionales');

    //Add Row and formatting
    
    let titleRow = worksheet.addRow([title]);

    titleRow.font = { name: 'Arial', family: 4, size: 16, underline: 'double', bold: true }
    worksheet.addRow([]);
    let subTitleRow = worksheet.addRow(['COLABORADOR : '+this.colaborador])
    subTitleRow.eachCell((cell) => {
      cell.font = { size: 12 }
    })
    //Add Image
    worksheet.mergeCells('A1:H2');
    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    let color= ["FFFFFF","FFFFFF","afdeac","afdeac","F9E4C3","F9E4C3","f7a325","f7a325","a8d7f5","a8d7f5"]
    let headerRow1 = worksheet.addRow(header1);
    worksheet.mergeCells('B5:C5');
    worksheet.mergeCells('D5:E5');
    worksheet.mergeCells('F5:G5');
    worksheet.mergeCells('H5:I5');
    headerRow1.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color[number] },
        bgColor: { argb: color[number] }
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.font = { bold: true, size: 12 },
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

    let headerRow = worksheet.addRow(header);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'BFBFBF' },
        bgColor: { argb: 'BFBFBF' }
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.font = { bold: true, size: 12 }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    dataForExcel.forEach(d => {
      let row = worksheet.addRow(d);
    });

    let rowIndex = 7;
    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 12;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 12;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 12;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 12;
    for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
      worksheet.getRow(rowIndex).alignment = { vertical: 'middle', wrapText: true };
      worksheet.getRow(rowIndex).eachCell(cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true },
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      })

      if(rowIndex == worksheet.rowCount){
        worksheet.getRow(rowIndex).eachCell(cell => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'BFBFBF' },
            bgColor: { argb: 'BFBFBF' }
          },
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true },
          cell.font = { bold: true, size: 12 }
        })
      }
    }

   
  }

  addOrderDetalleHoras(row,index){
    return {orden: index, proyecto: row.proyecto, 
      tipoTarea: row.tipoTarea,
      nroPeticion: row.nroPeticion,
      peticion: row.peticion,
      fecha: row.fecha,
      descripcion: row.descripcion,
      horas: row.horas}  }

  addOrderResumen(row,index){
    return {orden: index, proyecto: row.proyecto, tarea: row.tarea, nroPeticion: row.nroPeticion, peticion: row.peticion, totalHoras: row.totalHoras}
  }
}
