export class Product {
  code: number;
  name: string;
  manufacturer: string;
  stock: number;
  perscription: boolean;
  price: number;
  note: string;
  categories: string[];

  constructor(data?: any) {
      if (!!data) {
          this.code = data.code;
          this.name = data.name;
          this.manufacturer = data.manufacturer;
          this.stock = data.stock;
          this.perscription = data.perscription;
          this.price = data.price;
          this.note = data.note;
          this.categories = data.categories;
      }
  }
}
