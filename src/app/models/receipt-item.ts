import { Product } from './product';

export class ReceiptItem {
  product: Product;
  amount: number;

  constructor(data?: any) {
    if (!!data) {
      this.product = data.product;
      this.amount = data.amount;
    }
  }
}
