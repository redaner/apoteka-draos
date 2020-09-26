
export class Employee {
  id: number;
  name: string;
  role: string;
  birthDate: Date;
  hireDate: Date;
  email: string;
  password: string;

  constructor(data?: any) {
    this.id = data.id;
    this.name = data.name;
    this.role = data.role;
    this.birthDate = data.birthDate;
    this.hireDate = data.hireDate;
    this.email = data.email;
    this.password = data.password;
  }
}
