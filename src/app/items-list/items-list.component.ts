import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule, MatDialog } from '@angular/material';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GodService } from '../services/god.service';
import { Category } from '../models/category';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Product } from '../models/product';

/*
const PRODUCT_DATA: Product[] = [
  {code: 112, name: 'Brufen', manufacturer: 'Bosnalijek', stock: 12, prescription: false, price: 12.75, additional: 'Lorem ipsum'},
  {code: 113, name: 'Kafetin', manufacturer: 'Bosnalijek', stock: 25, prescription: false, price: 6.75, additional: 'Lorem ipsum'},
  {code: 114, name: 'Paracetamol', manufacturer: 'Bosnalijek', stock: 321, prescription: true, price: 14.75, additional: 'Lorem ipsum'}
];
*/
@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})

export class ItemsListComponent implements AfterViewInit {

  private dataSource;
  private PRODUCT_DATA;


  displayedColumns: string[] = ['code', 'name', 'manufacturer', 'stock', 'prescription', 'price', 'category', 'additional', 'actions'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  async ngAfterViewInit() {
    this.PRODUCT_DATA = await this.godService.getAllProducts();
    this.dataSource = new MatTableDataSource(this.PRODUCT_DATA);
    this.dataSource.sort = this.sort;
  }

  public mapCategories(categories: Array<Category>): string {
    let result = '';
    if (categories.length == 0) { return result; }
    else if (categories.length == 1) {
      result += categories[0]
    }
    else if (categories.length >= 2) {
      for (let i = 0; i < 2; i++) {
        result += categories[i] + ', ';
      }
      result += '...';
    }
    return result;
  }

  deleteProduct(product: Product) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Are you sure?',
        message: 'Are you sure you want to delete product ' + product.name + '?',
        confirm: 'Delete',
        icon: 'delete',
        class: 'delete'
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.PRODUCT_DATA = this.godService.deleteProduct(product);
      }
    });
  }

  restoreProduct(product: Product) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Are you sure?',
        message: 'Are you sure you want to restore product ' + product.name + ' from deleted products?',
        confirm: 'Restore',
        icon: 'restore',
        class: 'restore'
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        product.isDeleted = false;
        this.PRODUCT_DATA = this.godService.updateProduct(product);
      }
    });
  }

  constructor(private godService: GodService,
    private dialog: MatDialog) { }
}
