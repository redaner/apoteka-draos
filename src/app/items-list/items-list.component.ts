import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule, MatDialog } from '@angular/material';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GodService } from '../services/god.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Product } from '../models/product';
import { FormBuilder, FormGroup } from '@angular/forms';

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

export class ItemsListComponent implements AfterViewInit, OnInit {

  public  dataSource;
  private PRODUCT_DATA;
  private FILTERED_DATA;
  filterForm: FormGroup;
  categories = ['Digestive', 'Cardiovascular', 'Central nervous', 'Pain', 'Respiratory', 'Contraception', 'Other'];


  displayedColumns: string[] = ['code', 'name', 'manufacturer', 'stock', 'prescription', 'price', 'category', 'additional', 'actions'];

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
    this.FILTERED_DATA = this.PRODUCT_DATA;
    this.dataSource = new MatTableDataSource(this.FILTERED_DATA);
    this.dataSource.sort = this.sort;
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

    confirmDialog.afterClosed().subscribe(async result => {
      if (result) {
        this.PRODUCT_DATA = await this.godService.deleteProduct(product);

        for (let i = 0; i < this.FILTERED_DATA.length; i++) {
          let product = this.PRODUCT_DATA.find(p => p.code == this.FILTERED_DATA[i].code);
          this.FILTERED_DATA[i] = product;
        }

        this.dataSource = new MatTableDataSource(this.FILTERED_DATA);
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

    confirmDialog.afterClosed().subscribe(async result => {
      if (result) {
        product.isDeleted = false;
        this.PRODUCT_DATA = await this.godService.updateProduct(product);

        for (let i = 0; i < this.FILTERED_DATA.length; i++) {
          let product = this.PRODUCT_DATA.find(p => p.code == this.FILTERED_DATA[i].code);
          this.FILTERED_DATA[i] = product;
        }
      }
    });
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
      if(!cats) cats = [];
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
    private formBuilder: FormBuilder) { }
}
