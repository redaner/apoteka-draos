import { Category } from './category';

export class Product {
  id: number;
  manufacturer: string;
  name: string;
  currentAmount: number;
  minAmount: number;
  maxAmount: number;
  perscriptionNeeded: boolean;
  price: number;
  note: string;
  categories: Category[];

  constructor(data?: any) {
      if (!!data) {
          this.id = data.id;
          this.manufacturer = data.manufacturer;
          this.name = data.name;
          this.currentAmount = data.currentAmmount;
          this.minAmount = data.minAmount;
          this.maxAmount = data.maxAmount;
          this.perscriptionNeeded = data.perscriptionNeeded;
          this.price = data.price;
          this.note = data.note;
          this.categories = data.categories;
      }
  }
}
