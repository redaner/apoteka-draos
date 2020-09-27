import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GodService } from './services/god.service';

@Injectable()
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(localStorage.getItem("user") != null);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    private godService: GodService
  ) {}

  async login(user: any){
    this.godService.getAllEmployees().then(employees => {
      let emp = employees.find(e => e.email == user.email);
      if (!!emp) {
        if (emp.password == user.password) {
          localStorage.setItem("user", JSON.stringify(emp));
          this.loggedIn.next(true);
          this.router.navigate(['/']);
        }
      }
    })
  }

  logout() {                        
    localStorage.removeItem("user");   
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}