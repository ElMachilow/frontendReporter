import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportesService } from 'app/services/reportes.service';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Constantes } from 'app/util/Constantes';
import { UtilService } from 'app/services/util.service';

@Component({
  selector: 'app-rpt-petition-analyst',
  templateUrl: './rpt-petition-analyst.component.html',
  styleUrls: ['./rpt-petition-analyst.component.scss']
})
export class RptPetitionAnalystComponent implements OnInit {
  @Input() selectPeriodo: any[];
  @Input() listPeriod: any[];

  form: FormGroup;
  public submitted: boolean = false;
  public logoBase64 = "data:image/png;base64,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";
  constructor(
    private fb: FormBuilder,
    private _reporteService: ReportesService,
    private _utilService: UtilService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      periodo: ["", [Validators.required]],
    });
  }

  generar() {
    this.submitted = true;
    if (this.form.invalid) {
      return this.form.markAllAsTouched();
    }

    this.reporte(this.form.controls.periodo.value);
  }

  reporte(periodo) {
    this._reporteService.petitionByPeriod(periodo, Constantes.TODOS).subscribe(
      (data: any) => {
        this.generarExcelv2(data, periodo);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  generarExcel(data: any, periodo: any) {

    let Heading = [['Descripcion', 'Nombre', 'Horas', 'Fecha Atención', 'Tarea', 'Proyecto', 'Analista', 'Nro Petición']];

    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, Heading);

    //Starting in the second row to avoid overriding and skipping headers
    XLSX.utils.sheet_add_json(ws, data, { origin: 'A2', skipHeader: true });

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet2');
    const max_width = data.reduce((w, r) => Math.max(w, r.descripcion.length), 10);
    ws["!cols"] = [{ wch: max_width }];
    XLSX.writeFile(wb, "Reporte_de_peticiones_" + periodo + ".xlsx");
  }

  generarExcelv2(data:any, periodo:any) {
    let workbook = new Workbook();
    const title = 'NEORIS - PETICIONES POR PERIODO ' + this._utilService.getTextCurrentPeriod(periodo).toUpperCase();
    const header = ["Nº","ANALISTA", "PROYECTO", "TAREA", "NRO. PETICIÓN", "PETICIÓN", "FECHA", "DESCRIPCIÓN TAREA", "HORAS"]
    let dataForExcel = [];
    console.log(data);
    data.forEach((row: any,index:number) => {
        dataForExcel.push(Object.values(this.orden(row,index+1)))
    })

    //Create workbook and worksheet

    let worksheet = workbook.addWorksheet('TOTAL');

    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);

    titleRow.font = { name: 'Arial', family: 4, size: 16, underline: 'double', bold: true }
    worksheet.addRow([]);

    //Add Image
    worksheet.mergeCells('A1:F2');
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
    let rowIndex = 5;
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 60;
    worksheet.getColumn(9).width = 15;
    for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
      worksheet.getRow(rowIndex).alignment = { vertical: 'middle', wrapText: true };
      worksheet.getRow(rowIndex).eachCell(cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true },
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      })
    }

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'TOTAL PETICIONES - '+periodo+".xlsx");
    })
  }

  orden(row,index){
    return {orden: index,
       analista: row.analista, 
      descripcionProyecto: row.descripcionProyecto,
      descripcionTarea: row.descripcionTarea,
      nroPeticion: row.nroPeticion, 
      nombre: row.nombre,
      fechaAtencion: row.fechaAtencion,
      descripcion: row.descripcion,
      horas: row.horas}
  }
}


 
