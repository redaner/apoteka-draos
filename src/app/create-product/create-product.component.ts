import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  productForm: FormGroup;
  show = false;

  constructor( private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      name: [null, Validators.required],
      manufacturer: [null, Validators.required],
      currentAmount: [null, Validators.required],
      minAmount: [null, Validators.required],
      maxAmount: [null, Validators.required],
      perscriptionNeeded: [null, Validators.required],
      price: [null, Validators.required],
      note: null,
      categories: [null, Validators.required]
    });
  }

  submit() {
    debugger
    if (!this.productForm.valid) {
      this.show = true;
      return;
    }
    console.log(this.productForm.value);
  }

}
