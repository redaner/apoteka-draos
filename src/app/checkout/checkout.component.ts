import { summaryFileName } from '@angular/compiler/src/aot/util';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule, MatTab } from '@angular/material';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
export interface Product {
  code: number;
  name: string;
  manufacturer: string;
  stock: number;
  prescription: boolean;
  price: number;
  additional: string;
}

export interface CheckoutItem {
  name: string;
  amount: number;
  price: number;
}

const PRODUCT_DATA: Product[] = [
  {code: 112, name: 'Brufen', manufacturer: 'Bosnalijek', stock: 12, prescription: false, price: 12.75, additional: 'Lorem ipsum'},
  {code: 113, name: 'Kafetin', manufacturer: 'Bosnalijek', stock: 25, prescription: false, price: 6.75, additional: 'Lorem ipsum'},
  {code: 114, name: 'Paracetamol', manufacturer: 'Bosnalijek', stock: 321, prescription: true, price: 14.75, additional: 'Lorem ipsum'}  
];

const CHECKOUT_DATA: CheckoutItem[] = [
  {name: 'Brufen', amount: 4, price: 20.00},
  {name: 'Brufen', amount: 4, price: 20.00},
  {name: 'Brufen', amount: 4, price: 20.00},
  {name: 'Brufen', amount: 4, price: 20.00},
  {name: 'Brufen', amount: 4, price: 20.00},
  {name: 'Brufen', amount: 4, price: 20.00}
]

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent implements AfterViewInit {

  dataSource = new MatTableDataSource(PRODUCT_DATA);
  checkoutItems = new MatTableDataSource(CHECKOUT_DATA);

  displayedColumns: string[] = ['code', 'name', 'manufacturer', 'stock', 'prescription', 'price', 'additional', 'actions'];
  displayedColumnsCheckout: string[] = ['name', 'amount', 'price'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  calculateTotal() {
    let sum: number = 0;
    CHECKOUT_DATA.forEach(a => sum += a.price);
    return sum;
  }
  
  constructor() { }
}
