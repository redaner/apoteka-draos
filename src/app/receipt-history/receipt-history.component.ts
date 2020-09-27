import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Receipt } from '../models/receipt';
import { GodService } from '../services/god.service';
import { MatDialog, MatTableDataSource, MatSnackBar, MatSort } from '@angular/material';
import { CheckoutItem } from '../checkout/checkout.component';
import { ReceiptItem } from '../models/receipt-item';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Product } from '../models/product';

@Component({
  selector: 'app-receipt-history',
  templateUrl: './receipt-history.component.html',
  styleUrls: ['./receipt-history.component.css']
})


export class ReceiptHistoryComponent implements AfterViewInit {

  private RECEIPTS_DATA: Array<Receipt> = [];
  private CHECKOUT_DATA: Array<CheckoutItem> = [];
  public currentReceipt: Receipt;
  public dataSource;
  public receiptItems;

  displayedColumns: string[] = ['id', 'date', 'employee', 'receipt-unique-items', 'receipt-total-items', 'total'];
  displayedColumnsCheckout: string[] = ['code', 'name', 'amount', 'price'];

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private godService: GodService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  getDate(date: string) {
    return new Date(date);
  }

  totalProducts(receipt: Receipt) {
    let sum = 0;
    receipt.items.forEach(x => sum += x.amount);
    return sum;
  }

  async ngAfterViewInit() {
    this.RECEIPTS_DATA = await this.godService.getAllReceipts();
    this.dataSource = new MatTableDataSource(this.RECEIPTS_DATA);
    this.CHECKOUT_DATA = [];
    this.receiptItems = new MatTableDataSource(this.CHECKOUT_DATA);
    this.dataSource.sort = this.sort;
  }

  mapReceiptToCheckoutItems(receipt: Receipt) {
    this.CHECKOUT_DATA = [];
    receipt.items.forEach((x: ReceiptItem) => {
      this.CHECKOUT_DATA.push({
        code: x.product.code,
        name: x.product.name,
        amount: x.amount,
        price: x.product.price * x.amount
      });
    });
    this.receiptItems = new MatTableDataSource(this.CHECKOUT_DATA);
  }

  calculateTotal() {
    let sum = 0;
    this.CHECKOUT_DATA.forEach(a => sum += a.price);
    return sum;
  }

  selectReceipt(receipt: Receipt) {
    this.currentReceipt = receipt;
    this.mapReceiptToCheckoutItems(receipt);
  }

  cancelReceipt() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Are you sure?',
        message: 'Are you sure you want to cancel this receipt?',
        confirm: 'Yes',
        icon: 'receipt',
        class: 'receipt'
      }
    });

    confirmDialog.afterClosed().subscribe(async result => {
      if (result) {
        const index = this.RECEIPTS_DATA.indexOf(this.currentReceipt);
        const products = await this.godService.getAllProducts();

        for (const item of this.currentReceipt.items) {
          const product = products.filter((p: Product) => p.code == item.product.code)[0];
          debugger;
          this.godService.updateProduct(new Product({
            code: product.code,
            name: product.name,
            manufacturer: product.manufacturer,
            stock: product.stock + item.amount,
            prescription: product.prescription,
            price: product.price,
            note: product.note,
            isDeleted: product.isDeleted,
            categories: product.categories
          }));
        }

        this.RECEIPTS_DATA.splice(index, 1);
        this.currentReceipt = null;
        // this.saveResource('products.json', this.products);
        let newReceipts = await this.godService.saveResource('receipts.json', this.RECEIPTS_DATA);

        this.RECEIPTS_DATA = newReceipts;
        this.CHECKOUT_DATA = [];
        this.dataSource = new MatTableDataSource(this.RECEIPTS_DATA);
        this.receiptItems = new MatTableDataSource(this.CHECKOUT_DATA);
      }
    });
  }

  /*const index = this.receipts.indexOf(rec);
    for (const item of rec.items) {
      const productIndex = this.products.indexOf(item.product);
      const product = this.products[productIndex];
      this.updateProduct(new Product ({
        code: product.code,
        name: product.name,
        manufacturer: product.manufacturer,
        stock: product.stock + item.amount,
        prescription: product.prescription,
        price: product.price,
        note: product.note,
        isDeleted: product.isDeleted,
        categories: product.categories
      }));
    }
    this.receipts.splice(index, 1);
    this.saveResource('products.json', this.products);
    this.saveResource('receipts.json', this.receipts);*/

  /*async issueReceipt() {
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

  }*/
}
