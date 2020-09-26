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
  private invalidInput = false;
  private invalidArrayIDs: Array<number> = [];
  private receipt: Receipt;

  displayedColumns: string[] = ['code', 'name', 'manufacturer', 'stock', 'prescription', 'price', 'additional', 'actions'];
  displayedColumnsCheckout: string[] = ['code', 'name', 'amount', 'price', 'actions'];

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
    if (index != -1) {
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
    console.log(item);
    const index = this.CHECKOUT_DATA.findIndex(x => x.code == item.code);
    this.CHECKOUT_DATA.splice(index, 1);
    const iindex = this.invalidArrayIDs.findIndex(x => x == item.code);
    if(iindex != -1) this.invalidArrayIDs.splice(iindex, 1);
    this.invalidInput = this.invalidArrayIDs.length != 0;
    this.updateCheckoutItems();
  }

  updateCheckoutItems() {
    this.checkoutItems = new MatTableDataSource(this.CHECKOUT_DATA);
  }


  findNextID(receipts: Array<any>) {
    let max = -1;
    receipts.forEach(a => { if (a.id > max) { max = a.id; } });
    return max == -1 ? 1 : max + 1;
  }

  mapCheckoutItemsToReceipt() {
    const items: ReceiptItem[] = [];
    debugger
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
    const pIndex = this.PRODUCT_DATA.findIndex(x=> x.code == element.code);
    let maxValue = pIndex != -1 ? this.PRODUCT_DATA[pIndex].stock : 0;
    if (!Number.isInteger(Number(event.target.value)) || event.target.value>maxValue) {
      this.invalidInput = true;
      let invalid_index = this.invalidArrayIDs.findIndex(x => x == element.code);
      if (invalid_index == -1) {
        this.invalidArrayIDs.push(element.code);
      }
      const index = this.CHECKOUT_DATA.findIndex(x => x.code == element.code);
      if (index != -1) {
        this.CHECKOUT_DATA[index].price = 0;
        this.updateCheckoutItems();
      }
      return;
    }
    let iindex = this.invalidArrayIDs.findIndex(x => x == element.code);
    if(iindex != -1)
      this.invalidArrayIDs.splice(iindex,1);
    this.invalidInput = false;
    const pindex = this.PRODUCT_DATA.findIndex(x => x.code == element.code);
    const index = this.CHECKOUT_DATA.findIndex(x => x.code == element.code);
    if (index != -1) {
      this.CHECKOUT_DATA[index].amount = parseInt(event.target.value, 10);
      this.CHECKOUT_DATA[index].price = Number((parseInt(event.target.value, 10) * this.PRODUCT_DATA[pindex].price).toFixed(2));
      this.updateCheckoutItems();
    }
  }
/*
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
*/
  async issueReceipt() {
    if(this.CHECKOUT_DATA.length == 0) {
      alert("You cannot issue receipt with no items on it.");
      return;
    }
    this.receipt = new Receipt({
      id : this.findNextID(this.RECEIPTS_DATA),
      items : this.mapCheckoutItemsToReceipt(),
      total : this.calculateTotal(),
      date : new Date(),
      employee : 'Mirza Mesihovic'
    });

    this.RECEIPTS_DATA = await this.godService.addReceipt(this.receipt);
    await this.updateProductData(this.receipt);

    this.PRODUCT_DATA = await this.godService.saveResource('products.json', this.PRODUCT_DATA);
    this.CHECKOUT_DATA = [];
    this.updateCheckoutItems();
    //this.updateFilteredItems();
    alert("USPJESNO IZDAN RACUN");
    console.log(this.receipt);
  }

  async updateProductData(receipt: Receipt) {
    receipt.items.forEach(item => {
      let index = this.PRODUCT_DATA.findIndex( y => y.code == item.product.code);
      if(index != -1) {
        this.PRODUCT_DATA[index].stock -= item.amount;
      }
    });

  }

  constructor(private godService: GodService) { }
}
