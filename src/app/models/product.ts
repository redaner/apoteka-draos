export class Product {
  code: number;
  name: string;
  manufacturer: string;
  stock: number;
  prescription: boolean;
  price: number;
  note: string;
  isDeleted: boolean;
  categories: string[];

  constructor(data?: any) {
      if (!!data) {
          this.code = data.code;
          this.name = data.name;
          this.manufacturer = data.manufacturer;
          this.stock = data.stock;
          this.prescription = data.prescription;
          this.price = data.price;
          this.note = data.note;
          this.isDeleted = data.isDeleted;
          this.categories = data.categories;
      }
  }
}
