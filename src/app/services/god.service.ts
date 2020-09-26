import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Employee } from '../models/employee';
import { Product } from '../models/product';
import { Receipt } from '../models/receipt';

export interface RequestBody {
  name: string;
  data: Array<any>[];
}

@Injectable()
export class GodService {

  private endpoints = {
    saveResource : 'http://localhost:3000/resources/save',
    getResource : 'http://localhost:3000/resources/get'
  };


  public employees: Employee[];
  public products: Product[];
  public receipts: Receipt[];
  private reqBody: RequestBody;

  private getResourceBody(nameX: string, dataX: Array<any>[]) {
    return {
      name: nameX,
      data: dataX
    };
  }

  constructor(private http: HttpClient) {

    this.http.post(this.endpoints.getResource, this.getResourceBody('employees.json', []))
    .subscribe( (x: any) => {
      this.employees = x.data;
    });
    this.http.post(this.endpoints.getResource, this.getResourceBody('products.json', []))
    .subscribe( (x: any) => {
      this.products = x.data;
    });
    this.http.post(this.endpoints.getResource, this.getResourceBody('receipts.json', []))
    .subscribe( (x: any) => {
      this.receipts = x.data;
    });

  }

  private saveResource(name: string, data: Array<any>) {
    this.http.post(this.endpoints.saveResource, this.getResourceBody(name, data))
    .subscribe( (x: any) => {
      console.log(x);
    });
  }

  private loadResource(name: string, data: Array<any>) {
    this.http.post(this.endpoints.getResource, this.getResourceBody(name, data))
    .subscribe( (x: any) => {
      if (name === 'employees.json') {
        this.employees = x.data;
      } else if (name === 'products.json') {
        this.products = x.data;
      } else if (name === 'receipts.json') {
              this.receipts = x.data;
      }
    });

  }


  public getAllEmployees(): Employee[] {
    this.loadResource('employees.json', []);
    return this.employees;
  }

  public getEmployeeByID(id: number): Employee {
    this.loadResource('employees.json', []);
    for (const empC of this.employees) {
      if (empC.id === empC.id) {
        return empC;
      }
    }
  }

  public addEmployee(emp: Employee) {
    this.employees.push(emp);
    this.saveResource('employees.json', this.employees);
    // Save all emp
  }

  public updateEmployee(emp: Employee) {
    for (let empC of this.employees) {
      if (empC.id === emp.id) {
        empC = emp;
      }
    }
    this.saveResource('employees.json', this.employees);
  }

  public deleteEmployee(emp: Employee) {
    const index = this.employees.indexOf(emp);
    this.employees.splice(index);
    this.saveResource('employees.json', this.employees);
  }


  public getAllProducts(): Product[] {
    this.loadResource('products.json', []);
    return this.products;
  }

  public getProductByID(id: number): Product {
    this.loadResource('products.json', []);
    for (const prod of this.products) {
      if (prod.id === id) {
        return prod;
      }
    }
  }

  public addProduct(prod: Product) {
    this.products.push(prod);
    this.saveResource('products.json', this.products);
  }

  public updateProduct(prod: Product) {
    for (let prodC of this.products) {
      if (prodC.id === prod.id) {
        prodC = prod;
      }
    }
    this.saveResource('products.json', this.products);
  }

  public deleteProduct(prod: Product) {
    const index = this.products.indexOf(prod);
    this.products.splice(index);
    this.saveResource('products.json', this.products);
  }

  public getAllReceipts(): Receipt[] {
    this.loadResource('receipts.json', []);
    return this.receipts;
  }

  public getReceiptByID(id: number): Receipt {
    this.loadResource('receipts.json', []);
    for (const rec of this.receipts) {
      if (rec.id === id) {
        return rec;
      }
    }
  }

  public addReceipt(rec: Receipt) {
    this.receipts.push(rec);
    this.saveResource('receipts.json', this.receipts);
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
    this.saveResource('products.json', this.products);
    this.saveResource('receipts.json', this.receipts);
  }



}
