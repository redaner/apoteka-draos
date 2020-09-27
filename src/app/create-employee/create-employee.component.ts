import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../models/employee';
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
    private godService: GodService,
    private router: Router,
    private _snackBar: MatSnackBar) { 
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
    if (this.id) {
      this.godService.getEmployeeByID(this.id).then(s => {
        this.employee = s;
        this.employeeForm.patchValue(this.employee);
      });
    }
  }

  submit() {
    if (!this.employeeForm.valid) {
      this.show = true;
      return;
    }
    
    this.godService.getAllEmployees().then(async employees => {
      let maximumID = Math.max.apply(Math, employees.map(function(o) { return o.id; }))
      let newUserID = maximumID + 1;

      if (this.id) {
        let updatedEmployee = new Employee(this.employeeForm.value);
        updatedEmployee.id = this.id;
        await this.godService.updateEmployee(updatedEmployee);
      } else {
        let newEmployee = new Employee(this.employeeForm.value);
        newEmployee.id = newUserID;
        await this.godService.addEmployee(newEmployee);
      }

      this._snackBar.open(("Employee successfully " + (this.id ? "updated!" : "created!")), "Dismiss", {
        duration: 2000,
        panelClass: 'notif-success'
      });

      this.router.navigate(['/employees']);
    })
  }

}
