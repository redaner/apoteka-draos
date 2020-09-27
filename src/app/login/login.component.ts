import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GodService } from '../services/god.service';
import { Employee } from '../models/employee';
import { AuthService } from '../auth.service';

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
  invalidInput = false;

  constructor( private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private godService: GodService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  submit() {
    if(!this.loginForm.valid) {
      this.show = true;
      return;
    }

    this.godService.getAllEmployees().then(employees => {
      let emp = employees.find(e => e.email == this.loginForm.value.email);
      if (!emp) {
        this.invalidInput = true;
        return;
      } 

      if (emp.password != this.loginForm.value.password) {
        this.invalidInput = true;
        return;
      }
    })

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value); 
    }
  }

  updateInvalidInput() {
    this.invalidInput = false;
  }

}
