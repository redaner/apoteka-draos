import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Employee } from '../models/employee';
import { Product } from '../models/product';
import { Receipt } from '../models/receipt';


@Injectable()
export class GodService {

  constructor() {

  }

  public employees: Employee[];
  public products: Product[];
  public receipts: Receipt[];

  public getAllEmployees(): Employee[] {
    return this.employees;
  }

  public getEmployeeByID(id: number): Employee {
    for (const empC of this.employees) {
      if (empC.id === empC.id) {
        return empC;
      }
    }
  }

  public addEmployee(emp: Employee) {
    this.employees.push(emp);
    // Save all emp
  }

  public updateEmployee(emp: Employee) {
    for (let empC of this.employees) {
      if (empC.id === emp.id) {
        empC = emp;
      }
    }
  }

  public deleteEmployee(emp: Employee) {
    const index = this.employees.indexOf(emp);
    this.employees.splice(index);
  }


  public getAllProducts(): Product[] {
    return this.products;
  }

  public getProductByID(id: number): Product {
    for (const prod of this.products) {
      if (prod.id === id) {
        return prod;
      }
    }
  }

  public addProduct(prod: Product) {
    this.products.push(prod);
  }

  public updateProduct(prod: Product) {
    for (let prodC of this.products) {
      if (prodC.id === prod.id) {
        prodC = prod;
      }
    }
  }

  public deleteProduct(prod: Product) {
    const index = this.products.indexOf(prod);
    this.products.splice(index);
  }

  public getAllReceipts(): Receipt[] {
    return this.receipts;
  }

  public getReceiptByID(id: number): Receipt {
    for (const rec of this.receipts) {
      if (rec.id === id) {
        return rec;
      }
    }
  }

  public addReceipt(rec: Receipt) {
    this.receipts.push(rec);
  }

  public stornReceipt(rec: Receipt) {
    const index = this.receipts.indexOf(rec);
    for (const item of rec.items) {
      const productIndex = this.products.indexOf(item.product);
      const product = this.products[productIndex];
      this.updateProduct(new Product ({
        id: product.id,
        manufacturer: product.manufacturer,
        name: product.name,
        currentAmount: product.currentAmount + item.amount,
        minAmount: product.minAmount,
        maxAmount: product.maxAmount,
        perscriptionNeeded: product.perscriptionNeeded,
        price: product.price,
        note: product.note,
        categories: product.categories
      }));
    }
    this.receipts.splice(index);
  }



}
