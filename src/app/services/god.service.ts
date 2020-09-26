import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
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

  private getResourceBody(nameX: string, dataX: Array<any>) {
    return {
      name: nameX,
      data: dataX
    };
  }

  constructor(private http: HttpClient) {

    this.http.post(this.endpoints.getResource, this.getResourceBody('employees.json', []))
    .subscribe( (x: any) => {
      console.log('Sta smo dobili: ', x);
      this.employees = x.data;
    });
    this.http.post(this.endpoints.getResource, this.getResourceBody('products.json', []))
    .subscribe( (x: any) => {
      console.log("Products data: ", x);
      this.products = x.data;
    });
    this.http.post(this.endpoints.getResource, this.getResourceBody('receipts.json', []))
    .subscribe( (x: any) => {
      this.receipts = x.data;
    });

  }

  public async saveResource(name: string, data: Array<any>) {
    let ddata;
    await this.http.post(this.endpoints.saveResource, this.getResourceBody(name, data))
    .pipe(map( (res: Array<any>) => { ddata = res; })).toPromise();
    return Promise.resolve(ddata);
  }

  public async loadResource(name: string, data: Array<any>) {
    let ddata = [];
    await this.http.post(this.endpoints.getResource, this.getResourceBody(name, data))
    .pipe(map( (res: Array<any>) => { ddata = res; } )).toPromise();
    return Promise.resolve(ddata);
  }


  public async getAllEmployees(): Promise<Employee[]> {
    this.employees = await this.loadResource('employees.json', []);
    return Promise.resolve(this.employees);
  }

  public async getEmployeeByID(id: number): Promise<Employee> {
    this.employees = await this.loadResource('employees.json', []);
    for (const empC of this.employees) {
      if (empC.id == id) {
        return Promise.resolve(empC);
      }
    }
  }

  public async addEmployee(emp: Employee) : Promise<Employee[]> {
    this.employees.push(emp);
    await this.saveResource('employees.json', this.employees);
    return Promise.resolve(this.employees);
    // Save all emp
  }

  public async updateEmployee(emp: Employee) : Promise<Employee[]> {
    for (let i = 0; i < this.employees.length; i++) {
      if (this.employees[i].id == emp.id) {
        this.employees[i] = emp;
      }
    }
    
    await this.saveResource('employees.json', this.employees);
    return Promise.resolve(this.employees);
  }

  public async deleteEmployee(emp: Employee) : Promise<Employee[]> {
    const index = this.employees.indexOf(emp);
    this.employees.splice(index,1);
    await this.saveResource('employees.json', this.employees);
    return Promise.resolve(this.employees);
  }


  public async getAllProducts(): Promise<Product[]> {
    this.products = await this.loadResource('products.json', []);
    return Promise.resolve(this.products);
  }

  public async getProductByID(id: number): Promise<Product> {
    this.products = await this.loadResource('products.json', []);
    for (const prod of this.products) {
      if (prod.code == id) {
        return Promise.resolve(prod);
      }
    }
  }

  public async addProduct(prod: Product): Promise<Product[]> {
    this.products.push(prod);
    await this.saveResource('products.json', this.products);
    return Promise.resolve(this.products);
  }

  public async updateProduct(prod: Product): Promise<Product[]> {
    for (let prodC of this.products) {
      if (prodC.code == prod.code) {
        prodC = prod;
      }
    }
    await this.saveResource('products.json', this.products);
    return Promise.resolve(this.products);
  }

  public async deleteProduct(prod: Product) : Promise<Product[]> {
    const index = this.products.indexOf(prod);
    this.products.splice(index,1);
    await this.saveResource('products.json', this.products);
    return Promise.resolve(this.products);
  }

  public async getAllReceipts(): Promise<Receipt[]> {
    this.receipts = await this.loadResource('receipts.json', []);
    return Promise.resolve(this.receipts);
  }

  public async getReceiptByID(id: number): Promise<Receipt> {
    this.receipts = await this.loadResource('receipts.json', []);
    for (const rec of this.receipts) {
      if (rec.id == id) {
        return Promise.resolve(rec);
      }
    }
  }

  public async addReceipt(rec: Receipt) : Promise<Receipt[]> {
    this.receipts.push(rec);
    await this.saveResource('receipts.json', this.receipts);
    return Promise.resolve(this.receipts);
  }

  public stornReceipt(rec: Receipt) {
    const index = this.receipts.indexOf(rec);
    for (const item of rec.items) {
      const productIndex = this.products.indexOf(item.product);
      const product = this.products[productIndex];
      this.updateProduct(new Product ({
        id: product.code,
        manufacturer: product.manufacturer,
        name: product.name,
        stock: product.stock + item.amount,
        perscription: product.perscription,
        price: product.price,
        note: product.note,
        categories: product.categories
      }));
    }
    this.receipts.splice(index,1);
      this.saveResource('products.json', this.products);
    this.saveResource('receipts.json', this.receipts);
  }



}
