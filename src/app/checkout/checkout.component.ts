import { summaryFileName } from '@angular/compiler/src/aot/util';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatIconModule, MatSnackBar, MatTab } from '@angular/material';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GodService } from '../services/god.service';
import { Product } from '../models/product';
import { Receipt } from '../models/receipt';
import { DatePipe } from '@angular/common';
import { ReceiptItem } from '../models/receipt-item';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';

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

export class CheckoutComponent implements AfterViewInit, OnInit {

  private PRODUCT_DATA: Array<Product>;
  private CHECKOUT_DATA: Array<CheckoutItem> = [];
  private FILTERED_DATA: Array<Product>;
  private RECEIPTS_DATA;
  public dataSource;
  public invalidInput = false;
  public checkoutItems;
  public filterForm: FormGroup;
  private invalidArrayIDs: Array<number> = [];
  private receipt: Receipt;
  categories = ['cat1', 'cat2', 'cat3'];

  displayedColumns: string[] = ['code', 'name', 'manufacturer', 'stock', 'prescription', 'price', 'category', 'additional', 'actions'];
  displayedColumnsCheckout: string[] = ['code', 'name', 'amount', 'price', 'actions'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      search: [null],
      categories: [null],
      prescription: [null]
    });
  }

  async ngAfterViewInit() {
    this.PRODUCT_DATA = await this.godService.getAllProducts();
    this.FILTERED_DATA = this.PRODUCT_DATA.filter((p: Product) => !p.isDeleted)
    this.RECEIPTS_DATA = await this.godService.getAllReceipts();
    this.dataSource = new MatTableDataSource(this.FILTERED_DATA);
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

  getCurrentEmployee() : string {
    let e = JSON.parse(localStorage.getItem("user"));
    return e.name;
  }

  async issueReceipt() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Are you sure?',
        message: 'Are you sure you want to issue this receipt?',
        confirm: 'Yes',
        icon: 'receipt',
        class: 'receipt'
      }
    });

    confirmDialog.afterClosed().subscribe(async result => {
      if (result) {
        this.receipt = new Receipt({
          id : this.findNextID(this.RECEIPTS_DATA),
          items : this.mapCheckoutItemsToReceipt(),
          total : this.calculateTotal(),
          date : new Date(),
          employee : this.getCurrentEmployee()
        });

        this.RECEIPTS_DATA = await this.godService.addReceipt(this.receipt);
        await this.updateProductData(this.receipt);

        this.PRODUCT_DATA = await this.godService.saveResource('products.json', this.PRODUCT_DATA);

        for (let i = 0; i < this.FILTERED_DATA.length; i++) {
          let product = this.PRODUCT_DATA.find(p => p.code == this.FILTERED_DATA[i].code);
          this.FILTERED_DATA[i] = product;
        }

        this.CHECKOUT_DATA = [];
        this.updateCheckoutItems();
        //this.updateFilteredItems();
        this._snackBar.open("Receipt successfully issued!", "Dismiss", {
          duration: 2000,
          panelClass: 'notif-success'
        });
        console.log(this.receipt);
      }
    });

  }

  async updateProductData(receipt: Receipt) {
    receipt.items.forEach(item => {
      let index = this.PRODUCT_DATA.findIndex( y => y.code == item.product.code);
      if(index != -1) {
        this.PRODUCT_DATA[index].stock -= item.amount;
      }
    });

  }

  emptyReceipt() {
    return this.CHECKOUT_DATA.length == 0;
  }

  public mapCategories(categories: Array<string>): string {
    let result = '';
    if (categories.length == 0) { return result; }
    else if (categories.length == 1) {
      result += categories[0]
    }
    else if (categories.length == 2) {
      result += categories[0]+', '+categories[1]
    }
    else if (categories.length >= 2) {
      for (let i = 0; i < 2; i++) {
        result += categories[i] + ', ';
      }
      result += '...';
    }
    return result;
  }

  search() {
    this.FILTERED_DATA = this.PRODUCT_DATA.filter((pd: Product) => {
      let val = this.filterForm.value.search;
      if (val == null) {
        val = "";
      }

      return pd.code.toString().includes(val) ||
      pd.name.toLowerCase().includes(val.toLowerCase()) ||
      pd.manufacturer.toLowerCase().includes(val.toLowerCase())
    })

    this.FILTERED_DATA = this.FILTERED_DATA.filter((pd: Product) => {
      let productCategories = pd.categories;
      let cats = this.filterForm.value.categories;
      let check = true;
      for(let i=0;i<cats.length;i++) {
        if(!productCategories.includes(cats[i])) {
          check = false;
          break;
        }
      }
      return check;
    })

    this.dataSource = new MatTableDataSource(this.FILTERED_DATA);
  }

  constructor(private godService: GodService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder) { }
}
