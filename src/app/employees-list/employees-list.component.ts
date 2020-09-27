import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatIconModule } from '@angular/material';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Employee } from '../models/employee';
import { GodService } from '../services/god.service';
// export interface Employee {
//   id: number;
//   name: string;
//   position: string;
//   age: number;
//   hireDate: Date;
// }
/*
const EMPLOYEE_DATA: Employee[] = [
  {id: 1, name: 'Edin Dzeko', position: 'CEO', age: 42, hireDate: new Date(2018, 1, 1)},
  {id: 2, name: 'Miralem Pjanic', position: 'Manager', age: 32, hireDate: new Date(2019, 1, 1)},
  {id: 3, name: 'Ibrahim Sehic', position: 'Pharmacist', age: 24, hireDate: new Date(2019, 2, 25)},
];
*/
@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})

export class EmployeesListComponent implements AfterViewInit {

  private EMPLOYEE_DATA;
  public dataSource;

  displayedColumns: string[] = ['id', 'name', 'role', 'birthDate', 'hireDate', 'email', 'actions'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  async ngAfterViewInit() {
    this.EMPLOYEE_DATA = await this.godService.getAllEmployees();
    this.dataSource = new MatTableDataSource(this.EMPLOYEE_DATA);
    this.dataSource.sort = this.sort;
  }

  constructor(private godService: GodService,
    private dialog: MatDialog) { }

  getDate(date: string) {
    return new Date(date);
  }

  deleteEmployee(employee: Employee) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Are you sure?',
        message: 'Are you sure you want to delete employee ' + employee.name + '?',
        confirm: 'Delete',
        icon: 'delete',
        class: 'delete'
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.EMPLOYEE_DATA = this.godService.deleteEmployee(employee);
      }
    });
  }
}
