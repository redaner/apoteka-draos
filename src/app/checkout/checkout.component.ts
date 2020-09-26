import { summaryFileName } from '@angular/compiler/src/aot/util';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule, MatTab } from '@angular/material';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GodService } from '../services/god.service';
import { Product } from '../models/product';
import { Receipt } from '../models/receipt';
import { DatePipe } from '@angular/common';
import { ReceiptItem } from '../models/receipt-item';

export interface CheckoutItem {
  code: number;
  name: string;
  amount: number;
  price: number;
}
/*
const PRODUCT_DATA: Product[] = [
  {code: 112, name: 'Brufen', manufacturer: 'Bosnalijek', stock: 12, prescription: false, price: 12.75, additional: 'Lorem ipsum'},
  {code: 113, name: 'Kafetin', manufacturer: 'Bosnalijek', stock: 25, prescription: false, price: 6.75, additional: 'Lorem ipsum'},
  {code: 114, name: 'Paracetamol', manufacturer: 'Bosnalijek', stock: 321, prescription: true, price: 14.75, additional: 'Lorem ipsum'}
];
*/
/*
const CHECKOUT_DATA: CheckoutItem[] = [
  {code: 111, name: 'Brufen', amount: 4, price: 20.00},
  {code: 111, name: 'Brufen', amount: 4, price: 20.00},
  {code: 111, name: 'Brufen', amount: 4, price: 20.00},
  {code: 111, name: 'Brufen', amount: 4, price: 20.00},
  {code: 111, name: 'Brufen', amount: 4, price: 20.00},
  {code: 111, name: 'Brufen', amount: 4, price: 20.00}
];
*/
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent implements AfterViewInit {

  private PRODUCT_DATA: Array<Product>;
  private CHECKOUT_DATA: Array<CheckoutItem> = [];
  private RECEIPTS_DATA;
  private dataSource;
  private checkoutItems;
  private invalidInput: boolean = false;
  private receipt: Receipt;

  displayedColumns: string[] = ['code', 'name', 'manufacturer', 'stock', 'prescription', 'price', 'additional', 'actions'];
  displayedColumnsCheckout: string[] = ['code','name', 'amount', 'price', 'actions'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  async ngAfterViewInit() {
    this.PRODUCT_DATA = await this.godService.getAllProducts();
    this.RECEIPTS_DATA = await this.godService.getAllReceipts();
    this.dataSource = new MatTableDataSource(this.PRODUCT_DATA);
    this.checkoutItems = new MatTableDataSource(this.CHECKOUT_DATA);
    this.dataSource.sort = this.sort;
  }

  calculateTotal() {
    let sum = 0;
    this.CHECKOUT_DATA.forEach(a => sum += a.price);
    return sum;
  }

  addCheckoutItem(item: Product) {
    const index = this.CHECKOUT_DATA.findIndex(x => x.code == item.code);
    if(index != -1) {
      this.CHECKOUT_DATA[index].amount += 1;
      this.CHECKOUT_DATA[index].price += item.price;
    } else {
      this.CHECKOUT_DATA.push( {
        code: item.code,
        name: item.name,
        amount: 1,
        price: item.price
      });
    }
    this.updateCheckoutItems();
  }

  removeCheckoutItem(item: CheckoutItem) {
    const index = this.CHECKOUT_DATA.findIndex(x => x.code == item.code);
    this.CHECKOUT_DATA.splice(index,1);
    this.updateCheckoutItems();
  }

  updateCheckoutItems() {
    this.checkoutItems = new MatTableDataSource(this.CHECKOUT_DATA);
  }

  findNextID(receipts: Array<any>) {
    let max = -1;
    receipts.forEach(a => { if (a.id > max) { max = a.id; } });
    return max + 1;
  }

  mapCheckoutItemsToReceipt() {
    const items: ReceiptItem[] = [];
    this.CHECKOUT_DATA.forEach( x => {
      const pproduct = this.PRODUCT_DATA.find( y => y.code === x.code );
      items.push(new ReceiptItem({
        product: pproduct,
        amount: x.amount
      }));
    });
    return items;
  }


  updateAmountAndPrice(event: any, element: CheckoutItem) {
    console.log(event);
    if(!Number.isInteger(Number(event.target.value))) {
      this.invalidInput = true;
      let index = this.CHECKOUT_DATA.findIndex(x => x.code == element.code);
      if(index != -1) {
        this.CHECKOUT_DATA[index].price = 0;
        this.updateCheckoutItems();
      }
      return;
    }
    this.invalidInput = false;
    let pindex = this.PRODUCT_DATA.findIndex(x => x.code == element.code);
    let index = this.CHECKOUT_DATA.findIndex(x => x.code == element.code);
    if(index != -1) {
      this.CHECKOUT_DATA[index].amount = parseInt(event.target.value, 10);
      this.CHECKOUT_DATA[index].price = Number((parseInt(event.target.value, 10) * this.PRODUCT_DATA[pindex].price).toFixed(2));
      this.updateCheckoutItems();
    }
  }

  mapReceiptToCheckoutItems(receipt: Receipt) {
    this.CHECKOUT_DATA = [];
    receipt.items.forEach( (x: ReceiptItem) => {
      this.CHECKOUT_DATA.push({
        code: x.product.code,
        name: x.product.name,
        amount: x.amount,
        price: x.product.price * x.amount
      });
    });
  }

  issueReceipt() {
    this.receipt.id = this.findNextID(this.RECEIPTS_DATA);
    this.receipt.items = this.mapCheckoutItemsToReceipt();
    this.receipt.total = this.calculateTotal(),
    this.receipt.date = new Date();
    this.receipt.employee = 'Mirza Mesihovic';
    alert(this.receipt);
    console.log(this.receipt);
  }

  constructor(private godService: GodService) { }
}
