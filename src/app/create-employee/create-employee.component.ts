import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GodService } from '../services/god.service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  id: number;
  employeeForm: FormGroup;
  emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
  show = false;
  employee: any;

  constructor( private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private godService: GodService) { 
      console.log(route);
    }

  ngOnInit() {
    this.employeeForm = this.formBuilder.group({
      name: [null, Validators.required],
      role: [null, Validators.required],
      birthDate: [null, Validators.required],
      hireDate: [null, Validators.required],
      email: [null, [Validators.required, Validators.pattern(this.emailRegx)]],
      password: [null, Validators.required]
    });

    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    if (this.id) {
      this.godService.getEmployeeByID(this.id).then(s => {
        this.employee = s;
        console.log("SSS,",this.employee);
        this.employeeForm.patchValue(this.employee);
      });
    }
  }

  submit() {
    debugger
    if (!this.employeeForm.valid) {
      this.show = true;
      return;
    }
    console.log(this.employeeForm.value);
  }

}
