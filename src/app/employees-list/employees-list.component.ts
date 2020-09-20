import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
export interface Employee {
  id: number;
  name: string;
  position: string;
  age: number;
  hireDate: Date;
}

const EMPLOYEE_DATA: Employee[] = [
  {id: 1, name: 'Edin Dzeko', position: 'CEO', age: 42, hireDate: new Date(2018, 1, 1)},
  {id: 2, name: 'Miralem Pjanic', position: 'Manager', age: 32, hireDate: new Date(2019, 1, 1)},
  {id: 3, name: 'Ibrahim Sehic', position: 'Pharmacist', age: 24, hireDate: new Date(2019, 2, 25)},
];

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})

export class EmployeesListComponent implements AfterViewInit {

  dataSource = new MatTableDataSource(EMPLOYEE_DATA);

  displayedColumns: string[] = ['id', 'name', 'position', 'age', 'hireDate', 'actions'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  
  constructor() { }
}
