import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GodService } from '../services/god.service';
import { Employee } from '../models/employee';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  employees: Employee[];
  loginForm: FormGroup;
  emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
  show = false;

  constructor( private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private godService: GodService) {
      console.log(route);
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, [Validators.required, Validators.pattern(this.emailRegx)]]
    });
  }

  submit() {
    if(!this.loginForm.valid) {
      this.show = true;
      return;
    }
    console.log(this.loginForm.value);
  }

}
