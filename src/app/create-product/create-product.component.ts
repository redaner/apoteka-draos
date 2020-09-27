import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GodService } from '../services/god.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  id : number;
  product: any;
  productForm: FormGroup;
  show = false;
  categories = ['cat1', 'cat2', 'cat3'];
  selected = -1;

  constructor( private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private godService: GodService,
    private router: Router) { }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      name: [null, Validators.required],
      manufacturer: [null, Validators.required],
      stock: [null, Validators.required],
      prescription: [null, Validators.required],
      price: [null, Validators.required],
      note: null,
      categories: [null, Validators.required]
    });

    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.godService.getProductByID(this.id).then(s => {
        this.product = s;
        this.productForm.patchValue(this.product);
      });
    }
   }

  submit() {
    if (!this.productForm.valid) {
      this.show = true;
      return;
    }
    this.godService.getAllProducts().then(products => {
      let maximumID = Math.max.apply(Math, products.map(function(o) { return o.code; }))
      let newProductID = maximumID + 1;

      if (this.id) {
        let updatedProduct = new Product(this.productForm.value);
        updatedProduct.code = this.id;
        this.godService.updateProduct(updatedProduct);
      } else {
        let newProduct = new Product(this.productForm.value);
        newProduct.code = newProductID;
        this.godService.addProduct(newProduct);
      }

      this.router.navigate(['/products']);
    });
  }


}
