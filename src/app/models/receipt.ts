import { Product } from './product';
import { ReceiptItem } from './receipt-item';

export class Receipt {
  id: number;
  items: ReceiptItem[];
  total: number;
  date: Date;
  employeeID: number;

  constructor(data?: any) {
    this.id = data.id;
    this.items = data.items;
    this.total = data.total;
    this.date = data.date;
    this.employeeID = data.employeeID;
  }
}
